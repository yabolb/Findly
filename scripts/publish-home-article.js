/**
 * Auto-publish "The New Home Starter Pack" article
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Use Service Role Key to bypass RLS
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Selected Products for "New Home Starter Pack"
// 1. Cecotec Freidora de Aire (a757601e)
// 2. VACTechPro Aspiradora (0e10e94e) 
// 3. Cecotec Batidora (5a9681d7)
// 4. Utopia Bedding Sábanas (298b6a52)
// 5. Tefal Sartén (4f4c7dda)

const articleData = {
    title: "5 Regalos Esenciales para Estrenar Casa (y no morir en el intento)",
    slug: "regalos-esenciales-estrenar-casa-2026",
    excerpt: "¿Amigos o familiares se acaban de mudar? Olvida las plantas que se mueren y regala algo que realmente solucione su día a día. Aquí tienes el kit de supervivencia definitivo.",
    content: `
<h2>Introducción: Más allá de la planta de Ikea</h2>
<p>Independizarse o mudarse a una nueva casa es una montaña rusa de emociones: ilusión, libertad y... la repentina comprensión de que no tienes sartenes. Si buscas un regalo para alguien que estrena hogar, olvida los adornos que cogen polvo. Lo que necesitan son herramientas que les hagan la vida más fácil desde el día uno. Hemos seleccionado 5 imprescindibles que combinan utilidad, calidad y ese factor "¡cómo he vivido sin esto!" ideal para 2026.</p>

<h2>1. La Revolución de la Cocina Rápida: Cecotec Cecofry</h2>
<p>Seamos sinceros: con la mudanza, nadie tiene tiempo (ni ganas) de cocinar elaborado. La freidora de aire no es una moda, es una necesidad. Este modelo de 6 litros es perfecto para preparar cenas sanas en 15 minutos sin ensuciar toda la cocina nueva. Crujiente, rápido y sin apenas aceite. Es el regalo que dice "te quiero, pero sé que estás ocupado".</p>

[PRODUCT:0]

<h2>2. Limpieza Sin Cables ni Dramas: VACTechPro 35kPa</h2>
<p>Mantener la casa nueva impecable no debería ser un castigo. Las aspiradoras con cable son cosa del pasado. Este modelo inalámbrico con potencia de 35kPa convierte la limpieza en un paseo. Ligera, potente y lista para cualquier rincón. Regalar limpieza eficiente es regalar tiempo libre, y ese es el mayor lujo de todos.</p>

[PRODUCT:1]

<h2>3. El Copiloto del Chef: Cecotec Power Pulsar</h2>
<p>Desde el batido del desayuno hasta la crema de verduras de la cena. Una buena batidora de mano es el soldado raso de la cocina. Con potencia XL, tritura lo que le eches. Es robusta, fácil de limpiar y esencial para quien quiere empezar a comer mejor en su nuevo espacio.</p>

[PRODUCT:2]

<h2>4. El Descanso de Hotel en Casa: Juego de Sábanas Utopia</h2>
<p>Nada viste más una habitación nueva (y mejora el sueño) que unas sábanas nuevas, frescas y suaves. Este juego de 4 piezas es el equilibrio perfecto entre confort y durabilidad. Un regalo clásico que nunca falla, porque estrenar cama con sábanas viejas debería ser delito.</p>

[PRODUCT:3]

<h2>5. La Sartén Todoterreno: Tefal Daily Cook</h2>
<p>¿El error número uno al mudarse? Comprar sartenes baratas que se pegan a la semana. Regale calidad. Esta Tefal de 24 cm es la medida perfecta para tortillas, salteados o filetes. Antiadherente real y duradera. Es la herramienta que usarán literalmente todos los días.</p>

[PRODUCT:4]

<h2>Conclusión</h2>
<p>Equipar un hogar es caro y estresante. Cualquiera de estos 5 regalos aliviará esa carga y será recibido con los brazos abiertos. Son prácticos, duraderos y, sobre todo, solucionan problemas reales. ¡Elige el que mejor encaje y triunfa en la inauguración!</p>
`,
    category_tag: "home-garden",
    is_published: true,
    published_at: new Date().toISOString(),
    // We need to fetch the image URL dynamically or hardcode one we know exists from the exploration
    // Using the ID to find the product first is safer.
    related_products: [] // Will be filled in the script logic
};

async function publish() {
    console.log('🚀 Starting Auto-Publish process...');

    // 1. Fetch Product IDs
    // We search by unique parts of the title or exact matches to get the IDs we found in exploration
    const productSearches = [
        { term: 'Cecotec Freidora de Aire Cecofry Bombastik 6L', id: null },
        { term: 'VACTechPro Aspiradora sin Cable 35kPa', id: null }, // Using unique part
        { term: 'Cecotec Batidora de Mano XL Power Pulsar 2300MAX', id: null },
        { term: 'Utopia Bedding Juego de Sábanas 4 Piezas 150x200', id: null },
        { term: 'Tefal Daily Cook Sartén 24 cm', id: null }
    ];

    const relatedProductIds = [];
    let coverImage = '';

    for (const item of productSearches) {
        // We use ILIKE for flexibility
        const { data, error } = await supabase
            .from('products')
            .select('id, image_url, title')
            .ilike('title', `%${item.term}%`)
            .limit(1)
            .single();

        if (error || !data) {
            console.error(`❌ Product not found: ${item.term}`);
            // Fallback strategy or exit? Let's try to proceed by skipping or finding alternatives if this was robust code.
            // For this task, we assume they exist as we just saw them.
            if (error) console.error(error.message);
            continue;
        }

        console.log(`✅ Found product: ${data.title.substring(0, 30)}... (${data.id})`);
        relatedProductIds.push(data.id);

        // Set cover image to the Air Fryer (first item)
        if (item.term.includes('Freidora')) {
            coverImage = data.image_url;
        }
    }

    if (relatedProductIds.length !== 5) {
        console.warn(`⚠️ Warning: Expected 5 products, found ${relatedProductIds.length}. Placeholders might mismatch.`);
    }

    // 2. Insert Article
    const finalArticle = {
        ...articleData,
        related_products: relatedProductIds,
        cover_image: coverImage
    };

    const { data: article, error } = await supabase
        .from('articles')
        .insert([finalArticle])
        .select()
        .single();

    if (error) {
        console.error('❌ Failed to publish article:', error.message);
    } else {
        console.log('\n🎉 Article Published Successfully!');
        console.log(`TITLE: ${article.title}`);
        console.log(`SLUG: ${article.slug}`);
        console.log(`URL: http://localhost:3000/radar/${article.slug}`);
    }
}

publish();
