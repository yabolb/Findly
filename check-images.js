/**
 * Check Product Images in Database
 * 
 * This script queries the products table to see what image URLs are stored
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnv() {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};

    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
            env[match[1].trim()] = match[2].trim();
        }
    });

    return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function checkProductImages() {
    console.log('🔍 Checking Product Images in Database\n');
    console.log('='.repeat(60));

    // Query products
    const { data, error, count } = await supabase
        .from('products')
        .select('id, title, image_url, platform', { count: 'exact' })
        .limit(10);

    if (error) {
        console.error('❌ Query failed:', error.message);
        return;
    }

    console.log(`\n📊 Found ${count} total product(s)\n`);

    if (data && data.length > 0) {
        console.log('📸 Sample Product Images:\n');

        data.forEach((product, index) => {
            console.log(`[${index + 1}] ${product.title.substring(0, 50)}...`);
            console.log(`    Platform: ${product.platform}`);
            console.log(`    Image URL: ${product.image_url || 'NULL/MISSING'}`);
            console.log(`    Valid URL: ${product.image_url ? isValidUrl(product.image_url) : 'N/A'}`);
            console.log('');
        });
    } else {
        console.log('ℹ️  No products found in database');
    }

    console.log('='.repeat(60) + '\n');
}

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

checkProductImages();
