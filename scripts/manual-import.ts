
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

// Check for file argument
const dataFilePath = process.argv[2];
if (!dataFilePath) {
    console.error("❌ Please provide a path to a JSON file containing the products.");
    console.error("Usage: npx tsx scripts/manual-import.ts <path-to-json-file>");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function runImport() {
    // Read and parse the file
    let products = [];
    try {
        const absolutePath = path.resolve(dataFilePath);
        if (!fs.existsSync(absolutePath)) {
            throw new Error(`File not found: ${absolutePath}`);
        }
        const fileContent = fs.readFileSync(absolutePath, 'utf-8');
        products = JSON.parse(fileContent);

        if (!Array.isArray(products)) {
            throw new Error("JSON content must be an array of product objects.");
        }
    } catch (err: any) {
        console.error(`❌ Error reading data file: ${err.message}`);
        process.exit(1);
    }

    console.log(`📦 Starting ingestion of ${products.length} products from ${path.basename(dataFilePath)}...`);

    let success = 0;
    let fail = 0;
    const batchId = `manual-import-${Date.now()}`;

    for (const product of products) {
        // Validate minimal required fields
        if (!product.title || !product.source_url) {
            console.warn(`⚠️ Skipping item with missing title or source_url: ${JSON.stringify(product).substring(0, 50)}...`);
            fail++;
            continue;
        }

        const dbProduct = {
            title: product.title,
            description: product.description || '',
            price: product.price || 0,
            currency: product.currency || 'EUR',
            image_url: product.image_url || '',
            source_url: product.source_url,
            platform: product.platform || 'manual', // Default to manual if missing
            category: product.category || 'others',
            source_network: product.source_network || 'manual_import',
            updated_at: new Date()
        };

        const { error } = await supabase
            .from('products')
            .upsert(dbProduct, { onConflict: 'source_url' });

        if (error) {
            // If the error is schema-related (like the updated_at issue we saw before), try one fallback
            if (error.message.includes('updated_at')) {
                delete dbProduct.updated_at;
                const { error: retryError } = await supabase
                    .from('products')
                    .upsert(dbProduct, { onConflict: 'source_url' });

                if (retryError) {
                    console.error(`❌ Error inserting ${product.title.substring(0, 30)}...:`, retryError.message);
                    fail++;
                } else {
                    console.log(`✅ Inserted (Retry): ${product.title.substring(0, 40)}...`);
                    success++;
                }
            } else {
                console.error(`❌ Error inserting ${product.title.substring(0, 30)}...:`, error.message);
                fail++;
            }
        } else {
            console.log(`✅ Inserted: ${product.title.substring(0, 40)}...`);
            success++;
        }
    }

    // Log to sync_logs
    const { error: logError } = await supabase.from('sync_logs').insert({
        platform: 'manual-import-script',
        status: fail === 0 ? 'success' : 'error',
        items_found: products.length,
        items_added: success,
        error_message: fail > 0 ? `Failed to insert ${fail} items` : null,
        http_status: 200,
        response_time_ms: 0,
        created_at: new Date()
    });

    if (logError) {
        console.error("⚠️ Error creating sync log:", logError.message);
    }

    console.log(`\n🎉 Import Finished. Success: ${success}, Fail: ${fail}`);
}

runImport();
