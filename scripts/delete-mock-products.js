/**
 * Delete all mock/test products (keeping only real Amazon products)
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteMockProducts() {
    console.log('🗑️  Deleting mock products...\n');

    // Delete all products from old secondhand platforms (mock data)
    const { data, error } = await supabase
        .from('products')
        .delete()
        .in('platform', ['wallapop', 'vinted', 'ebay', 'milanuncios'])
        .select();

    if (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }

    console.log(`✅ Deleted ${data.length} mock product(s)`);
    console.log('\nRemaining products: Only real Amazon products!\n');

    // List remaining products
    const { data: remaining } = await supabase
        .from('products')
        .select('id, title, platform')
        .order('created_at', { ascending: false });

    if (remaining && remaining.length > 0) {
        console.log('📦 Current products:');
        remaining.forEach((p, i) => {
            console.log(`${i + 1}. ${p.title} (${p.platform})`);
        });
    } else {
        console.log('No products remaining (database is empty).');
    }
}

deleteMockProducts();
