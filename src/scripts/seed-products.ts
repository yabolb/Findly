import { supabaseAdmin } from '@/lib/supabase-admin';
import { Category, ProductCondition, Platform, PriceScore } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * DEMO PRODUCT SEED SCRIPT
 * ========================
 * Generates realistic Spanish demo products across all categories
 * All products are marked with is_demo: true
 */

// Realistic Spanish product templates by category
const PRODUCT_TEMPLATES: Record<Category, Array<{ title: string; price: number; condition: ProductCondition }>> = {
    'tech-electronics': [
        { title: 'iPhone 13 Pro 128GB Negro', price: 650, condition: 'like-new' as ProductCondition },
        { title: 'MacBook Air M1 256GB Plata', price: 850, condition: 'good' as ProductCondition },
        { title: 'Samsung Galaxy S22 Ultra 5G', price: 720, condition: 'like-new' as ProductCondition },
        { title: 'iPad Air 2022 64GB WiFi Azul', price: 480, condition: 'good' as ProductCondition },
        { title: 'Sony WH-1000XM5 Auriculares Noise Cancelling', price: 320, condition: 'new' as ProductCondition },
        { title: 'Nintendo Switch OLED Blanca', price: 310, condition: 'like-new' as ProductCondition },
        { title: 'Apple Watch Series 8 GPS 45mm', price: 380, condition: 'good' as ProductCondition },
        { title: 'Kindle Paperwhite 11ª Gen 16GB', price: 110, condition: 'like-new' as ProductCondition },
        { title: 'GoPro HERO 11 Black + Accesorios', price: 420, condition: 'new' as ProductCondition },
        { title: 'DJI Mini 3 Pro Drone con Mando', price: 650, condition: 'like-new' as ProductCondition },
    ],
    fashion: [
        { title: 'Zapatillas Nike Air Max 97 Blancas Talla 42', price: 85, condition: 'good' as ProductCondition },
        { title: 'Chaqueta Vaquera Levi\'s Vintage Talla M', price: 45, condition: 'fair' as ProductCondition },
        { title: 'Vestido Zara Negro Largo Talla S', price: 20, condition: 'like-new' as ProductCondition },
        { title: 'Bolso Michael Kors Crossbody Marrón', price: 95, condition: 'good' as ProductCondition },
        { title: 'Gafas de Sol Ray-Ban Aviator Originales', price: 70, condition: 'like-new' as ProductCondition },
        { title: 'Abrigo Mango Largo Beige Talla M', price: 35, condition: 'good' as ProductCondition },
        { title: 'Vaqueros Levi\'s 501 Talla 32 Azul', price: 30, condition: 'fair' as ProductCondition },
        { title: 'Zapatillas Adidas Yeezy Boost 350 Talla 41', price: 180, condition: 'like-new' as ProductCondition },
        { title: 'Reloj Casio G-Shock Negro Digital', price: 65, condition: 'good' as ProductCondition },
        { title: 'Cinturón Gucci Piel Negro Talla 90', price: 120, condition: 'like-new' as ProductCondition },
    ],
    'home-garden': [
        { title: 'Sofá 3 Plazas Gris Moderno Esquinero', price: 380, condition: 'good' as ProductCondition },
        { title: 'Mesa Centro Madera Roble Natural', price: 85, condition: 'like-new' as ProductCondition },
        { title: 'Lámpara Pie Arco Moderna Negra', price: 120, condition: 'new' as ProductCondition },
        { title: 'Espejo Pared Grande 180x80cm Marco Dorado', price: 95, condition: 'like-new' as ProductCondition },
        { title: 'Estantería IKEA Billy Blanca 200cm', price: 45, condition: 'good' as ProductCondition },
        { title: 'Silla Oficina Ergonómica Herman Miller', price: 380, condition: 'fair' as ProductCondition },
        { title: 'Cama 150x190cm con Cabecero Tapizado Gris', price: 280, condition: 'good' as ProductCondition },
        { title: 'Alfombra Persa Vintage 200x300cm', price: 220, condition: 'fair' as ProductCondition },
        { title: 'Cortinas Opacas Salón Beige 280cm', price: 40, condition: 'new' as ProductCondition },
        { title: 'Set 6 Cojines Decorativos Terciopelo', price: 35, condition: 'like-new' as ProductCondition },
    ],
    'sports-leisure': [
        { title: 'Bicicleta Montaña Trek 29 Pulgadas Talla L', price: 450, condition: 'good' as ProductCondition },
        { title: 'Patinete Eléctrico Xiaomi Pro 2 Negro', price: 320, condition: 'like-new' as ProductCondition },
        { title: 'Raqueta Tenis Wilson Pro Staff RF97', price: 180, condition: 'good' as ProductCondition },
        { title: 'Mancuernas Ajustables 2x20kg con Soporte', price: 95, condition: 'like-new' as ProductCondition },
        { title: 'Tabla Surf 6\'2" Shortboard Al Merrick', price: 380, condition: 'fair' as ProductCondition },
        { title: 'Cinta Correr Domyos T540C Plegable', price: 420, condition: 'good' as ProductCondition },
        { title: 'Bicicleta Estática Spinning Cecotec', price: 220, condition: 'like-new' as ProductCondition },
        { title: 'Set Palas Pádel Head con Paletero', price: 150, condition: 'good' as ProductCondition },
        { title: 'Kayak Hinchable Intex 2 Plazas con Remos', price: 85, condition: 'new' as ProductCondition },
        { title: 'Botas Fútbol Nike Mercurial Talla 42', price: 65, condition: 'fair' as ProductCondition },
    ],
    'baby-kids': [
        { title: 'Lego Star Wars Millennium Falcon 75192', price: 650, condition: 'new' as ProductCondition },
        { title: 'Barbie Dreamhouse Casa Muñecas 3 Plantas', price: 180, condition: 'like-new' as ProductCondition },
        { title: 'Hot Wheels Pista Mega Looping Extremo', price: 45, condition: 'good' as ProductCondition },
        { title: 'Playmobil Set Ciudad Casa Moderna', price: 85, condition: 'like-new' as ProductCondition },
        { title: 'Nintendo Switch Juego Mario Kart 8 Deluxe', price: 42, condition: 'like-new' as ProductCondition },
        { title: 'Funko Pop Colección Marvel 10 Figuras', price: 120, condition: 'new' as ProductCondition },
        { title: 'Nenuco Bebé Interactivo con Accesorios', price: 35, condition: 'good' as ProductCondition },
        { title: 'Scalextric Circuito F1 Completo', price: 95, condition: 'fair' as ProductCondition },
        { title: 'Peluche Gigante Oso Teddy 150cm Marrón', price: 65, condition: 'like-new' as ProductCondition },
        { title: 'Set Pinturas Acuarela 48 Colores Profesional', price: 28, condition: 'new' as ProductCondition },
    ],
    'movies-books-music': [
        { title: 'Colección Harry Potter 7 Libros Tapa Dura', price: 85, condition: 'like-new' as ProductCondition },
        { title: 'El Quijote Edición Ilustrada Lujo', price: 45, condition: 'good' as ProductCondition },
        { title: 'Sapiens de Yuval Noah Harari', price: 15, condition: 'good' as ProductCondition },
        { title: '1984 George Orwell Edición Especial', price: 18, condition: 'like-new' as ProductCondition },
        { title: 'Atlas Mundial National Geographic 2023', price: 35, condition: 'new' as ProductCondition },
        { title: 'Diccionario RAE 23ª Edición Tapa Dura', price: 42, condition: 'like-new' as ProductCondition },
        { title: 'Enciclopedia Espasa 20 Tomos Completa', price: 180, condition: 'fair' as ProductCondition },
        { title: 'Cómic Mortadelo y Filemón Colección 50 Años', price: 95, condition: 'good' as ProductCondition },
        { title: 'El Código Da Vinci Dan Brown Primera Edición', price: 12, condition: 'fair' as ProductCondition },
        { title: 'Libro Recetas Cocina Española Arguiñano', price: 22, condition: 'good' as ProductCondition },
    ],
    'cars-motorcycles': [
        { title: 'Volkswagen Golf 7 GTI 2.0 TSI 230CV 2016', price: 18500, condition: 'good' as ProductCondition },
        { title: 'BMW Serie 3 320d Automático 2018', price: 24000, condition: 'like-new' as ProductCondition },
        { title: 'Seat León FR 1.5 TSI 150CV 2020', price: 17500, condition: 'like-new' as ProductCondition },
        { title: 'Renault Clio Zen 1.0 TCE 100CV 2019', price: 11500, condition: 'good' as ProductCondition },
        { title: 'Toyota RAV4 Híbrido AWD 2021', price: 32000, condition: 'like-new' as ProductCondition },
        { title: 'Honda CBR 600RR Moto Deportiva 2015', price: 6500, condition: 'good' as ProductCondition },
        { title: 'Vespa Primavera 125 ABS 2020', price: 3200, condition: 'like-new' as ProductCondition },
        { title: 'Fiat 500 1.2 Lounge Descapotable 2017', price: 9500, condition: 'good' as ProductCondition },
        { title: 'Ford Focus ST Line 1.0 EcoBoost 2019', price: 15000, condition: 'good' as ProductCondition },
        { title: 'Audi A4 Avant 2.0 TDI Quattro 2018', price: 26500, condition: 'like-new' as ProductCondition },
    ],
    'real-estate': [
        { title: 'Piso 2 Habitaciones Centro Madrid 65m²', price: 285000, condition: 'good' as ProductCondition },
        { title: 'Apartamento Playa Benidorm 1 Hab 45m²', price: 120000, condition: 'fair' as ProductCondition },
        { title: 'Chalet Adosado 3 Hab Jardín Majadahonda', price: 420000, condition: 'like-new' as ProductCondition },
        { title: 'Estudio Reformado Salamanca 35m²', price: 195000, condition: 'like-new' as ProductCondition },
        { title: 'Ático Dúplex Terraza Barcelona 95m²', price: 480000, condition: 'good' as ProductCondition },
        { title: 'Casa Campo 4 Hab Piscina Toledo 180m²', price: 220000, condition: 'fair' as ProductCondition },
        { title: 'Local Comercial Céntrico 120m² Escaparate', price: 180000, condition: 'good' as ProductCondition },
        { title: 'Parking Plaza Garaje Centro Valencia', price: 25000, condition: 'good' as ProductCondition },
        { title: 'Oficina Diáfana 80m² Zona Empresarial', price: 150000, condition: 'like-new' as ProductCondition },
        { title: 'Terreno Urbano 500m² Edificable Sevilla', price: 95000, condition: 'good' as ProductCondition },
    ],
    services: [
        { title: 'Clases Particulares Matemáticas ESO/Bach', price: 20, condition: 'new' as ProductCondition },
        { title: 'Masaje Relajante 60min Profesional', price: 45, condition: 'new' as ProductCondition },
        { title: 'Reparación iPhone Cambio Pantalla 24h', price: 65, condition: 'new' as ProductCondition },
        { title: 'Limpieza Hogar Profunda 3h', price: 45, condition: 'new' as ProductCondition },
        { title: 'Fotografía Eventos Bodas Profesional', price: 850, condition: 'new' as ProductCondition },
        { title: 'Diseño Logo Profesional + Branding', price: 180, condition: 'new' as ProductCondition },
        { title: 'Traducción Inglés-Español Jurado', price: 35, condition: 'new' as ProductCondition },
        { title: 'Mudanza Completo Piso 2 Hab + Montaje', price: 320, condition: 'new' as ProductCondition },
        { title: 'Clases Guitarra Online Principiantes', price: 25, condition: 'new' as ProductCondition },
        { title: 'Asesoría Fiscal Declaración Renta', price: 95, condition: 'new' as ProductCondition },
    ],
    'agriculture-industrial': [
        { title: 'Tractor John Deere 6120M 120CV', price: 45000, condition: 'good' as ProductCondition },
        { title: 'Cortacésped Profesional Honda 21"', price: 420, condition: 'like-new' as ProductCondition },
        { title: 'Motosierra Stihl MS 261 Profesional', price: 580, condition: 'good' as ProductCondition },
        { title: 'Desbrozadora Husqvarna 545RX', price: 650, condition: 'like-new' as ProductCondition },
        { title: 'Remolque Agrícola 2500kg Basculante', price: 1850, condition: 'good' as ProductCondition },
        { title: 'Cultivador Rotativo 180cm Tractor', price: 950, condition: 'fair' as ProductCondition },
        { title: 'Bomba Agua Centrífuga 3HP Industrial', price: 380, condition: 'good' as ProductCondition },
        { title: 'Compresor Industrial 500L 10HP', price: 1200, condition: 'like-new' as ProductCondition },
        { title: 'Generador Diesel 15kVA Trifásico', price: 3200, condition: 'good' as ProductCondition },
        { title: 'Carretilla Elevadora Toyota 2.5T', price: 12000, condition: 'fair' as ProductCondition },
    ],
    'collectibles-art': [
        { title: 'Moneda Oro 1 Onza Libertad México 2020', price: 1850, condition: 'new' as ProductCondition },
        { title: 'Vinilo The Beatles Abbey Road Original 1969', price: 120, condition: 'good' as ProductCondition },
        { title: 'Reloj Vintage Omega Seamaster Automático', price: 950, condition: 'fair' as ProductCondition },
        { title: 'Sello España 1850 Isabel II 6 Cuartos', price: 280, condition: 'good' as ProductCondition },
        { title: 'Camiseta Firmada Messi Barcelona 2015', price: 420, condition: 'like-new' as ProductCondition },
        { title: 'Cómic Detective Comics #27 Réplica', price: 85, condition: 'new' as ProductCondition },
        { title: 'Carta Pokémon Charizard 1ª Edición Holo', price: 380, condition: 'good' as ProductCondition },
        { title: 'Billete 100 Pesetas 1953 Sin Circular', price: 45, condition: 'like-new' as ProductCondition },
        { title: 'Cuadro Dalí Litografía Numerada Certificado', price: 650, condition: 'like-new' as ProductCondition },
        { title: 'Miniatura Ferrari F1 2000 Schumacher 1:18', price: 95, condition: 'new' as ProductCondition },
    ],
    diy: [
        { title: 'Taladro Percutor Bosch 850W Profesional', price: 120, condition: 'like-new' as ProductCondition },
        { title: 'Sierra Circular Makita 1400W con Guía', price: 180, condition: 'good' as ProductCondition },
        { title: 'Set Herramientas 150 Piezas Profesional', price: 85, condition: 'new' as ProductCondition },
        { title: 'Lijadora Orbital Black+Decker 200W', price: 45, condition: 'good' as ProductCondition },
        { title: 'Compresor Aire 50L con Kit Accesorios', price: 150, condition: 'like-new' as ProductCondition },
        { title: 'Escalera Aluminio Telescópica 5m', price: 95, condition: 'good' as ProductCondition },
        { title: 'Caja Herramientas Stanley Metal Grande', price: 35, condition: 'like-new' as ProductCondition },
        { title: 'Pistola Pintura Eléctrica Wagner 650W', price: 120, condition: 'good' as ProductCondition },
        { title: 'Multímetro Digital Fluke Profesional', price: 180, condition: 'like-new' as ProductCondition },
        { title: 'Sierra Sable Dewalt 1200W', price: 150, condition: 'good' as ProductCondition },
    ],
    others: [
        { title: 'Máquina Coser Singer Antigua Restaurada', price: 180, condition: 'fair' as ProductCondition },
        { title: 'Barbacoa Gas 4 Quemadores con Tapa', price: 320, condition: 'good' as ProductCondition },
        { title: 'Cortacésped Eléctrico Bosch 1200W', price: 150, condition: 'like-new' as ProductCondition },
        { title: 'Maletas Samsonite Set 3 Rígidas Rosa', price: 180, condition: 'like-new' as ProductCondition },
        { title: 'Tienda Campaña Quechua 4 Personas', price: 120, condition: 'good' as ProductCondition },
        { title: 'Generador Eléctrico 3000W Gasolina', price: 420, condition: 'like-new' as ProductCondition },
        { title: 'Máquina Café Nespresso Vertuo con Espumador', price: 95, condition: 'good' as ProductCondition },
        { title: 'Robot Aspirador Roomba i7+ Autovaciado', price: 450, condition: 'like-new' as ProductCondition },
        { title: 'Purificador Aire HEPA Philips AC2887', price: 220, condition: 'new' as ProductCondition },
        { title: 'Bicicleta Plegable Dahon Mu P8 Negra', price: 380, condition: 'good' as ProductCondition },
    ],
};

const SPANISH_CITIES = [
    'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza',
    'Málaga', 'Murcia', 'Palma', 'Bilbao', 'Alicante',
    'Granada', 'Oviedo', 'Santander', 'Toledo', 'Salamanca'
];

const PLATFORMS: Platform[] = ['wallapop', 'vinted', 'ebay', 'milanuncios'];

const DESCRIPTIONS = [
    'Artículo en perfecto estado. Poco uso. Se entrega con todos los accesorios originales.',
    'Producto seminuevo, muy bien cuidado. Sin marcas ni golpes. Envío incluido.',
    'Estado impecable. Como nuevo. Se puede ver sin compromiso en [CIUDAD].',
    'Vendo por no usar. Funcionamiento perfecto. Entrega en mano o envío urgente.',
    'Oportunidad única. Precio negociable. Posibilidad de reserva con señal.',
];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getPriceScore(price: number, category: Category): PriceScore {
    // Simple logic based on price ranges
    if (category === 'real-estate' || category === 'cars-motorcycles') {
        return price < 15000 ? 'bargain' : price < 30000 ? 'fair' : 'expensive';
    }
    return price < 50 ? 'bargain' : price < 200 ? 'fair' : 'expensive';
}

function getRandomDateWithinLast30Days(): string {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
}

export async function seedDemoProducts(limit: number = 150) {
    const products = [];
    const categories = Object.keys(PRODUCT_TEMPLATES) as Category[];

    console.log(`🌱 Seeding ${limit} demo products...`);

    for (let i = 0; i < limit; i++) {
        const category = getRandomElement(categories);
        const template = getRandomElement(PRODUCT_TEMPLATES[category]);
        const platform = getRandomElement(PLATFORMS);
        const city = getRandomElement(SPANISH_CITIES);
        const description = getRandomElement(DESCRIPTIONS).replace('[CIUDAD]', city);

        const product = {
            id: uuidv4(),
            title: template.title,
            description,
            price: template.price,
            currency: 'EUR' as const,
            image_url: `https://placehold.co/600x400/6366f1/white?text=${encodeURIComponent(template.title.substring(0, 20))}`,
            source_url: `https://demo.getfindly.com/product-${uuidv4()}`,
            platform,
            category,
            location: { city, country: 'España' },
            condition: template.condition,
            price_score: getPriceScore(template.price, category),
            is_demo: true,
            created_at: getRandomDateWithinLast30Days(),
        };

        products.push(product);
    }

    // Insert in batches of 50
    const batchSize = 50;
    let inserted = 0;

    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);

        const { error } = await supabaseAdmin
            .from('products')
            .insert(batch);

        if (error) {
            console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message);
        } else {
            inserted += batch.length;
            console.log(`✅ Inserted batch ${i / batchSize + 1}: ${batch.length} products`);
        }
    }

    console.log(`\n🎉 Seeding complete! Inserted ${inserted} demo products.`);
    return { inserted, total: products.length };
}

// Run if called directly
if (require.main === module) {
    seedDemoProducts(150)
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        });
}
