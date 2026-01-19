/**
 * Add 3 scraped Amazon products to database
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

const products = [
    {
        title: "Super Sparrow Botella Agua Acero Inoxidable - 500ml",
        description: "BOTELLA DE ACERO INOXIDABLE AISLADA: Mantiene caliente hasta 12h y frío hasta 24h. 2 TAPAS INTERCAMBIABLES: Tapa deportiva para alto flujo y tapa de bambú elegante. Material: Acero inoxidable de alta calidad sin BPA. Capacidad: 500 Mililitros, ideal para deporte, oficina y uso diario.",
        price: 16.95,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/71d5XMthH3L._AC_SX679_.jpg',
        source_url: 'https://amzn.to/3LQo2ys',
        platform: 'amazon',
        category: 'sports-outdoors',
        findly_reason: 'Botella térmica de alta calidad para hidratación diaria.',
        recipients: ['friend', 'partner', 'colleague'],
        occasions: ['birthday', 'gratitude'],
    },
    {
        title: "RITUALS Caja de regalo The Ritual of Ayurveda",
        description: "Contenido: Gel de ducha en espuma, bruma para cuerpo y cabello, aceite de ducha y crema corporal. Fragancia: Delicado aroma a rosas de la India y aceite de almendras dulces. Propiedades: Equilibrantes para encontrar armonía entre cuerpo, mente y alma. Presentación: Cuidadosamente envuelto en un diseño de origami, ideal para regalo.",
        price: 25.90,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/61zGXIS1PDL._AC_SX679_.jpg',
        source_url: 'https://amzn.to/3LHDe0D',
        platform: 'amazon',
        category: 'beauty-personal-care',
        findly_reason: 'Set de spa en casa para relajación total. Regalo elegante y aromático.',
        recipients: ['mother', 'friend', 'partner'],
        occasions: ['birthday', 'mothers-day', 'christmas'],
    },
    {
        title: "RITUALS Caja de regalo The Ritual of Sakura",
        description: "Contenido: Set de baño con productos para el cuidado de la piel. Ingredientes: Basado en leche de arroz y flor de cerezo. Propiedades: Nutritivas y renovadoras para una piel suave y radiante. Fragancia: Aroma suave y relajante inspirado en la primavera japonesa.",
        price: 34.50,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/615Sd+uu3dL._AC_SX679_.jpg',
        source_url: 'https://amzn.to/49r9Rce',
        platform: 'amazon',
        category: 'beauty-personal-care',
        findly_reason: 'Cuidado personal premium con aroma floral. Ideal para mimarse.',
        recipients: ['mother', 'friend', 'partner', 'teacher'],
        occasions: ['birthday', 'mothers-day', 'gratitude'],
    },
];

async function addProducts() {
    console.log('📦 Adding 3 new products to database...\n');

    const { data, error } = await supabase
        .from('products')
        .insert(products)
        .select();

    if (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }

    console.log('✅ Successfully added', data.length, 'products!\n');

    data.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title} - ${p.price}€ (${p.category})`);
    });
}

addProducts();
