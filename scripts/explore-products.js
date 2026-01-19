/**
 * Explore products in database for article creation
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function explore() {
    // Get all products grouped by category
    const { data, error } = await supabase
        .from('products')
        .select('id, title, category, price, image_url, findly_reason')
        .order('category');

    if (error) {
        console.log('Error:', error);
        return;
    }

    console.log('TOTAL PRODUCTS:', data.length);
    console.log('');

    // Group by category
    const byCategory = {};
    data.forEach(p => {
        if (!byCategory[p.category]) byCategory[p.category] = [];
        byCategory[p.category].push(p);
    });

    Object.keys(byCategory).sort().forEach(cat => {
        console.log('=== ' + cat.toUpperCase() + ' (' + byCategory[cat].length + ' items) ===');
        byCategory[cat].forEach(p => {
            const hasImg = p.image_url && p.image_url.startsWith('http') ? '✅' : '❌';
            console.log('  ' + hasImg + ' [' + p.id.substring(0, 8) + '] ' + p.price + '€ - ' + p.title.substring(0, 55));
        });
        console.log('');
    });
}

explore();
