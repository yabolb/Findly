/**
 * SYNC ORCHESTRATOR
 * =================
 * PRD Section 5.2: Data Ingestion Orchestration
 * 
 * Responsibilities:
 * - Coordinate multi-platform scraping
 * - Apply Trust Engine (price scoring)
 * - Perform pHash de-duplication
 * - Bulk insert/update to Supabase
 */

import { Product, Platform, Category, PriceScore, CATEGORY_LABELS } from "@/types";
import { multiPlatformScraper } from "./multi-platform-scraper";
import { ScrapeResult, SyncLogService } from "./scraperService";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { v4 as uuidv4 } from "uuid";

// ============================================
// TRUST ENGINE - Price Intelligence
// ============================================

export class TrustEngine {
    // Average prices by category (in EUR) - would be dynamically calculated in production
    private static categoryPriceRanges: Record<Category, { avg: number; stdDev: number }> = {
        "cars-motorcycles": { avg: 8000, stdDev: 5000 },
        "fashion": { avg: 35, stdDev: 25 },
        "real-estate": { avg: 150000, stdDev: 100000 },
        "tech-electronics": { avg: 200, stdDev: 150 },
        "sports-leisure": { avg: 80, stdDev: 60 },
        "home-garden": { avg: 100, stdDev: 80 },
        "movies-books-music": { avg: 15, stdDev: 10 },
        "baby-kids": { avg: 25, stdDev: 20 },
        "collectibles-art": { avg: 150, stdDev: 200 },
        "diy": { avg: 50, stdDev: 40 },
        "agriculture-industrial": { avg: 500, stdDev: 400 },
        "services": { avg: 50, stdDev: 30 },
        "others": { avg: 50, stdDev: 40 },
    };

    /**
     * Calculate price score for a product
     * Bargain: < avg - 0.5*stdDev (bottom 30%)
     * Fair: between avg ± 0.5*stdDev (middle 40%)
     * Expensive: > avg + 0.5*stdDev (top 30%)
     */
    static calculatePriceScore(product: Omit<Product, "price_score">): PriceScore {
        const range = this.categoryPriceRanges[product.category];
        if (!range || product.price <= 0) return null;

        const bargainThreshold = range.avg - (range.stdDev * 0.5);
        const expensiveThreshold = range.avg + (range.stdDev * 0.5);

        if (product.price < bargainThreshold) {
            return "bargain";
        } else if (product.price > expensiveThreshold) {
            return "expensive";
        } else {
            return "fair";
        }
    }

    /**
     * Apply price scores to a batch of products
     */
    static applyPriceScores(products: Omit<Product, "price_score">[]): Product[] {
        return products.map(product => ({
            ...product,
            price_score: this.calculatePriceScore(product),
        }));
    }

    /**
     * Filter out suspicious listings (spam, scams, etc.)
     */
    static filterSuspiciousListings(products: Product[]): Product[] {
        return products.filter(product => {
            // Filter out products with suspicious prices (too low or too high)
            if (product.price <= 0) return false;
            if (product.price < 1 && product.category !== "services") return false;
            if (product.price > 1000000) return false;

            // Filter out products with no images
            if (!product.image_url) return false;

            // Filter out products with very short titles
            if (product.title.length < 5) return false;

            // Filter out spam keywords
            const spamKeywords = ["whatsapp", "telegram", "call me", "llámame", "contacta"];
            const lowerTitle = product.title.toLowerCase();
            if (spamKeywords.some(keyword => lowerTitle.includes(keyword))) return false;

            return true;
        });
    }
}

// ============================================
// DEDUPLICATION ENGINE
// ============================================

export class DeduplicationEngine {
    /**
     * Simple string-based deduplication by source URL
     * In production, this would use perceptual hashing (pHash)
     */
    static deduplicateByUrl(products: Product[]): Product[] {
        const seen = new Map<string, Product>();

        for (const product of products) {
            const key = product.source_url;

            if (!seen.has(key)) {
                seen.set(key, product);
            }
        }

        return Array.from(seen.values());
    }

    /**
     * Deduplicate by title similarity (Levenshtein distance)
     * Merge products from different platforms that look identical
     */
    static deduplicateByTitle(products: Product[], threshold: number = 0.85): Product[] {
        const deduplicated: Product[] = [];
        const processed = new Set<string>();

        for (let i = 0; i < products.length; i++) {
            if (processed.has(products[i].id)) continue;

            const current = products[i];
            const duplicates: Product[] = [current];

            for (let j = i + 1; j < products.length; j++) {
                if (processed.has(products[j].id)) continue;

                const similarity = this.calculateSimilarity(
                    current.title.toLowerCase(),
                    products[j].title.toLowerCase()
                );

                // If titles are very similar and prices are close
                if (similarity > threshold) {
                    const priceDiff = Math.abs(current.price - products[j].price) / Math.max(current.price, products[j].price);
                    if (priceDiff < 0.2) { // Within 20% price range
                        duplicates.push(products[j]);
                        processed.add(products[j].id);
                    }
                }
            }

            // Keep the product with the best price (potential arbitrage)
            if (duplicates.length > 1) {
                duplicates.sort((a, b) => a.price - b.price);
            }

            deduplicated.push(duplicates[0]);
            processed.add(current.id);
        }

        return deduplicated;
    }

    /**
     * Calculate Jaccard similarity between two strings
     */
    private static calculateSimilarity(str1: string, str2: string): number {
        const words1 = new Set(str1.split(/\s+/).filter(w => w.length > 2));
        const words2 = new Set(str2.split(/\s+/).filter(w => w.length > 2));

        if (words1.size === 0 || words2.size === 0) return 0;

        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);

        return intersection.size / union.size;
    }

    /**
     * Merge duplicate products from different platforms
     * Returns the best listing with alternatives noted
     */
    static mergeDuplicates(products: Product[]): Product[] {
        // First dedupe by URL (exact matches)
        const urlDeduped = this.deduplicateByUrl(products);

        // Then dedupe by title similarity (cross-platform duplicates)
        const titleDeduped = this.deduplicateByTitle(urlDeduped, 0.8);

        return titleDeduped;
    }
}

// ============================================
// DATABASE OPERATIONS
// ============================================

export class ProductDatabase {
    /**
     * Bulk upsert products to Supabase
     */
    static async bulkUpsert(products: Product[]): Promise<{
        inserted: number;
        updated: number;
        errors: number;
    }> {
        if (products.length === 0) {
            return { inserted: 0, updated: 0, errors: 0 };
        }

        // Prepare products for insertion
        const preparedProducts = products.map(product => ({
            id: product.id || uuidv4(),
            title: product.title.substring(0, 500), // Limit title length
            description: product.description.substring(0, 2000),
            price: product.price,
            currency: product.currency,
            image_url: product.image_url,
            source_url: product.source_url,
            platform: product.platform,
            category: product.category,
            location: product.location.substring(0, 200),
            condition: product.condition,
            phash: product.phash,
            price_score: product.price_score,
            created_at: product.created_at?.toISOString() || new Date().toISOString(),
        }));

        try {
            // Use upsert with source_url as the unique key
            const { data, error } = await supabaseAdmin
                .from("products")
                .upsert(preparedProducts, {
                    onConflict: "source_url",
                    ignoreDuplicates: false,
                })
                .select();

            if (error) {
                console.error("[ProductDatabase] Bulk upsert error:", error);
                return { inserted: 0, updated: 0, errors: preparedProducts.length };
            }

            // Count inserted vs updated (simplified - actual count would need triggers)
            const resultCount = data?.length || 0;
            return {
                inserted: resultCount,
                updated: 0, // Would need separate tracking
                errors: preparedProducts.length - resultCount,
            };
        } catch (error) {
            console.error("[ProductDatabase] Exception during upsert:", error);
            return { inserted: 0, updated: 0, errors: preparedProducts.length };
        }
    }

    /**
     * Get product count by platform
     */
    static async getCountByPlatform(): Promise<Record<Platform, number>> {
        const counts: Record<Platform, number> = {
            wallapop: 0,
            vinted: 0,
            ebay: 0,
            milanuncios: 0,
        };

        for (const platform of Object.keys(counts) as Platform[]) {
            const { count, error } = await supabaseAdmin
                .from("products")
                .select("*", { count: "exact", head: true })
                .eq("platform", platform);

            if (!error && count !== null) {
                counts[platform] = count;
            }
        }

        return counts;
    }
}

// ============================================
// SYNC ORCHESTRATOR
// ============================================

export interface SyncResult {
    platform: Platform;
    success: boolean;
    itemsFound: number;
    itemsInserted: number;
    itemsUpdated: number;
    itemsFiltered: number;
    duration: number;
    error?: string;
}

export interface GlobalSyncResult {
    startTime: Date;
    endTime: Date;
    duration: number;
    query: string;
    category?: Category;
    results: SyncResult[];
    totalItemsFound: number;
    totalItemsInserted: number;
    totalItemsFiltered: number;
    platforms: {
        successful: Platform[];
        failed: Platform[];
        banned: Platform[];
    };
}

export class SyncOrchestrator {
    /**
     * Run a global sync across all platforms for a specific query/category
     */
    async runGlobalSync(
        query: string,
        category?: Category,
        options: {
            platforms?: Platform[];
            skipBannedPlatforms?: boolean;
        } = {}
    ): Promise<GlobalSyncResult> {
        const startTime = new Date();
        const results: SyncResult[] = [];
        const allProducts: Product[] = [];

        // Determine which platforms to sync
        let platformsToSync: Platform[] = options.platforms ||
            ["wallapop", "vinted", "ebay", "milanuncios"];

        // Skip banned platforms if requested
        if (options.skipBannedPlatforms) {
            const bannedChecks = await Promise.all(
                platformsToSync.map(async (p) => ({
                    platform: p,
                    isBanned: await this.isPlatformBanned(p),
                }))
            );
            platformsToSync = bannedChecks
                .filter(c => !c.isBanned)
                .map(c => c.platform);
        }

        console.log(`[SyncOrchestrator] Starting sync for "${query}" across ${platformsToSync.length} platforms`);

        // Fetch from all platforms concurrently
        const scrapeResults = await Promise.allSettled(
            platformsToSync.map(platform =>
                multiPlatformScraper.searchPlatform(platform, query, category)
            )
        );

        // Process results
        for (let i = 0; i < platformsToSync.length; i++) {
            const platform = platformsToSync[i];
            const result = scrapeResults[i];

            if (result.status === "rejected") {
                results.push({
                    platform,
                    success: false,
                    itemsFound: 0,
                    itemsInserted: 0,
                    itemsUpdated: 0,
                    itemsFiltered: 0,
                    duration: 0,
                    error: String(result.reason),
                });
                continue;
            }

            const scrapeResult = result.value;

            // Log the sync
            await SyncLogService.logSync(scrapeResult, 0, 0, query);

            if (scrapeResult.success) {
                allProducts.push(...scrapeResult.items);
            }

            results.push({
                platform,
                success: scrapeResult.success,
                itemsFound: scrapeResult.itemsFound,
                itemsInserted: 0, // Will be updated after dedup
                itemsUpdated: 0,
                itemsFiltered: 0,
                duration: scrapeResult.requestDurationMs,
                error: scrapeResult.errorMessage || undefined,
            });
        }

        console.log(`[SyncOrchestrator] Scraped ${allProducts.length} total products`);

        // Apply Trust Engine - Price Scoring
        const scoredProducts = TrustEngine.applyPriceScores(allProducts);

        // Filter suspicious listings
        const filteredProducts = TrustEngine.filterSuspiciousListings(scoredProducts);
        const itemsFiltered = scoredProducts.length - filteredProducts.length;

        console.log(`[SyncOrchestrator] Filtered ${itemsFiltered} suspicious listings`);

        // Deduplicate across platforms
        const deduplicatedProducts = DeduplicationEngine.mergeDuplicates(filteredProducts);
        const duplicatesRemoved = filteredProducts.length - deduplicatedProducts.length;

        console.log(`[SyncOrchestrator] Removed ${duplicatesRemoved} duplicates`);

        // Bulk insert to database
        const dbResult = await ProductDatabase.bulkUpsert(deduplicatedProducts);

        console.log(`[SyncOrchestrator] Inserted ${dbResult.inserted} products, ${dbResult.errors} errors`);

        const endTime = new Date();

        // Categorize platforms
        const successful = results.filter(r => r.success).map(r => r.platform);
        const failed = results.filter(r => !r.success && !r.error?.includes("banned")).map(r => r.platform);
        const banned = results.filter(r => r.error?.toLowerCase().includes("banned") ||
            r.error?.toLowerCase().includes("403")).map(r => r.platform);

        return {
            startTime,
            endTime,
            duration: endTime.getTime() - startTime.getTime(),
            query,
            category,
            results,
            totalItemsFound: allProducts.length,
            totalItemsInserted: dbResult.inserted,
            totalItemsFiltered: itemsFiltered + duplicatesRemoved,
            platforms: {
                successful,
                failed,
                banned,
            },
        };
    }

    /**
     * Run sync for all 13 categories
     */
    async runCategorySync(category: Category): Promise<GlobalSyncResult[]> {
        // Define search queries per category
        const categoryQueries: Record<Category, string[]> = {
            "cars-motorcycles": ["coche", "moto", "volkswagen", "seat"],
            "fashion": ["zara", "nike", "adidas", "vestido"],
            "real-estate": ["piso", "apartamento", "casa"],
            "tech-electronics": ["iphone", "samsung", "playstation", "ordenador"],
            "sports-leisure": ["bicicleta", "gimnasio", "esqui"],
            "home-garden": ["sofa", "mesa", "jardin", "ikea"],
            "movies-books-music": ["libro", "vinilo", "dvd"],
            "baby-kids": ["carrito bebe", "juguete", "ropa niño"],
            "collectibles-art": ["coleccion", "vintage", "arte"],
            "diy": ["herramienta", "bricolaje", "taladro"],
            "agriculture-industrial": ["tractor", "maquinaria"],
            "services": ["reformas", "clases"],
            "others": ["varios"],
        };

        const queries = categoryQueries[category] || ["general"];
        const results: GlobalSyncResult[] = [];

        for (const query of queries) {
            const result = await this.runGlobalSync(query, category);
            results.push(result);

            // Add delay between queries to avoid rate limits
            await this.delay(2000);
        }

        return results;
    }

    /**
     * Run a full sync across all categories (for cron jobs)
     */
    async runFullSync(): Promise<{
        totalDuration: number;
        categorySynced: number;
        totalItems: number;
        errors: string[];
    }> {
        const startTime = Date.now();
        const errors: string[] = [];
        let totalItems = 0;
        let categorySynced = 0;

        const categories = Object.keys(CATEGORY_LABELS) as Category[];

        for (const category of categories) {
            try {
                const results = await this.runCategorySync(category);
                categorySynced++;
                totalItems += results.reduce((sum, r) => sum + r.totalItemsInserted, 0);
            } catch (error) {
                errors.push(`${category}: ${String(error)}`);
            }

            // Longer delay between categories
            await this.delay(5000);
        }

        return {
            totalDuration: Date.now() - startTime,
            categorySynced,
            totalItems,
            errors,
        };
    }

    /**
     * Check if a platform is currently banned
     */
    private async isPlatformBanned(platform: Platform): Promise<boolean> {
        const recentLogs = await SyncLogService.getRecentLogs(platform, 3);
        if (recentLogs.length < 3) return false;

        return recentLogs.every(log =>
            log.status === "banned" || log.status === "error"
        );
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const syncOrchestrator = new SyncOrchestrator();
