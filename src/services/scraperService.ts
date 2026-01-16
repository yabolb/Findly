/**
 * SCRAPER SERVICE - Ban Detection & Health Logging
 * =================================================
 * PRD Section 5.2: Data Ingestion - Resilient Scraping
 * 
 * Features:
 * - Centralized scraping coordination
 * - Ban/rate limit detection
 * - Health logging to sync_logs table
 * - Platform status monitoring
 */

import { Product, Platform, SyncStatus, SyncLog } from "@/types";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
    PLATFORMS_CONFIG,
    PlatformConfig,
    getActivePlatforms,
    getPlatformConfig,
    detectBan,
    buildSearchUrl
} from "@/config/platforms";
import { v4 as uuidv4 } from "uuid";

// ============================================
// SCRAPE RESULT INTERFACE
// ============================================

export interface ScrapeResult {
    platform: Platform;
    success: boolean;
    status: SyncStatus;
    statusCode: number;
    errorMessage: string | null;
    banReason: string | null;
    items: Product[];
    itemsFound: number;
    requestDurationMs: number;
}

// ============================================
// SYNC LOG SERVICE
// ============================================

export class SyncLogService {
    /**
     * Log a sync operation to the database
     */
    static async logSync(
        result: ScrapeResult,
        insertedCount: number = 0,
        updatedCount: number = 0,
        searchQuery: string | null = null
    ): Promise<void> {
        try {
            const logEntry = {
                id: uuidv4(),
                platform: result.platform,
                status: result.status,
                http_status: result.statusCode !== 200 ? result.statusCode : null,
                // Combine relevant info into error_message since ban_reason/query columns don't exist
                error_message: result.banReason
                    ? `[${searchQuery || '?'}] Banned: ${result.banReason}`
                    : (searchQuery ? `[${searchQuery}] ${result.errorMessage || ''}` : result.errorMessage),
                items_found: result.itemsFound,
                items_added: insertedCount,
                response_time_ms: result.requestDurationMs,
                created_at: new Date().toISOString(),
            };

            const { error } = await supabaseAdmin
                .from("sync_logs")
                .insert(logEntry);

            if (error) {
                console.error("[SyncLogService] Failed to log sync:", error.message);
            }
        } catch (err) {
            console.error("[SyncLogService] Exception logging sync:", err);
        }
    }

    /**
     * Get recent logs for a platform
     */
    static async getRecentLogs(
        platform: Platform,
        limit: number = 10
    ): Promise<SyncLog[]> {
        const { data, error } = await supabaseAdmin
            .from("sync_logs")
            .select("*")
            .eq("platform", platform)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("[SyncLogService] Failed to get logs:", error.message);
            return [];
        }

        return data as SyncLog[];
    }

    /**
     * Get the last N sync statuses for a platform
     */
    static async getLastNStatuses(
        platform: Platform,
        n: number = 3
    ): Promise<SyncStatus[]> {
        const { data, error } = await supabaseAdmin
            .from("sync_logs")
            .select("status")
            .eq("platform", platform)
            .order("created_at", { ascending: false })
            .limit(n);

        if (error) {
            console.error("[SyncLogService] Failed to get statuses:", error.message);
            return [];
        }

        return data.map((row) => row.status as SyncStatus);
    }

    /**
     * Get platform health statistics
     */
    static async getPlatformHealth(
        platform: Platform,
        hours: number = 24
    ): Promise<{
        totalSyncs: number;
        successCount: number;
        errorCount: number;
        bannedCount: number;
        suspiciousCount: number;
        successRate: number;
        totalItemsFound: number;
        lastSyncAt: Date | null;
        lastStatus: SyncStatus | null;
    }> {
        const cutoffDate = new Date();
        cutoffDate.setHours(cutoffDate.getHours() - hours);

        // Get aggregated stats
        const { data, error } = await supabaseAdmin
            .from("sync_logs")
            .select("status, items_found, created_at")
            .eq("platform", platform)
            .gte("created_at", cutoffDate.toISOString())
            .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
            return {
                totalSyncs: 0,
                successCount: 0,
                errorCount: 0,
                bannedCount: 0,
                suspiciousCount: 0,
                successRate: 0,
                totalItemsFound: 0,
                lastSyncAt: null,
                lastStatus: null,
            };
        }

        const stats = {
            totalSyncs: data.length,
            successCount: data.filter((d) => d.status === "success").length,
            errorCount: data.filter((d) => d.status === "error").length,
            bannedCount: data.filter((d) => d.status === "banned").length,
            suspiciousCount: data.filter((d) => d.status === "suspicious").length,
            successRate: 0,
            totalItemsFound: data.reduce((sum, d) => sum + (d.items_found || 0), 0),
            lastSyncAt: new Date(data[0].created_at),
            lastStatus: data[0].status as SyncStatus,
        };

        stats.successRate = stats.totalSyncs > 0
            ? Math.round((stats.successCount / stats.totalSyncs) * 100)
            : 0;

        return stats;
    }

    /**
     * Get all platforms health summary
     */
    static async getAllPlatformsHealth(): Promise<
        Map<Platform, ReturnType<typeof SyncLogService.getPlatformHealth> extends Promise<infer T> ? T : never>
    > {
        const platforms: Platform[] = ["wallapop", "vinted", "ebay", "milanuncios"];
        const healthMap = new Map();

        for (const platform of platforms) {
            const health = await this.getPlatformHealth(platform);
            healthMap.set(platform, health);
        }

        return healthMap;
    }
}

// ============================================
// BAN DETECTION SERVICE
// ============================================

export class BanDetectionService {
    /**
     * Analyze a response to detect bans/blocks
     */
    static analyzeResponse(
        platform: Platform,
        statusCode: number,
        responseBody: string,
        itemsFound: number
    ): { status: SyncStatus; reason: string | null } {
        const config = getPlatformConfig(platform);
        if (!config) {
            return { status: "error", reason: "Platform not configured" };
        }

        // Check for ban using centralized detection
        const banCheck = detectBan(platform, statusCode, responseBody);
        if (banCheck.isBanned) {
            return { status: "banned", reason: banCheck.reason };
        }

        // Check for common HTTP error codes
        if (statusCode >= 500) {
            return { status: "error", reason: `Server error: ${statusCode}` };
        }

        if (statusCode === 403) {
            return { status: "banned", reason: "HTTP 403 - Forbidden/Blocked" };
        }

        if (statusCode === 429) {
            return { status: "banned", reason: "HTTP 429 - Rate Limited" };
        }

        // Check for suspicious patterns in body
        const suspiciousPatterns = [
            "captcha",
            "verify you are human",
            "access denied",
            "blocked",
            "unusual activity",
            "security check",
        ];

        const lowerBody = responseBody.toLowerCase();
        for (const pattern of suspiciousPatterns) {
            if (lowerBody.includes(pattern)) {
                return {
                    status: "banned",
                    reason: `Detected pattern: "${pattern}"`
                };
            }
        }

        // Check for suspicious: 200 status but no items
        if (statusCode === 200 && itemsFound === 0) {
            return {
                status: "suspicious",
                reason: "200 OK but 0 items found - possible soft block"
            };
        }

        // Success!
        if (statusCode === 200 && itemsFound > 0) {
            return { status: "success", reason: null };
        }

        // Default to error for other cases
        return { status: "error", reason: `Unexpected status: ${statusCode}` };
    }

    /**
     * Check if a platform is currently banned (3 consecutive failures)
     */
    static async isPlatformBanned(platform: Platform): Promise<boolean> {
        const recentStatuses = await SyncLogService.getLastNStatuses(platform, 3);

        if (recentStatuses.length < 3) return false;

        const allFailed = recentStatuses.every(
            (status) => status === "banned" || status === "error"
        );

        return allFailed;
    }

    /**
     * Check if platform is showing suspicious behavior (no items in last N attempts)
     */
    static async isPlatformSuspicious(
        platform: Platform,
        attempts: number = 3
    ): Promise<boolean> {
        const recentLogs = await SyncLogService.getRecentLogs(platform, attempts);

        if (recentLogs.length < attempts) return false;

        const noItemsFound = recentLogs.every(
            (log) => log.items_found === 0 || log.status === "suspicious"
        );

        return noItemsFound;
    }
}

// ============================================
// BASE SCRAPER CLASS (Updated)
// ============================================

export interface ScraperConfig {
    baseUrl: string;
    searchEndpoint: string;
    rateLimit: number;
    headers?: Record<string, string>;
}

export abstract class BaseScraper {
    protected config: ScraperConfig;
    protected platformConfig: PlatformConfig;

    constructor(platform: Platform) {
        const config = getPlatformConfig(platform);
        if (!config) {
            throw new Error(`Platform ${platform} not configured`);
        }

        this.platformConfig = config;
        this.config = {
            baseUrl: config.baseUrl,
            searchEndpoint: config.searchPath,
            rateLimit: config.requestsPerMinute,
            headers: config.headers,
        };
    }

    /**
     * Search for products on the marketplace
     */
    abstract search(query: string, filters?: any): Promise<ScrapeResult>;

    /**
     * Get product details by ID
     */
    abstract getProduct(id: string): Promise<Product | null>;

    /**
     * Rate limiting helper
     */
    protected async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Execute a scrape with timing and ban detection
     */
    protected async executeScrape(
        url: string,
        options: RequestInit = {}
    ): Promise<{
        statusCode: number;
        body: string;
        duration: number
    }> {
        const startTime = Date.now();

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.platformConfig.headers,
                    ...options.headers,
                    "User-Agent": this.getRandomUserAgent(),
                },
            });

            const body = await response.text();
            const duration = Date.now() - startTime;

            return {
                statusCode: response.status,
                body,
                duration,
            };
        } catch (error) {
            const duration = Date.now() - startTime;
            return {
                statusCode: 0,
                body: String(error),
                duration,
            };
        }
    }

    /**
     * Get a random user agent for rotation
     */
    protected getRandomUserAgent(): string {
        const userAgents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        ];
        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }

    /**
     * Parse and normalize product data
     */
    protected abstract normalizeProduct(rawData: any): Product;
}

// ============================================
// PLATFORM SCRAPERS
// ============================================

export class WallapopScraper extends BaseScraper {
    constructor() {
        super("wallapop");
    }

    async search(query: string, filters?: any): Promise<ScrapeResult> {
        const startTime = Date.now();
        const url = buildSearchUrl("wallapop", query);

        try {
            // Apply rate limiting delay
            await this.delay(this.platformConfig.delayBetweenRequests);

            const { statusCode, body, duration } = await this.executeScrape(url);

            // Analyze response for bans
            const items: Product[] = [];
            let itemsFound = 0;

            if (statusCode === 200) {
                // TODO: Parse actual products from response
                // For now, this is a placeholder
                itemsFound = 0;
            }

            const analysis = BanDetectionService.analyzeResponse(
                "wallapop",
                statusCode,
                body,
                itemsFound
            );

            return {
                platform: "wallapop",
                success: analysis.status === "success",
                status: analysis.status,
                statusCode,
                errorMessage: analysis.reason,
                banReason: analysis.status === "banned" ? analysis.reason : null,
                items,
                itemsFound,
                requestDurationMs: duration,
            };
        } catch (error) {
            return {
                platform: "wallapop",
                success: false,
                status: "error",
                statusCode: 0,
                errorMessage: String(error),
                banReason: null,
                items: [],
                itemsFound: 0,
                requestDurationMs: Date.now() - startTime,
            };
        }
    }

    async getProduct(id: string): Promise<Product | null> {
        console.log("Fetching Wallapop product:", id);
        return null;
    }

    protected normalizeProduct(rawData: any): Product {
        throw new Error("Not implemented");
    }
}

export class VintedScraper extends BaseScraper {
    constructor() {
        super("vinted");
    }

    async search(query: string, filters?: any): Promise<ScrapeResult> {
        const startTime = Date.now();
        const url = buildSearchUrl("vinted", query);

        try {
            await this.delay(this.platformConfig.delayBetweenRequests);
            const { statusCode, body, duration } = await this.executeScrape(url);

            const items: Product[] = [];
            let itemsFound = 0;

            if (statusCode === 200) {
                itemsFound = 0; // TODO: Parse actual products
            }

            const analysis = BanDetectionService.analyzeResponse(
                "vinted",
                statusCode,
                body,
                itemsFound
            );

            return {
                platform: "vinted",
                success: analysis.status === "success",
                status: analysis.status,
                statusCode,
                errorMessage: analysis.reason,
                banReason: analysis.status === "banned" ? analysis.reason : null,
                items,
                itemsFound,
                requestDurationMs: duration,
            };
        } catch (error) {
            return {
                platform: "vinted",
                success: false,
                status: "error",
                statusCode: 0,
                errorMessage: String(error),
                banReason: null,
                items: [],
                itemsFound: 0,
                requestDurationMs: Date.now() - startTime,
            };
        }
    }

    async getProduct(id: string): Promise<Product | null> {
        return null;
    }

    protected normalizeProduct(rawData: any): Product {
        throw new Error("Not implemented");
    }
}

export class EbayScraper extends BaseScraper {
    constructor() {
        super("ebay");
    }

    async search(query: string, filters?: any): Promise<ScrapeResult> {
        const startTime = Date.now();
        const url = buildSearchUrl("ebay", query);

        try {
            await this.delay(this.platformConfig.delayBetweenRequests);
            const { statusCode, body, duration } = await this.executeScrape(url);

            const items: Product[] = [];
            let itemsFound = 0;

            if (statusCode === 200) {
                itemsFound = 0; // TODO: Parse actual products
            }

            const analysis = BanDetectionService.analyzeResponse(
                "ebay",
                statusCode,
                body,
                itemsFound
            );

            return {
                platform: "ebay",
                success: analysis.status === "success",
                status: analysis.status,
                statusCode,
                errorMessage: analysis.reason,
                banReason: analysis.status === "banned" ? analysis.reason : null,
                items,
                itemsFound,
                requestDurationMs: duration,
            };
        } catch (error) {
            return {
                platform: "ebay",
                success: false,
                status: "error",
                statusCode: 0,
                errorMessage: String(error),
                banReason: null,
                items: [],
                itemsFound: 0,
                requestDurationMs: Date.now() - startTime,
            };
        }
    }

    async getProduct(id: string): Promise<Product | null> {
        return null;
    }

    protected normalizeProduct(rawData: any): Product {
        throw new Error("Not implemented");
    }
}

// ============================================
// SCRAPER MANAGER
// ============================================

export class ScraperManager {
    private scrapers: Map<Platform, BaseScraper>;

    constructor() {
        this.scrapers = new Map<Platform, BaseScraper>([
            ["wallapop", new WallapopScraper()],
            ["vinted", new VintedScraper()],
            ["ebay", new EbayScraper()],
        ]);
    }

    /**
     * Get a specific scraper
     */
    getScraper(platform: Platform): BaseScraper | undefined {
        return this.scrapers.get(platform);
    }

    /**
     * Search across all active scrapers in parallel
     */
    async searchAll(query: string, filters?: any): Promise<ScrapeResult[]> {
        const activePlatforms = getActivePlatforms();
        const results: ScrapeResult[] = [];

        const promises = activePlatforms.map(async (platformConfig) => {
            const scraper = this.scrapers.get(platformConfig.id);
            if (!scraper) return null;

            try {
                const result = await scraper.search(query, filters);

                // Log the sync result
                await SyncLogService.logSync(result, 0, 0, query);

                return result;
            } catch (error) {
                const errorResult: ScrapeResult = {
                    platform: platformConfig.id,
                    success: false,
                    status: "error",
                    statusCode: 0,
                    errorMessage: String(error),
                    banReason: null,
                    items: [],
                    itemsFound: 0,
                    requestDurationMs: 0,
                };

                await SyncLogService.logSync(errorResult, 0, 0, query);
                return errorResult;
            }
        });

        const settledResults = await Promise.allSettled(promises);

        for (const result of settledResults) {
            if (result.status === "fulfilled" && result.value) {
                results.push(result.value);
            }
        }

        return results;
    }

    /**
     * Search a single platform with logging
     */
    async searchPlatform(
        platform: Platform,
        query: string,
        filters?: any
    ): Promise<ScrapeResult> {
        const scraper = this.scrapers.get(platform);

        if (!scraper) {
            const errorResult: ScrapeResult = {
                platform,
                success: false,
                status: "error",
                statusCode: 0,
                errorMessage: "Scraper not found for platform",
                banReason: null,
                items: [],
                itemsFound: 0,
                requestDurationMs: 0,
            };

            await SyncLogService.logSync(errorResult, 0, 0, query);
            return errorResult;
        }

        const result = await scraper.search(query, filters);
        await SyncLogService.logSync(result, 0, 0, query);

        return result;
    }

    /**
     * Get health status for all platforms
     */
    async getHealthStatus(): Promise<
        Map<Platform, {
            config: PlatformConfig;
            health: Awaited<ReturnType<typeof SyncLogService.getPlatformHealth>>;
            isBanned: boolean;
            isSuspicious: boolean;
        }>
    > {
        const statusMap = new Map();

        for (const [platform] of this.scrapers) {
            const config = getPlatformConfig(platform);
            const health = await SyncLogService.getPlatformHealth(platform);
            const isBanned = await BanDetectionService.isPlatformBanned(platform);
            const isSuspicious = await BanDetectionService.isPlatformSuspicious(platform);

            statusMap.set(platform, {
                config,
                health,
                isBanned,
                isSuspicious,
            });
        }

        return statusMap;
    }
}

// Export singleton instance
export const scraperManager = new ScraperManager();
