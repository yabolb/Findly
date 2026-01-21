
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
});

// CLI Arguments
const targetUrl = process.argv[2];
const targetCategory = process.argv[3] || 'others';

if (!targetUrl) {
    console.error("❌ Usage: npx tsx scripts/import-amazon.ts <AMAZON_URL> [CATEGORY]");
    console.error("   Example: npx tsx scripts/import-amazon.ts https://amzn.to/example baby-kids");
    process.exit(1);
}

async function scrapeAndIngest() {
    console.log(`🚀 Starting import for URL: ${targetUrl}`);
    console.log(`📂 Target Category: ${targetCategory}`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set User Agent to avoid immediate blocking
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Wait for key elements (Product Title is usually a good sign)
        await page.waitForSelector('#productTitle', { timeout: 10000 });

        // Extract Data
        const data: any = await page.evaluate(() => {
            const titleEl = document.querySelector('#productTitle');
            const title = titleEl ? (titleEl as HTMLElement).innerText.trim() : null;

            // Price Extraction (Try multiple selectors)
            let price = 0;
            const priceWhole = document.querySelector('.a-price-whole');
            const priceFraction = document.querySelector('.a-price-fraction');

            if (priceWhole) {
                const w = (priceWhole as HTMLElement).innerText.replace(/[^0-9]/g, '');
                const f = priceFraction ? (priceFraction as HTMLElement).innerText.replace(/[^0-9]/g, '') : '00';
                price = parseFloat(`${w}.${f}`);
            }

            // Image Extraction
            const imgEl = document.querySelector('#landingImage') || document.querySelector('#imgBlkFront');
            const image_url = imgEl ? (imgEl as HTMLImageElement).src : null;

            // Description extraction (often tricky, taking first bullet point or intro)
            const descEl = document.querySelector('#feature-bullets ul li span');
            const description = descEl ? (descEl as HTMLElement).innerText : '';

            return { title, price, image_url, description };
        });

        if (!data.title) {
            throw new Error("Could not extract product title. Page might be blocked or invalid.");
        }

        console.log(`✅ Scraped Data:`);
        console.log(`   Title: ${data.title.substring(0, 50)}...`);
        console.log(`   Price: ${data.price} EUR`);
        console.log(`   Image: ${data.image_url}`);

        // DB Insertion
        const dbProduct = {
            title: data.title,
            description: data.description,
            price: data.price,
            currency: 'EUR',
            image_url: data.image_url,
            source_url: targetUrl, // Use the provided URL (likely amzn.to) as ID
            platform: 'amazon',
            category: targetCategory,
            source_network: 'amazon-manual-script'
        };

        const { error } = await supabase
            .from('products')
            .upsert(dbProduct, { onConflict: 'source_url' });

        if (error) {
            // Retry without updated_at if needed triggers
            if (error.message.includes('updated_at')) {
                delete (dbProduct as any).updated_at;
                const { error: retryError } = await supabase
                    .from('products')
                    .upsert(dbProduct, { onConflict: 'source_url' });
                if (retryError) throw retryError;
            } else {
                throw error;
            }
        }

        console.log(`🎉 Successfully ingested into Supabase!`);

        // Log to sync_logs
        await supabase.from('sync_logs').insert({
            platform: 'amazon-single-import',
            status: 'success',
            items_found: 1,
            items_added: 1,
            error_message: null,
            http_status: 200,
            response_time_ms: 0,
            created_at: new Date()
        });

    } catch (err: any) {
        console.error(`❌ Error during process: ${err.message}`);
        // Log failure
        await supabase.from('sync_logs').insert({
            platform: 'amazon-single-import',
            status: 'error',
            items_found: 1,
            items_added: 0,
            error_message: err.message,
            http_status: 500,
            response_time_ms: 0,
            created_at: new Date()
        });
    } finally {
        await browser.close();
    }
}

scrapeAndIngest();
