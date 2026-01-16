/**
 * NORMALIZATION MAPPERS
 * Transform messy external data into clean Findly format
 * PRD Section 5.2: Data Ingestion
 */

import { Product, Category, ProductCondition, Platform, PriceScore } from "@/types";
import { v4 as uuidv4 } from "uuid";

// ========================================
// CATEGORY MAPPING
// ========================================

/**
 * Maps external source categories to Findly's 13 core categories
 */
const CATEGORY_MAPPINGS: Record<string, Category> = {
    // Cars & Motorcycles
    "coches": "cars-motorcycles",
    "motos": "cars-motorcycles",
    "cars": "cars-motorcycles",
    "motorcycles": "cars-motorcycles",
    "vehicles": "cars-motorcycles",
    "motor": "cars-motorcycles",
    "automocion": "cars-motorcycles",
    "automóviles": "cars-motorcycles",

    // Fashion
    "ropa": "fashion",
    "moda": "fashion",
    "fashion": "fashion",
    "clothing": "fashion",
    "zapatos": "fashion",
    "shoes": "fashion",
    "accessories": "fashion",
    "accesorios": "fashion",
    "bolsos": "fashion",
    "bags": "fashion",
    "women": "fashion",
    "men": "fashion",
    "mujer": "fashion",
    "hombre": "fashion",

    // Real Estate
    "inmobiliaria": "real-estate",
    "real estate": "real-estate",
    "pisos": "real-estate",
    "casas": "real-estate",
    "apartments": "real-estate",
    "alquiler": "real-estate",
    "venta": "real-estate",

    // Tech & Electronics
    "tecnologia": "tech-electronics",
    "technology": "tech-electronics",
    "electronics": "tech-electronics",
    "electronica": "tech-electronics",
    "informatica": "tech-electronics",
    "computers": "tech-electronics",
    "phones": "tech-electronics",
    "moviles": "tech-electronics",
    "telefonos": "tech-electronics",
    "tablets": "tech-electronics",
    "consolas": "tech-electronics",
    "gaming": "tech-electronics",
    "videojuegos": "tech-electronics",
    "tv": "tech-electronics",
    "audio": "tech-electronics",

    // Sports & Leisure
    "deportes": "sports-leisure",
    "sports": "sports-leisure",
    "leisure": "sports-leisure",
    "ocio": "sports-leisure",
    "fitness": "sports-leisure",
    "bicicletas": "sports-leisure",
    "bikes": "sports-leisure",
    "outdoor": "sports-leisure",

    // Home & Garden
    "hogar": "home-garden",
    "home": "home-garden",
    "garden": "home-garden",
    "jardin": "home-garden",
    "muebles": "home-garden",
    "furniture": "home-garden",
    "decoracion": "home-garden",
    "decoration": "home-garden",
    "electrodomesticos": "home-garden",
    "appliances": "home-garden",

    // Movies, Books & Music
    "libros": "movies-books-music",
    "books": "movies-books-music",
    "movies": "movies-books-music",
    "peliculas": "movies-books-music",
    "music": "movies-books-music",
    "musica": "movies-books-music",
    "cds": "movies-books-music",
    "vinilos": "movies-books-music",
    "dvd": "movies-books-music",

    // Baby & Kids
    "bebe": "baby-kids",
    "baby": "baby-kids",
    "ninos": "baby-kids",
    "niños": "baby-kids",
    "kids": "baby-kids",
    "children": "baby-kids",
    "infantil": "baby-kids",
    "juguetes": "baby-kids",
    "toys": "baby-kids",

    // Collectibles & Art
    "coleccionismo": "collectibles-art",
    "collectibles": "collectibles-art",
    "art": "collectibles-art",
    "arte": "collectibles-art",
    "antiguedades": "collectibles-art",
    "antiques": "collectibles-art",
    "vintage": "collectibles-art",

    // DIY
    "bricolaje": "diy",
    "diy": "diy",
    "herramientas": "diy",
    "tools": "diy",
    "construccion": "diy",
    "construction": "diy",

    // Agriculture & Industrial
    "agricultura": "agriculture-industrial",
    "agriculture": "agriculture-industrial",
    "industrial": "agriculture-industrial",
    "maquinaria": "agriculture-industrial",
    "machinery": "agriculture-industrial",

    // Services
    "servicios": "services",
    "services": "services",
    "empleo": "services",
    "jobs": "services",
    "clases": "services",
    "classes": "services",
};

/**
 * Normalize source category to Findly category
 */
export function normalizeCategory(sourceCategory: string | undefined): Category {
    if (!sourceCategory) return "others";

    const normalized = sourceCategory.toLowerCase().trim();

    // Direct mapping check
    if (CATEGORY_MAPPINGS[normalized]) {
        return CATEGORY_MAPPINGS[normalized];
    }

    // Partial match check (for compound categories)
    for (const [key, value] of Object.entries(CATEGORY_MAPPINGS)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return value;
        }
    }

    return "others";
}

// ========================================
// CONDITION MAPPING
// ========================================

/**
 * Maps various condition strings to Findly's standard set
 */
const CONDITION_MAPPINGS: Record<string, ProductCondition> = {
    // New
    "new": "new",
    "nuevo": "new",
    "nou": "new", // Catalan
    "brand new": "new",
    "a estrenar": "new",
    "precintado": "new",
    "sealed": "new",

    // Like New
    "like new": "like-new",
    "como nuevo": "like-new",
    "com nou": "like-new", // Catalan
    "molt bo": "like-new", // Catalan - Very good
    "ganga": "like-new",
    "excellent": "like-new",
    "excelente": "like-new",
    "mint": "like-new",
    "impecable": "like-new",
    "perfecto estado": "like-new",

    // Good
    "good": "good",
    "bueno": "good",
    "buen estado": "good",
    "bon": "good", // Catalan
    "bo": "good", // Catalan
    "bien": "good",
    "used": "good", // Default used to good
    "usado": "good",
    "segunda mano": "good",
    "de segona ma": "good", // Catalan
    "very good": "good",
    "muy bueno": "good",

    // Fair
    "fair": "fair",
    "regular": "fair",
    "acceptable": "fair",
    "aceptable": "fair",
    "normal": "fair",
    "alguns defectes": "fair", // Catalan - Some defects
    "algún defecto": "fair",
    "some wear": "fair",
    "desgaste": "fair",
    "ok": "fair",

    // Poor
    "poor": "poor",
    "malo": "poor",
    "defectuoso": "poor",
    "defectuós": "poor", // Catalan
    "roto": "poor",
    "broken": "poor",
    "for parts": "poor",
    "para piezas": "poor",
    "per peces": "poor", // Catalan
    "damaged": "poor",
    "dañado": "poor",
};

/**
 * Normalize condition string to Findly standard
 */
export function normalizeCondition(sourceCondition: string | undefined): ProductCondition {
    if (!sourceCondition) return "good"; // Default to good if not specified

    const normalized = sourceCondition.toLowerCase().trim();

    // Direct mapping check
    if (CONDITION_MAPPINGS[normalized]) {
        return CONDITION_MAPPINGS[normalized];
    }

    // Partial match check
    for (const [key, value] of Object.entries(CONDITION_MAPPINGS)) {
        if (normalized.includes(key)) {
            return value;
        }
    }

    return "good"; // Default fallback
}

// ========================================
// PLATFORM DETECTION
// ========================================

/**
 * Detect platform from source URL
 */
export function detectPlatform(sourceUrl: string): Platform {
    const url = sourceUrl.toLowerCase();

    if (url.includes("wallapop")) return "wallapop";
    if (url.includes("vinted")) return "vinted";
    if (url.includes("ebay")) return "ebay";
    if (url.includes("milanuncios")) return "milanuncios";

    // Default fallback (shouldn't happen in production)
    return "wallapop";
}

// ========================================
// PRICE NORMALIZATION
// ========================================

/**
 * Extract numeric price from various formats
 */
export function normalizePrice(rawPrice: string | number | undefined): number {
    if (typeof rawPrice === "number") return Math.max(0, rawPrice);
    if (!rawPrice) return 0;

    // Remove currency symbols and text
    const cleaned = rawPrice
        .replace(/[€$£]/g, "")
        .replace(/EUR|USD|GBP/gi, "")
        .replace(/\s/g, "")
        .replace(",", ".") // Handle European decimal format
        .trim();

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

/**
 * Normalize currency code
 */
export function normalizeCurrency(rawCurrency: string | undefined): string {
    if (!rawCurrency) return "EUR";

    const currency = rawCurrency.toUpperCase().trim();

    const currencyMap: Record<string, string> = {
        "€": "EUR",
        "EURO": "EUR",
        "EUROS": "EUR",
        "$": "USD",
        "DOLLAR": "USD",
        "DOLLARS": "USD",
        "£": "GBP",
        "POUND": "GBP",
        "POUNDS": "GBP",
    };

    return currencyMap[currency] || currency || "EUR";
}

// ========================================
// RAW DATA INTERFACES
// ========================================

/**
 * Generic raw product data from any external source
 */
export interface RawProductData {
    title?: string;
    name?: string;
    description?: string;
    price?: string | number;
    currency?: string;
    image?: string;
    image_url?: string;
    imageUrl?: string;
    images?: string[];
    url?: string;
    source_url?: string;
    sourceUrl?: string;
    link?: string;
    platform?: string;
    source?: string;
    category?: string;
    categoryName?: string;
    location?: string;
    city?: string;
    region?: string;
    condition?: string;
    state?: string;
    status?: string;
    phash?: string;
    perceptualHash?: string;
    created_at?: string | Date;
    publishedAt?: string;
    createdAt?: string;
    // Platform-specific fields
    [key: string]: unknown;
}

// ========================================
// MAIN NORMALIZATION FUNCTION
// ========================================

/**
 * Normalize raw product data from any source into Findly's Product format
 * This is the main entry point for data normalization
 */
export function normalizeProduct(rawData: RawProductData): Omit<Product, "id" | "price_score" | "created_at"> & { id?: string } {
    // Extract title (handling various field names)
    const title = (rawData.title || rawData.name || "Untitled Product").toString().trim();

    // Extract description
    const description = (rawData.description || "").toString().trim();

    // Extract and normalize price
    const price = normalizePrice(rawData.price);

    // Extract and normalize currency
    const currency = normalizeCurrency(rawData.currency);

    // Extract image URL (handling various field names and arrays)
    let imageUrl = "";
    if (rawData.image_url) {
        imageUrl = rawData.image_url;
    } else if (rawData.imageUrl) {
        imageUrl = rawData.imageUrl;
    } else if (rawData.image) {
        imageUrl = rawData.image;
    } else if (rawData.images && Array.isArray(rawData.images) && rawData.images.length > 0) {
        imageUrl = rawData.images[0];
    }

    // Extract source URL
    const sourceUrl = (
        rawData.source_url ||
        rawData.sourceUrl ||
        rawData.url ||
        rawData.link ||
        ""
    ).toString().trim();

    // Detect or use explicit platform
    const platform = rawData.platform
        ? (rawData.platform.toLowerCase() as Platform)
        : rawData.source
            ? (rawData.source.toLowerCase() as Platform)
            : detectPlatform(sourceUrl);

    // Normalize category
    const category = normalizeCategory(rawData.category || rawData.categoryName);

    // Extract location
    const location = (rawData.location || rawData.city || rawData.region || "").toString().trim();

    // Normalize condition
    const condition = normalizeCondition(rawData.condition || rawData.state || rawData.status);

    // Extract perceptual hash if available
    const phash = (rawData.phash || rawData.perceptualHash || null) as string | null;

    return {
        title,
        description,
        price,
        currency,
        image_url: imageUrl,
        source_url: sourceUrl,
        platform,
        category,
        location,
        condition,
        phash,
    };
}

/**
 * Normalize a batch of products
 */
export function normalizeProductBatch(rawProducts: RawProductData[]): Array<Omit<Product, "id" | "price_score" | "created_at"> & { id?: string }> {
    return rawProducts.map(normalizeProduct);
}

/**
 * Validate that required fields are present after normalization
 */
export function isValidNormalizedProduct(product: ReturnType<typeof normalizeProduct>): boolean {
    return !!(
        product.title &&
        product.title.length > 0 &&
        product.price >= 0 &&
        product.source_url &&
        product.source_url.length > 0 &&
        product.platform &&
        product.category
    );
}

/**
 * Generate a unique product ID
 */
export function generateProductId(): string {
    return uuidv4();
}
