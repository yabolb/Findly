import { Product, PriceScore, Category } from "@/types";

/**
 * TRUST ENGINE - Quality & Price Intelligence Service
 * PRD Section 4.3 (Price Score) & 5.4 (Trust Engine)
 */

// Intent Filtering Keywords (Spanish "Wanted/Buying" Intent)
const INTENT_KEYWORDS = [
    "busco",
    "compro",
    "buscando",
    "compraría",
    "necesito",
    "quiero comprar",
    "se busca",
    "looking for",
    "wtb", // Want to Buy
];

// Noise Reduction Rules
const NOISE_RULES = {
    // Phones category with price < 30€ is likely an accessory
    phones_min_price: 30,
    // Add more noise detection rules as needed
};

/**
 * Check if a product has "Wanted/Buying" intent
 * These should be excluded from the main feed
 */
export function hasWantedIntent(product: Product): boolean {
    const searchText = `${product.title} ${product.description}`.toLowerCase();

    return INTENT_KEYWORDS.some((keyword) =>
        searchText.includes(keyword.toLowerCase())
    );
}

/**
 * Detect if a product is likely "noise" (e.g., accessories sold as phones)
 * Based on PRD Section 5.3 - Trust Engine
 */
export function isNoise(product: Product): boolean {
    // Rule: Tech/Electronics category with extremely low prices
    if (
        product.category === "tech-electronics" &&
        product.price < NOISE_RULES.phones_min_price &&
        product.currency === "EUR"
    ) {
        // Check if title suggests it's an actual phone vs accessory
        const titleLower = product.title.toLowerCase();
        const isAccessory =
            titleLower.includes("funda") ||
            titleLower.includes("carcasa") ||
            titleLower.includes("case") ||
            titleLower.includes("protector") ||
            titleLower.includes("cable") ||
            titleLower.includes("cargador") ||
            titleLower.includes("charger");

        return isAccessory;
    }

    // Add more noise detection patterns as needed
    return false;
}

/**
 * Calculate Price Score based on category median
 * PRD Section 4.3: Price Intelligence
 * 
 * Rules:
 * - 🟢 Bargain: > 15% below median
 * - 🟡 Fair Price: Within standard range (±15%)
 * - 🔴 Expensive: > 15% above median
 */
export function calculatePriceScore(
    product: Product,
    categoryMedian: number
): PriceScore {
    if (!categoryMedian || categoryMedian === 0) {
        return null; // Not enough data to calculate
    }

    const deviation = (product.price - categoryMedian) / categoryMedian;

    if (deviation < -0.15) {
        return "bargain"; // More than 15% below median
    } else if (deviation > 0.15) {
        return "expensive"; // More than 15% above median
    } else {
        return "fair"; // Within ±15% of median
    }
}

/**
 * Calculate median price for a category from products array
 * Used for batch processing / analytics
 */
export function calculateCategoryMedian(products: Product[]): number {
    if (products.length === 0) return 0;

    const prices = products.map((p) => p.price).sort((a, b) => a - b);
    const mid = Math.floor(prices.length / 2);

    if (prices.length % 2 === 0) {
        return (prices[mid - 1] + prices[mid]) / 2;
    } else {
        return prices[mid];
    }
}

/**
 * Filter out products that don't meet trust criteria
 * Returns clean products ready for display
 */
export function filterTrustedProducts(products: Product[]): Product[] {
    return products.filter((product) => {
        // Exclude "Wanted" intent products
        if (hasWantedIntent(product)) {
            return false;
        }

        // Exclude noise/spam
        if (isNoise(product)) {
            return false;
        }

        return true;
    });
}

/**
 * Validate product data completeness
 * Ensures essential fields are present
 */
export function isValidProduct(product: Partial<Product>): boolean {
    return !!(
        product.title &&
        product.price !== undefined &&
        product.price >= 0 &&
        product.source_url &&
        product.platform &&
        product.category
    );
}

/**
 * Sanitize product data before storage
 * Cleans up common issues in scraped data
 */
export function sanitizeProduct(product: Partial<Product>): Partial<Product> {
    return {
        ...product,
        title: product.title?.trim(),
        description: product.description?.trim() || "",
        price: Math.max(0, product.price || 0), // Ensure non-negative
        currency: product.currency || "EUR",
        location: product.location?.trim() || "",
    };
}

/**
 * Category-specific median prices (cached/hardcoded fallback)
 * In production, these would come from database aggregations
 */
export const CATEGORY_MEDIAN_PRICES: Record<Category, number> = {
    "cars-motorcycles": 8500,
    "fashion": 25,
    "real-estate": 150000,
    "tech-electronics": 120,
    "sports-leisure": 45,
    "home-garden": 35,
    "movies-books-music": 8,
    "baby-kids": 20,
    "collectibles-art": 60,
    "diy": 30,
    "agriculture-industrial": 1200,
    "services": 50,
    "others": 40,
};

/**
 * Get price score with category-based fallback
 */
export function getPriceScoreForProduct(product: Product): PriceScore {
    const categoryMedian = CATEGORY_MEDIAN_PRICES[product.category] || 0;
    return calculatePriceScore(product, categoryMedian);
}
