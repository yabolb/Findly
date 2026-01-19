/**
 * Publish Fitness Article dynamically finding products by title
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
    console.log('🚀 Preparing Fitness Article...');

    // Products to find by title partial match
    const productTerms = [
        'Amazon Basics Par de Mancuernas Neopreno 2 kg',
        'Fokky Bandas Elásticas Musculación',
        'XIAOMI Smart Band 9 Active',
        'unycos Pelota de Pilates',
        'Super Sparrow Botella Agua Acero'
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
            console.log(`✅ Found: ${data.title.substring(0, 40)}...`);
            relatedIds.push(data.id);
            productsFound.push(data);
        } else {
            console.warn(`⚠️ Not found: ${term}`);
        }
    }

    if (relatedIds.length < 5) {
        console.error("❌ Not enough products found. Aborting.");
        return;
    }

    // 2. Select Valid Cover Image
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
        title: "Gimnasio en Casa por Menos de 60€: Tu Kit de Iniciación 2026",
        slug: "gimnasio-casa-barato-kit-iniciacion-2026",
        excerpt: "No necesitas pagar cuotas mensuales ni ocupar toda una habitación. Con estos 5 accesorios clave, puedes montar un gimnasio completo, efectivo y económico en cualquier rincón.",
        category_tag: "sports-outdoors",
        related_products: relatedIds,
        content: `<h2>Introducción: Ponte en forma sin salir (ni arruinarte)</h2><p>La excusa de 'no tengo tiempo para ir al gimnasio' se acabó en 2026. La tendencia del 'Micro-Gym' en casa ha llegado para quedarse: equipos minimalistas, fáciles de guardar y tremendamente efectivos. No hace falta una máquina elíptica de 500€. Con una inversión inteligente de menos de 60€, puedes trabajar fuerza, resistencia y flexibilidad. Hemos seleccionado el top 5 de ventas que combina calidad, precio y versatilidad.</p><h2>1. El Clásico Infalible: Mancuernas Amazon Basics</h2><p>El primer ladrillo de tu gimnasio personal. Estas mancuernas de neopreno son perfectas para principiantes: el agarre es suave y no resbala con el sudor, y su forma hexagonal evita que rueden por el suelo (y te rompan un dedo del pie). Ideales para tonificar brazos, hombros y añadir intensidad a tus sentadillas.</p>[PRODUCT:0]<h2>2. Un Gimnasio en el Bolsillo: Bandas Elásticas Fokky</h2><p>Si vives en un piso pequeño, este es tu producto. 5 niveles de resistencia que equivalen a tener un rack entero de pesas, pero que caben en un cajón. Úsalas para glúteos, piernas o estiramientos. El látex natural es duradero y no se deforma. Es, posiblemente, el accesorio con mejor relación coste-beneficio del mercado.</p>[PRODUCT:1]<h2>3. Tu Entrenador Personal 24/7: Xiaomi Smart Band 9</h2><p>Lo que no se mide, no se mejora. La nueva Smart Band 9 Active es la compañera perfecta para monitorizar tus progresos sin gastar cientos de euros. Cuenta pasos, calorías, sueño y tiene 100 modos deportivos. Su batería dura semanas, así que te olvidarás de cargarla. Motivación pura en tu muñeca.</p>[PRODUCT:2]<h2>4. El Núcleo de Todo: Pelota de Pilates Unycos</h2><p>No subestimes el poder de la inestabilidad. Una Fitball activa tu 'core' (abdominales y lumbares) simplemente al sentarte sobre ella. Perfecta para abdominales, estiramientos de espalda tras horas de oficina, o incluso como silla de escritorio ergonómica. Incluye bomba de aire y es antideslizante.</p>[PRODUCT:3]<h2>5. Hidratación con Estilo: Super Sparrow 500ml</h2><p>Beber agua es la parte más fácil (y olvidada) del entrenamiento. Esta botella térmica de acero inoxidable mantiene el agua helada durante 24 horas y el café caliente durante 12. Su tapón deportivo permite beber con una mano. Cero fugas en la mochila y un diseño elegante que querrás llevar a todas partes.</p>[PRODUCT:4]<h2>Conclusión</h2><p>Montar tu espacio de entrenamiento no requiere grandes presupuestos, solo grandes decisiones. Con este kit básico cubres fuerza, cardio y recuperación. Empieza hoy mismo, tu 'yo' del verano te lo agradecerá.</p>`,
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
