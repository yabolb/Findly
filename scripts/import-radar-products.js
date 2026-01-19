/**
 * Import specific Amazon products for El Radar article
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Products scraped from Amazon
const products = [
    {
        title: "Amazon Kindle Paperwhite (última generación) | Nuestro Kindle más rápido, con una nueva pantalla sin reflejos y semanas de batería | 16 GB | Con publicidad | Negro",
        price: 169.00,
        image_url: "https://m.media-amazon.com/images/I/61RI4fvXHqL._AC_SX679_.jpg",
        source_url: "https://www.amazon.es/dp/B0CFPXBJ9Y?tag=findly-21",
        platform: "amazon",
        category: "tech-electronics",
        description: "Kindle Paperwhite con pantalla sin reflejos, semanas de batería, y luz cálida ajustable",
        findly_reason: "El regalo perfecto para amantes de la lectura - batería que dura semanas y pantalla sin reflejos"
    },
    {
        title: "Auriculares de diadema inalámbricos Bluetooth Sony WH-CH520, diseño ligero, 50h de batería, carga rápida, ecualizador, llamadas nítidas - Negro",
        price: 31.99,
        image_url: "https://m.media-amazon.com/images/I/61rFE093esL._AC_SX679_.jpg",
        source_url: "https://www.amazon.es/dp/B0BTJD6LCL?tag=findly-21",
        platform: "amazon",
        category: "tech-electronics",
        description: "Auriculares inalámbricos Sony con 50 horas de batería y diseño ultraligero",
        findly_reason: "Calidad de sonido Sony legendaria con 50h de batería - perfecto para cualquier edad"
    },
    {
        title: "Amazon Fire TV Stick 4K Select (última generación): streaming 4K, cientos de miles de películas y series, TV gratuita y en directo",
        price: 35.99,
        image_url: "https://m.media-amazon.com/images/I/51IguUM1vRL._AC_SX679_.jpg",
        source_url: "https://www.amazon.es/dp/B0CN41GMDK?tag=findly-21",
        platform: "amazon",
        category: "tech-electronics",
        description: "Fire TV Stick 4K con Alexa Voice Remote para streaming en 4K",
        findly_reason: "Moderniza cualquier televisor al instante con streaming 4K y control por voz Alexa"
    }
];

async function importProducts() {
    console.log('🚀 Importing 3 Amazon products for El Radar article...\n');

    const importedIds = [];

    for (const product of products) {
        try {
            // Check if product already exists by ASIN
            const { data: existing } = await supabase
                .from('products')
                .select('id, title')
                .eq('source_url', product.source_url)
                .single();

            if (existing) {
                console.log(`⏭️  Already exists: ${product.title.substring(0, 50)}...`);
                console.log(`   ID: ${existing.id}\n`);
                importedIds.push(existing.id);
                continue;
            }

            // Insert new product
            const { data, error } = await supabase
                .from('products')
                .insert([product])
                .select()
                .single();

            if (error) {
                console.error(`❌ Error importing: ${product.title.substring(0, 50)}...`);
                console.error(`   ${error.message}\n`);
            } else {
                console.log(`✅ Imported: ${product.title.substring(0, 50)}...`);
                console.log(`   ID: ${data.id}`);
                console.log(`   Price: ${data.price}€\n`);
                importedIds.push(data.id);
            }
        } catch (err) {
            console.error(`❌ Unexpected error:`, err);
        }
    }

    console.log('═══════════════════════════════════════════════════════\n');
    console.log('🎉 Import complete!\n');
    console.log('📋 Product IDs for your article:\n');

    importedIds.forEach((id, index) => {
        console.log(`   [PRODUCT:${index}] → ${id}`);
    });

    console.log('\n💡 Use these IDs in the ProductPicker, or copy the placeholders above!\n');
}

importProducts();
