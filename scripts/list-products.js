/**
 * List all products in the database
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

async function listProducts() {
    console.log('📦 Fetching all products...\n');

    const { data, error } = await supabase
        .from('products')
        .select('id, title, price, platform, category, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }

    if (data.length === 0) {
        console.log('No products found.');
        return;
    }

    console.log(`Found ${data.length} product(s):\n`);
    data.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title}`);
        console.log(`   ID: ${p.id}`);
        console.log(`   Price: ${p.price} | Platform: ${p.platform} | Category: ${p.category}`);
        console.log(`   Created: ${new Date(p.created_at).toLocaleString('es-ES')}`);
        console.log('');
    });
}

listProducts();
