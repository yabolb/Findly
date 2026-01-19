/**
 * Batch add 10 Sports & Fitness Amazon products to database
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
        title: "XIAOMI Smartband 10 Pulsera de Actividad",
        description: "Pantalla AMOLED de 1.72'' con bordes ultrafinos y brillo de 1500 nits. Más de 150 modos deportivos con modo de natación avanzado y brújula integrada. Gestión mejorada del sueño con orientación personalizada y nuevos informes detallados.",
        price: 39.99,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/71bRWtpGOAL._AC_SX679_.jpg',
        source_url: 'https://amzn.to/4r0qVf5',
        platform: 'amazon',
        category: 'sports-outdoors',
        findly_reason: 'Pulsera inteligente premium con más de 150 deportes. Perfecta para deportistas y amantes del fitness.',
        recipients: ['teenager', 'partner', 'friend', 'sibling'],
        occasions: ['birthday', 'christmas', 'graduation'],
    },
    {
        title: "Fokky Bandas Elásticas Musculación Set of 5",
        description: "5 niveles de resistencia de 4-30 lbs (Ligero a XX-Heavy). Material duradero, genuino y ecológico, suave para la piel. Multifuncional para fortalecer pecho, espalda, hombros, brazos y piernas.",
        price: 5.69,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/51sVFEQCXXL._AC_SX679_.jpg',
        source_url: 'https://amzn.to/3LQnTLq',
        platform: 'amazon',
        category: 'sports-outdoors',
        findly_reason: 'Set completo de bandas para entrenar en casa. Regalo económico y práctico.',
        recipients: ['partner', 'friend', 'colleague', 'sibling'],
        occasions: ['birthday', 'gratitude', 'christmas'],
    },
    {
        title: "Amazon Basics Par de Mancuernas Neopreno 2 kg",
        description: "Set de 2 mancuernas de 2 kg cada una para entrenamiento de resistencia. Textura de neopreno que proporciona un agarre fácil y seguro. Código de color y número de peso impreso para rápida identificación.",
        price: 15.99,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/81NlaW85aBL._AC_SX679_.jpg',
        source_url: 'https://amzn.to/3NAIt2N',
        platform: 'amazon',
        category: 'sports-outdoors',
        findly_reason: 'Mancuernas ideales para empezar a entrenar en casa. Calidad Amazon Basics.',
        recipients: ['partner', 'mother', 'friend', 'sibling'],
        occasions: ['birthday', 'christmas', 'gratitude'],
    },
    {
        title: "XIAOMI Smart Band 9 Active Pulsera de Actividad",
        description: "Pantalla TFT de 1,47\" con tasa de refresco de 60Hz. Cuerpo ultradelgado de 9.99mm y batería de hasta 18 días. 50 modos deportivos y nivel de resistencia al agua 5 ATM.",
        price: 19.99,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/61G2jzdxGjL._AC_SX679_.jpg',
        source_url: 'https://amzn.to/4r06W00',
        platform: 'amazon',
        category: 'sports-outdoors',
        findly_reason: 'Pulsera deportiva económica con gran autonomía. Perfecta para principiantes en fitness.',
        recipients: ['teenager', 'partner', 'friend', 'sibling'],
        occasions: ['birthday', 'christmas', 'graduation'],
    },
    {
        title: "unycos Mancuernas Antideslizantes de Neopreno 4kg",
        description: "Superficie de neopreno antideslizante, inodora e impermeable. Diseño ergonómico con cabezales anti-rodadura para mayor estabilidad. Núcleo en hierro fundido de alta densidad para mayor durabilidad.",
        price: 22.70,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/61Ilc1vUX-L._AC_SX679_.jpg',
        source_url: 'https://amzn.to/3LLY7b0',
        platform: 'amazon',
        category: 'sports-outdoors',
        findly_reason: 'Mancuernas profesionales con diseño hexagonal. Ideal para entrenamientos intensos.',
        recipients: ['partner', 'father', 'friend', 'sibling'],
        occasions: ['birthday', 'fathers-day', 'christmas'],
    },
    {
        title: "Fokky Gomas Elásticas Musculación Set de 4",
        description: "Fabricadas en material TPE sin látex, suaves y resistentes al desgarro. 4 niveles de resistencia desde 8 lbs hasta 35 lbs. Longitud de 1.8m ideal para estiramiento de cuerpo completo.",
        price: 6.85,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/61G6NF5CDZL._AC_SX679_.jpg',
        source_url: 'https://amzn.to/49O43sf',
        platform: 'amazon',
        category: 'sports-outdoors',
        findly_reason: 'Bandas largas para yoga y pilates. Regalo perfecto para amantes del ejercicio.',
        recipients: ['partner', 'mother', 'friend', 'sibling'],
        occasions: ['birthday', 'mothers-day', 'gratitude'],
    },
    {
        title: "THE HEAT COMPANY Plantillas Calentadoras",
        description: "Más de 8 horas de calor con ingredientes 100% naturales. Extra finas, se adaptan a cualquier zapato. Se activan automáticamente al contacto con el aire.",
        price: 13.99,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/71CHXYTur6L._AC_SY879_.jpg',
        source_url: 'https://amzn.to/4qzNQOC',
        platform: 'amazon',
        category: 'sports-outdoors',
        findly_reason: 'Plantillas térmicas para deportes de invierno. Ideal para esquiadores y montañeros.',
        recipients: ['partner', 'father', 'friend', 'sibling'],
        occasions: ['christmas', 'birthday', 'fathers-day'],
    },
    {
        title: "ATERCEL Guantes Gimnasio para Hombre y Mujer",
        description: "Diseño innovador de la palma que maximiza el agarre y evita callos. Material ligero, transpirable y elástico para máxima flexibilidad. Cierre ajustable para un ajuste personalizado y seguro.",
        price: 10.99,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/71Qa99mgPPL._AC_SX679_.jpg',
        source_url: 'https://amzn.to/3LlPQuv',
        platform: 'amazon',
        category: 'sports-outdoors',
        findly_reason: 'Guantes profesionales para gimnasio. Protege tus manos durante el entrenamiento.',
        recipients: ['partner', 'friend', 'sibling', 'colleague'],
        occasions: ['birthday', 'christmas', 'gratitude'],
    },
    {
        title: "unycos Pelota de Pilates Yoga Fitness 65cm",
        description: "Activa músculos, maximiza equilibrio y mejora flexibilidad. Soporta hasta 300 kg con sistema de protección anti-reventones. Fabricada en PVC extra grueso, incluye hinchador.",
        price: 13.90,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/61D5sybcSAL._AC_SX679_.jpg',
        source_url: 'https://amzn.to/4b77eO6',
        platform: 'amazon',
        category: 'sports-outdoors',
        findly_reason: 'Pelota suiza profesional para pilates y yoga. Perfecta para embarazadas y rehabilitación.',
        recipients: ['partner', 'mother', 'friend', 'sibling'],
        occasions: ['birthday', 'mothers-day', 'christmas'],
    },
    {
        title: "Findway Gafas de Esquí Máscara Snowboard",
        description: "Versión 2025 con alto rendimiento anti-niebla y anti-arañazos. Doble capa de lentes con 100% de protección UV. Diseño OTG (sobre las gafas) para usar con gafas graduadas.",
        price: 22.63,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/61srCRYbeQL._AC_SX679_.jpg',
        source_url: 'https://amzn.to/45kqofA',
        platform: 'amazon',
        category: 'sports-outdoors',
        findly_reason: 'Gafas de esquí premium compatibles con gafas graduadas. Perfectas para la temporada de nieve.',
        recipients: ['partner', 'teenager', 'friend', 'sibling'],
        occasions: ['christmas', 'birthday', 'graduation'],
    },
];

async function batchAdd() {
    console.log('🏃 Adding', products.length, 'sports & fitness products to database...\n');

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
        console.log(`${i + 1}. ${p.title} - ${p.price}€`);
    });

    console.log('\n🎉 Database now has 21 real Amazon products!');
    console.log('💰 New catalog value:', products.reduce((sum, p) => sum + p.price, 0).toFixed(2), '€');
}

batchAdd();
