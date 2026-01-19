/**
 * Verify that all categories are properly configured
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

async function verifyCategories() {
    console.log('🔍 Verifying category configuration...\n');

    // Get all products grouped by category
    const { data: products, error } = await supabase
        .from('products')
        .select('id, title, category, price')
        .order('category', { ascending: true });

    if (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }

    // Group by category
    const categoryGroups = {};
    products.forEach(product => {
        if (!categoryGroups[product.category]) {
            categoryGroups[product.category] = [];
        }
        categoryGroups[product.category].push(product);
    });

    console.log('📊 Products by Category:\n');
    Object.entries(categoryGroups).forEach(([category, items]) => {
        console.log(`✅ ${category}: ${items.length} products`);
    });

    console.log('\n📈 Summary:');
    console.log(`Total Products: ${products.length}`);
    console.log(`Categories Used: ${Object.keys(categoryGroups).length}`);
    console.log(`Total Catalog Value: ${products.reduce((sum, p) => sum + parseFloat(p.price), 0).toFixed(2)} €`);
}

verifyCategories();
