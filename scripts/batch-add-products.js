/**
 * Batch add 10 Amazon products to database
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
        title: "De'Longhi EcoDecalk Descalcificador DLSC500",
        description: "Solución ecológica con ingredientes de origen vegetal. Botella de 500ml suficiente para 5 ciclos de descalcificación. Ayuda a mantener el sabor del café y prolongar la vida útil de la máquina.",
        price: 7.49,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/7135FCZclcL._AC_SX679_.jpg',
        source_url: 'https://www.amazon.es/DeLonghi-Descalcificador-DLSC500-Descalcificaci%C3%B3n-Mantenimiento/dp/B002OHAU0Q?tag=findly01-21',
        platform: 'amazon',
        category: 'home-garden',
        findly_reason: 'Mantén tu cafetera en perfecto estado. Ideal para amantes del café.',
        recipients: ['partner', 'mother', 'father', 'friend'],
        occasions: ['birthday', 'christmas', 'gratitude'],
    },
    {
        title: "Cecotec Batidora de Mano XL Power Pulsar 2300MAX",
        description: "Potencia extrema de 2300W para triturados rápidos. Tecnología CrossBlades con 4 cuchillas recubiertas de titanio negro. Incluye kit de accesorios: vaso de 800ml, picadora y varillas montaclaras.",
        price: 32.90,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/71VK0iA6lOL._AC_SX679_.jpg',
        source_url: 'https://www.amazon.es/Cecotec-CrossBlades-Antisalpicaduras-Ergon%C3%B3mico-Accesorios/dp/B0CZ8P76LN?tag=findly01-21',
        platform: 'amazon',
        category: 'home-garden',
        findly_reason: 'Potente batidora para cocinar como un profesional. Perfecta para quien le gusta cocinar.',
        recipients: ['partner', 'mother', 'friend'],
        occasions: ['birthday', 'christmas', 'wedding', 'mothers-day'],
    },
    {
        title: "Cecotec Calefactor Eléctrico ReadyWarm 2050 Max",
        description: "Potencia máxima de 2000W con termostato regulable. 3 modos: Eco (1000W), Turbo (2000W) y Cool (ventilador). Sistema de seguridad contra sobrecalentamiento y antivuelco.",
        price: 21.99,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/61SFrI33XWL._AC_SY450_.jpg',
        source_url: 'https://www.amazon.es/Cecotec-Calefactor-El%C3%A9ctrico-Termoventilador-funcionamiento/dp/B0D6JK82MF?tag=findly01-21',
        platform: 'amazon',
        category: 'home-garden',
        findly_reason: 'Mantén tu hogar cálido este invierno. Regalo práctico y útil.',
        recipients: ['partner', 'mother', 'father', 'colleague'],
        occasions: ['christmas', 'birthday', 'gratitude'],
    },
    {
        title: "Utopia Bedding Protector Colchón 150 x 200 x 40 cm",
        description: "Membrana impermeable que protege el colchón de líquidos y sudor. Tejido de microfibra transpirable y suave al tacto. Diseño de sábana bajera con elástico ajustable para camas de hasta 40cm de alto.",
        price: 13.52,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/61kREidI11L._AC_SY450_.jpg',
        source_url: 'https://www.amazon.es/Utopia-Bedding-Protector-Impermeable-hipoalerg%C3%A9nico/dp/B082X48R1K?tag=findly01-21',
        platform: 'amazon',
        category: 'home-garden',
        findly_reason: 'Protege tu colchón y duerme tranquilo. Esencial para cualquier hogar.',
        recipients: ['partner', 'friend', 'sibling'],
        occasions: ['wedding', 'birthday', 'anniversary'],
    },
    {
        title: "VACTechPro Aspiradora sin Cable 35kPa",
        description: "Potente succión de 35kPa con motor sin escobillas. Autonomía de 35 minutos y pantalla LED de control. Cepillo motorizado con luces LED para visibilidad en zonas oscuras.",
        price: 109.00,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/71R3A6m6f9L._AC_SY450_.jpg',
        source_url: 'https://www.amazon.es/VACTechPro-V15-Aspiradora-Aspirador-Inal%C3%A1mbrica/dp/B0DHSX48P1?tag=findly01-21',
        platform: 'amazon',
        category: 'home-garden',
        findly_reason: 'Limpieza potente sin cables. Ideal para hogares con mascotas.',
        recipients: ['partner', 'mother', 'father'],
        occasions: ['birthday', 'christmas', 'mothers-day', 'fathers-day'],
    },
    {
        title: "edihome Papel Freidora Aire 100 Unidades",
        description: "Pack de 100 forros de papel desechables y antiadherentes. Material apto para uso alimentario, resistente al calor (hasta 220°C). Compatible con freidoras de aire de gran tamaño (5L a 8L).",
        price: 8.89,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/81E1wR3T-NL._AC_SL1500_.jpg',
        source_url: 'https://www.amazon.es/edihome-Freidora-Unidades-Desechable-Accesorios/dp/B0D3VCVP48?tag=findly01-21',
        platform: 'amazon',
        category: 'home-garden',
        findly_reason: 'Accesorio perfecto para tu freidora de aire. Cocina sin ensuciar.',
        recipients: ['partner', 'mother', 'friend'],
        occasions: ['gratitude', 'birthday'],
    },
    {
        title: "Utopia Bedding Juego de Sábanas 4 Piezas 150x200",
        description: "Tejido de microfibra cepillada resistente a las arrugas y a la decoloración. Incluye sábana encimera, sábana bajera ajustable y 2 fundas de almohada. Certificación Oeko-Tex Standard 100 de ausencia de sustancias nocivas.",
        price: 16.14,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/71pPH0-o8LL._AC_SY450_.jpg',
        source_url: 'https://www.amazon.es/Utopia-Bedding-resistente-manchas-Matrimonio/dp/B075JJRFVV?tag=findly01-21',
        platform: 'amazon',
        category: 'home-garden',
        findly_reason: 'Sábanas suaves y duraderas para un descanso perfecto. Regalo práctico y elegante.',
        recipients: ['partner', 'sibling', 'friend'],
        occasions: ['wedding', 'birthday', 'anniversary'],
    },
    {
        title: "Spontex Estropajos con Esponja 5 Unidades",
        description: "Pack de 5 estropajos con esponja de poliuretano. Cara abrasiva para suciedad difícil y esponja para mayor absorción. Diseño ergonómico para un agarre cómodo durante la limpieza.",
        price: 1.14,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/71-0k2Vv6EL._AC_SY450_.jpg',
        source_url: 'https://www.amazon.es/Spontex-61590001-Estropajos-Poliuretano-Unidades/dp/B008L0WJJE?tag=findly01-21',
        platform: 'amazon',
        category: 'home-garden',
        findly_reason: 'Lo esencial para la limpieza del hogar. Práctico y económico.',
        recipients: ['mother', 'colleague', 'friend'],
        occasions: ['gratitude'],
    },
    {
        title: "Tefal Daily Cook Sartén 24 cm",
        description: "Revestimiento antiadherente de titanio de larga duración. Indicador térmico Thermo-Signal que cambia de color al alcanzar la temperatura ideal. Base reforzada a prueba de impactos compatible con todas las cocinas (incluido inducción).",
        price: 20.99,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/81C6N9XhCGL._AC_SY450_.jpg',
        source_url: 'https://www.amazon.es/Tefal-Daily-Cook-antiadherente-inoxidable/dp/B079HT8Y8G?tag=findly01-21',
        platform: 'amazon',
        category: 'home-garden',
        findly_reason: 'Cocina de forma profesional con tecnología Tefal. Regalo perfecto para amantes de la cocina.',
        recipients: ['partner', 'mother', 'friend', 'sibling'],
        occasions: ['birthday', 'mothers-day', 'wedding'],
    },
    {
        title: "Cecotec Freidora de Aire Cecofry Bombastik 6L",
        description: "Gran capacidad de 6 litros para cocinar raciones familiares. Tecnología PerfectCook para una cocción homogénea con aire caliente. Panel de control táctil multifunción con 12 modos predefinidos.",
        price: 49.90,
        currency: 'EUR',
        image_url: 'https://m.media-amazon.com/images/I/71Y97Jq9FSL._AC_SL1500_.jpg',
        source_url: 'https://www.amazon.es/Cecotec-Accesorios-Tecnolog%C3%ADa-PerfectCook-Temperatura/dp/B0D68RYFQY?tag=findly01-21',
        platform: 'amazon',
        category: 'home-garden',
        findly_reason: 'Cocina saludable sin aceite. Perfecta para familias que cuidan su salud.',
        recipients: ['partner', 'mother', 'father', 'friend'],
        occasions: ['birthday', 'christmas', 'mothers-day', 'wedding'],
    },
];

async function batchAdd() {
    console.log('📦 Adding', products.length, 'products to database...\n');

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

    console.log('\n🎉 Database now has', data.length + 1, 'real Amazon products!');
    console.log('💰 Total catalog value:', products.reduce((sum, p) => sum + p.price, 0).toFixed(2), '€');
}

batchAdd();
