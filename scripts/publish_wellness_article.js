/**
 * Publish Wellness Article dynamically finding products by title
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
    console.log('🚀 Preparing Wellness Article...');

    // Selected Products for "Relax & Wellness" theme
    const productTerms = [
        'RITUALS Caja de regalo The Ritual of Sakura', // Beauty/Relax
        'RITUALS Caja de regalo The Ritual of Ayurveda', // Beauty/Relax
        'Super Sparrow Botella Agua Acero Inoxidable', // Hydration/Wellness
        'Cecotec Calefactor Eléctrico ReadyWarm', // Comfort at home
        'Utopia Bedding Juego de Sábanas 4 Piezas' // Sleep/Rest
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

    if (relatedIds.length < 3) {
        console.error("❌ Not enough products found. Aborting.");
        return;
    }

    // 2. Select Valid Cover Image
    let coverImage = null;
    let coverImageSource = '';

    // Prioritize Rituals images for the vibe, but check validity
    for (const p of productsFound) {
        if (await checkImage(p.image_url)) {
            coverImage = p.image_url;
            coverImageSource = p.title;
            console.log(`📸 Cover Image Selected from: ${p.title}`);
            break;
        }
    }

    // 3. Publish Article
    const article = {
        title: "5 regalos para el cuidado personal que transformarán tu rutina",
        slug: "regalos-cuidado-personal-transformaran-rutina-2026",
        excerpt: "En un mundo que no para, regalar calma es el mayor lujo. Hemos seleccionado 5 esenciales para crear un spa en casa y recuperar el equilibrio.",
        category_tag: "beauty-personal-care",
        related_products: relatedIds,
        content: `<h2>Introducción: Pausa, respira y reinicia</h2><p>El estrés cotidiano nos hace olvidar lo importante que es dedicarse unos minutos al día. No hace falta irse a un retiro en Bali para desconectar. Con los elementos adecuados, puedes convertir tu baño o dormitorio en un santuario de paz. Esta guía está pensada para quien necesita (aunque no lo sepa) bajar el ritmo y mimarse un poco.</p><h2>1. El ritual de la renovación: cofre de regalo Sakura</h2><p>Inspirado en la flor del cerezo japonesa, este set de Rituals es un éxito asegurado. Su aroma a leche de arroz y flor de cerezo es suave, limpio y tremendamente relajante. Incluye espuma de ducha, crema corporal y exfoliante. Es el regalo perfecto para decir 'tómate un momento para ti'.</p>[PRODUCT:0]<h2>2. Equilibrio cuerpo y mente: The Ritual of Ayurveda</h2><p>Si prefieres aromas más cálidos y envolventes, la rosa india y el aceite de almendras dulces de la línea Ayurveda son la elección. Diseñado para equilibrar la energía, este cofre convierte una ducha rápida en una experiencia sensorial que te deja la piel (y el ánimo) como nuevos.</p>[PRODUCT:1]<h2>3. Hidratación consciente: botella térmica Super Sparrow</h2><p>El autocuidado empieza por dentro. Beber agua es el hábito más simple y potente para tu piel y energía. Esta botella de acero inoxidable no solo es preciosa, sino que mantiene tu infusión caliente o tu agua helada todo el día. Un recordatorio constante y elegante de que debes cuidarte.</p>[PRODUCT:2]<h2>4. Calor de hogar instantáneo: calefactor cerámico Cecotec</h2><p>Nada rompe más el momento de relax que salir de la ducha y pasar frío. Este calefactor cerámico es compacto, potente y casi instantáneo. Crea una atmósfera cálida en el baño en segundos, haciendo que tus rituales de belleza sean mucho más placenteros en invierno.</p>[PRODUCT:3]<h2>5. El sueño reparador: juego de sábanas Utopia</h2><p>El cuidado personal termina en la cama. Dormir entre sábanas de microfibra cepillada, suaves y frescas, mejora la calidad del descanso. Este juego es hipoalergénico y resistente. Porque de nada sirve el mejor spa si luego no descansas como te mereces.</p>[PRODUCT:4]<h2>Conclusión</h2><p>El bienestar no es un destino, es una práctica diaria. Estos 5 regalos son herramientas sencillas pero poderosas para construir esa rutina de autocuidado que tanto necesitas. Elige el que más resuene contigo y empieza a priorizar tu paz.</p>`,
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
