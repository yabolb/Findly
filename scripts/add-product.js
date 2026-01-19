/**
 * Quick script to add a product to Supabase
 * Usage: node scripts/add-product.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role to bypass RLS

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const product = {
    title: "Philips Quitapelusas – para Todo Tipo de Prendas, Cuchilla de Alta Velocidad 8800 RPM",
    description: "REVIVE PRENDAS ANTIGUAS: El lint shaver elimina rápida y fácilmente las bolitas, pelusas y motas, haciendo que la ropa y las mantas luzcan como nuevas nuevamente. RÁPIDO Y EFECTIVO: La cabeza grande de afeitado trabaja rápido con menos pasadas; 3 tamaños de orificios para eliminar todo tipo de pills. PARA CUALQUIER TEJIDO: La altura ajustable de la cuchilla permite que el sweater shaver y lint remover eliminen pills incluso de los tejidos más delicados.",
    price: 9.99,
    currency: 'EUR',
    image_url: 'https://m.media-amazon.com/images/I/61REpxcoIfL._AC_SX679_.jpg',
    source_url: 'https://www.amazon.es/Philips-Quitapelusas-Cuchilla-Velocidad-Compacto/dp/B00E3862DE?pd_rd_w=efutA&content-id=amzn1.sym.8303e4e0-ff33-4e3a-a0df-6dca8366e606&pf_rd_p=8303e4e0-ff33-4e3a-a0df-6dca8366e606&pf_rd_r=AJYC67R9QB3JPDABQ883&pd_rd_wg=zB4j3&pd_rd_r=e4ef938b-4d22-46a9-8807-d0b39981f872&pd_rd_i=B00E3862DE&th=1&linkCode=sl1&tag=findly01-21&linkId=f6dafda4f16d1d454e72a4fdfb0a917a&language=es_ES&ref_=as_li_ss_tl',
    platform: 'amazon',  // Must be lowercase per DB constraint
    category: 'home-garden',
    findly_reason: 'Perfecto para mantener la ropa como nueva. Ideal para el hogar y un regalo práctico.',
    recipients: ['mother', 'partner', 'friend'],
    occasions: ['birthday', 'mothers-day', 'christmas'],
};

async function addProduct() {
    console.log('🔄 Adding product to Supabase...\n');
    console.log('Product:', product.title);
    console.log('Price:', product.price, product.currency);
    console.log('Category:', product.category);
    console.log('');

    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

    if (error) {
        console.error('❌ Error adding product:', error.message);
        console.error('Details:', error);
        process.exit(1);
    }

    console.log('✅ Product added successfully!');
    console.log('Product ID:', data[0].id);
    console.log('\nYou can now see this product in your app!');
}

addProduct();
