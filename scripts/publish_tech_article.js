/**
 * Publish Tech Article
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkImage(url) {
    if (!url) return false;
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (e) {
        return false;
    }
}

async function publish() {
    console.log('🚀 Preparing Tech Article...');

    const productTerms = [
        'Amazon Kindle Paperwhite',
        'Auriculares de diadema inalámbricos Bluetooth Sony',
        'Amazon Fire TV Stick 4K',
        'Cecotec Calefactor Eléctrico ReadyWarm', // Smart home comfort
        'VACTechPro Aspiradora sin Cable' // Smart cleaning
    ];

    const relatedIds = [];
    const productsFound = [];

    // 1. Find Products
    for (const term of productTerms) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .ilike('title', `%${term}%`)
            .limit(1)
            .single();

        if (data) {
            console.log(`✅ Found: ${data.title.substring(0, 30)}...`);
            relatedIds.push(data.id);
            productsFound.push(data);
        } else {
            console.warn(`⚠️ Not found: ${term}`);
        }
    }

    // 2. Select Cover Image
    let coverImage = null;
    for (const p of productsFound) {
        if (await checkImage(p.image_url)) {
            coverImage = p.image_url;
            console.log(`📸 Cover Image Selected from: ${p.title}`);
            break;
        }
    }

    // 3. Publish Article
    const article = {
        title: "Tecnología para simplificar tu vida: 5 gadgets imprescindibles",
        slug: "tecnologia-simplificar-vida-gadgets-imprescindibles-2026",
        excerpt: "La tecnología no tiene por qué ser complicada. Estos dispositivos están diseñados para ahorrarte tiempo, mejorar tu entretenimiento y hacer tu hogar más inteligente.",
        category_tag: "tech-electronics",
        related_products: relatedIds,
        content: `<h2>Introducción: Tecnología invisible, soluciones visibles</h2><p>Vivimos rodeados de pantallas, pero la verdadera tecnología inteligente es la que no estorba. La que simplemente funciona, te resuelve un problema y se quita de en medio. En esta lista no encontrarás el último smartphone de 1.500€, sino gadgets prácticos que mejoran genuinamente tu día a día, desde cómo lees hasta cómo limpias tu casa.</p><h2>1. Tu biblioteca entera en 200 gramos: Kindle Paperwhite</h2><p>Si te gusta leer, el Kindle es obvio. Pero el nuevo Paperwhite es otro nivel. Pantalla más grande, luz cálida ajustable para no cansar la vista por la noche y una batería que dura semanas. Es la mejor forma de desconectar de las redes sociales y volver a conectar con las historias, sin cargar con kilos de peso en el bolso.</p>[PRODUCT:0]<h2>2. Sonido premium, precio inteligente: Sony WH-CH520</h2><p>No necesitas gastar una fortuna para tener buena calidad de audio. Estos Sony son los reyes de la gama media: batería de 50 horas (sí, 50), carga rápida y un sonido nítido y equilibrado. Perfectos para teletrabajar, escuchar podcasts o aislarte del ruido del metro. Cómodos, ligeros y de una marca que nunca falla.</p>[PRODUCT:1]<h2>3. Convierte tu tele vieja en una Smart TV: Fire TV Stick 4K</h2><p>¿Tu televisor funciona bien pero su sistema inteligente va lento? No lo cambies. El Fire TV Stick 4K le da una segunda vida. Conéctalo al HDMI y tendrás acceso ultrarrápido a Netflix, Prime, Disney+ y más, todo en resolución 4K. Además, el mando por voz con Alexa es tremendamente útil para buscar películas sin teclear.</p>[PRODUCT:2]<h2>4. Climatización inteligente: calefactor ReadyWarm</h2><p>El hogar del futuro es confortable. Este calefactor cerámico no solo calienta rápido, sino que es seguro y eficiente. Su diseño vertical ocupa poco espacio y su oscilación reparte el calor de forma homogénea. Olvídate de pasar frío mientras trabajas o te duchas; la tecnología también va de estar a gusto en casa.</p>[PRODUCT:3]<h2>5. Limpieza sin cables ni ataduras: VACTechPro</h2><p>Barrer es cosa del pasado. La libertad de una aspiradora sin cables cambia tu relación con la limpieza. Llegas a cualquier rincón, aspiras el sofá, el coche o las cortinas con una sola mano. Potente, versátil y siempre lista. Cuando limpiar deja de ser un esfuerzo, tu casa se mantiene impecable casi sin darte cuenta.</p>[PRODUCT:4]<h2>Conclusión</h2><p>Invertir en tecnología utilitaria es invertir en tiempo libre. Ya sea sumergiéndote en un libro, disfrutando de una película en 4K o limpiando tu casa en mitad de tiempo, estos gadgets están aquí para trabajar por ti, y no al revés.</p>`,
        cover_image: coverImage,
        is_published: true,
        published_at: new Date().toISOString()
    };

    const { data: inserted, error } = await supabase
        .from('articles')
        .insert([article])
        .select()
        .single();

    if (error) {
        console.error('❌ Insert Error:', error.message);
    } else {
        console.log(`🎉 Published: http://localhost:3000/radar/${inserted.slug}`);
    }
}

publish();
