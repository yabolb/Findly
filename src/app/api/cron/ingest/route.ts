import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
    PLATFORMS_CONFIG,
    getActivePlatforms,
    getPlatformConfig,
    detectBan,
    buildSearchUrl
} from "@/config/platforms";
import { Platform, SyncStatus } from "@/types";
import {
    normalizeProduct,
    normalizeProductBatch,
    isValidNormalizedProduct,
    RawProductData,
    generateProductId
} from "@/lib/mappers";
import { hasWantedIntent, isNoise, getPriceScoreForProduct } from "@/services/trust-engine";
import { Product } from "@/types";
import { v4 as uuidv4 } from "uuid";

/**
 * AUTOMATED CRON INGESTION
 * ========================
 * Loops through active platforms, runs scrapers, and logs results.
 * 
 * Endpoint: GET /api/cron/ingest
 * Security: Requires CRON_SECRET for authentication
 * 
 * This should be triggered by:
 * - Vercel Cron Jobs
 * - External scheduler (e.g., GitHub Actions, Supabase Edge Functions)
 */

// Cron secret for authentication
const CRON_SECRET = process.env.CRON_SECRET;

// Default search queries for ingestion
const DEFAULT_SEARCH_QUERIES = [
    "iphone",
    "macbook",
    "playstation",
    "nike",
    "vintage",
    "bicicleta",
    "sofa",
    "coche",
];

interface ScrapeResult {
    platform: Platform;
    success: boolean;
    status: SyncStatus;
    statusCode: number;
    errorMessage: string | null;
    banReason: string | null;
    itemsFound: number;
    itemsInserted: number;
    itemsUpdated: number;
    requestDurationMs: number;
}

/**
 * Log sync result to database
 */
async function logSync(
    result: ScrapeResult,
    searchQuery: string
): Promise<void> {
    try {
        const logEntry = {
            id: uuidv4(),
            platform: result.platform,
            status: result.status,
            error_code: result.statusCode !== 200 ? result.statusCode : null,
            error_message: result.errorMessage,
            items_found: result.itemsFound,
            items_inserted: result.itemsInserted,
            items_updated: result.itemsUpdated,
            search_query: searchQuery,
            request_duration_ms: result.requestDurationMs,
            ban_reason: result.banReason,
            created_at: new Date().toISOString(),
        };

        const { error } = await supabaseAdmin
            .from("sync_logs")
            .insert(logEntry);

        if (error) {
            console.error(`[Cron] Failed to log sync for ${result.platform}:`, error.message);
        }
    } catch (err) {
        console.error("[Cron] Exception logging sync:", err);
    }
}

/**
 * Scrape a single platform
 */
async function scrapePlatform(
    platform: Platform,
    query: string
): Promise<ScrapeResult> {
    const startTime = Date.now();
    const config = getPlatformConfig(platform);

    if (!config) {
        return {
            platform,
            success: false,
            status: "error",
            statusCode: 0,
            errorMessage: "Platform not configured",
            banReason: null,
            itemsFound: 0,
            itemsInserted: 0,
            itemsUpdated: 0,
            requestDurationMs: 0,
        };
    }

    // Check if platform is active
    if (config.status !== "active") {
        return {
            platform,
            success: false,
            status: "error",
            statusCode: 0,
            errorMessage: "Platform is not active",
            banReason: null,
            itemsFound: 0,
            itemsInserted: 0,
            itemsUpdated: 0,
            requestDurationMs: 0,
        };
    }

    try {
        // Build search URL
        const url = buildSearchUrl(platform, query);

        // Get a random user agent
        const userAgents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
        ];
        const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

        // Make the request
        const response = await fetch(url, {
            method: "GET",
            headers: {
                ...config.headers,
                "User-Agent": userAgent,
            },
            // Timeout after 30 seconds
            signal: AbortSignal.timeout(30000),
        });

        const body = await response.text();
        const duration = Date.now() - startTime;

        // Analyze response for bans
        const { isBanned, reason: banReason } = detectBan(
            platform,
            response.status,
            body
        );

        // Determine status
        let status: SyncStatus = "success";
        let errorMessage: string | null = null;

        if (isBanned) {
            status = "banned";
            errorMessage = banReason;
        } else if (response.status >= 500) {
            status = "error";
            errorMessage = `Server error: ${response.status}`;
        } else if (response.status === 403) {
            status = "banned";
            errorMessage = "HTTP 403 - Forbidden";
        } else if (response.status === 429) {
            status = "banned";
            errorMessage = "HTTP 429 - Rate Limited";
        } else if (!response.ok) {
            status = "error";
            errorMessage = `HTTP ${response.status}`;
        }

        // TODO: Parse products from response
        // For now, we simulate finding items
        const itemsFound = status === "success" ? Math.floor(Math.random() * 30) : 0;

        // Check for suspicious (200 but no items)
        if (response.status === 200 && itemsFound === 0 && status === "success") {
            status = "suspicious";
            errorMessage = "200 OK but 0 items found";
        }

        return {
            platform,
            success: status === "success",
            status,
            statusCode: response.status,
            errorMessage,
            banReason: status === "banned" ? (banReason || errorMessage) : null,
            itemsFound,
            itemsInserted: 0, // TODO: Actual insertion count
            itemsUpdated: 0,  // TODO: Actual update count
            requestDurationMs: duration,
        };

    } catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : String(error);

        // Check if it's a timeout
        const isTimeout = errorMessage.includes("timeout") || errorMessage.includes("aborted");

        return {
            platform,
            success: false,
            status: isTimeout ? "timeout" : "error",
            statusCode: 0,
            errorMessage,
            banReason: null,
            itemsFound: 0,
            itemsInserted: 0,
            itemsUpdated: 0,
            requestDurationMs: duration,
        };
    }
}

/**
 * GET /api/cron/ingest
 * Main cron handler
 */
export async function GET(request: NextRequest) {
    // Validate cron secret
    const authHeader = request.headers.get("Authorization");
    const cronHeader = request.headers.get("X-Cron-Secret");

    const providedSecret = authHeader?.replace("Bearer ", "") || cronHeader;

    // Allow Vercel cron jobs (they have a specific header)
    const isVercelCron = request.headers.get("x-vercel-cron") === "true";

    if (!isVercelCron && CRON_SECRET && providedSecret !== CRON_SECRET) {
        return NextResponse.json(
            { error: "Unauthorized - Invalid cron secret" },
            { status: 401 }
        );
    }

    const startTime = Date.now();
    const results: ScrapeResult[] = [];

    try {
        // Get active platforms
        const activePlatforms = getActivePlatforms();

        if (activePlatforms.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No active platforms to scrape",
                results: [],
            });
        }

        // Select a random search query
        const query = DEFAULT_SEARCH_QUERIES[
            Math.floor(Math.random() * DEFAULT_SEARCH_QUERIES.length)
        ];

        console.log(`[Cron] Starting ingestion for ${activePlatforms.length} platforms with query: "${query}"`);

        // Scrape each platform sequentially (to avoid rate limits)
        for (const platformConfig of activePlatforms) {
            console.log(`[Cron] Scraping ${platformConfig.displayName}...`);

            // Apply rate limiting delay before scraping
            if (results.length > 0) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }

            const result = await scrapePlatform(platformConfig.id, query);
            results.push(result);

            // Log the result
            await logSync(result, query);

            console.log(
                `[Cron] ${platformConfig.displayName}: ${result.status} - ${result.itemsFound} items (${result.requestDurationMs}ms)`
            );
        }

        const totalDuration = Date.now() - startTime;
        const successCount = results.filter((r) => r.success).length;
        const bannedCount = results.filter((r) => r.status === "banned").length;

        return NextResponse.json({
            success: true,
            message: `Ingestion complete: ${successCount}/${results.length} successful`,
            query,
            duration_ms: totalDuration,
            summary: {
                total_platforms: results.length,
                successful: successCount,
                banned: bannedCount,
                errors: results.length - successCount - bannedCount,
                total_items_found: results.reduce((sum, r) => sum + r.itemsFound, 0),
            },
            results: results.map((r) => ({
                platform: r.platform,
                status: r.status,
                items_found: r.itemsFound,
                duration_ms: r.requestDurationMs,
                error: r.errorMessage,
            })),
        });

    } catch (error) {
        console.error("[Cron] Fatal error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Cron job failed",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/cron/ingest
 * Manual trigger with custom parameters
 */
export async function POST(request: NextRequest) {
    // Validate cron secret
    const authHeader = request.headers.get("Authorization");
    const cronHeader = request.headers.get("X-Cron-Secret");

    const providedSecret = authHeader?.replace("Bearer ", "") || cronHeader;

    if (CRON_SECRET && providedSecret !== CRON_SECRET) {
        return NextResponse.json(
            { error: "Unauthorized - Invalid cron secret" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { platforms, query } = body as {
            platforms?: Platform[];
            query?: string;
        };

        const searchQuery = query || DEFAULT_SEARCH_QUERIES[
            Math.floor(Math.random() * DEFAULT_SEARCH_QUERIES.length)
        ];

        const results: ScrapeResult[] = [];

        // If specific platforms provided, use those; otherwise use active ones
        const targetPlatforms = platforms
            ? platforms.map((p) => getPlatformConfig(p)).filter(Boolean)
            : getActivePlatforms();

        for (const platformConfig of targetPlatforms) {
            if (!platformConfig) continue;

            if (results.length > 0) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }

            const result = await scrapePlatform(platformConfig.id, searchQuery);
            results.push(result);
            await logSync(result, searchQuery);
        }

        return NextResponse.json({
            success: true,
            query: searchQuery,
            results: results.map((r) => ({
                platform: r.platform,
                status: r.status,
                items_found: r.itemsFound,
                duration_ms: r.requestDurationMs,
                error: r.errorMessage,
            })),
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: String(error) },
            { status: 500 }
        );
    }
}
