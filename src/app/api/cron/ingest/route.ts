import { NextRequest, NextResponse } from "next/server";
import { SyncOrchestrator } from "@/services/sync-orchestrator";
import { Platform } from "@/types";

/**
 * AUTOMATED CRON INGESTION - ADVANCED SCRAPER
 * ===========================================
 * Uses the full scraping stack:
 * - Multi-Platform Scraper (Wallapop API, Vinted API, eBay API/Scrape, Milanuncios Scrape)
 * - Proxy Chain (WebScrapingAI → ScraperAPI → ScrapingBee)
 * - Trust Engine (price scoring, spam filtering)
 * - Deduplication Engine (URL + title similarity)
 * - Bulk upsert to Supabase
 *
 * Endpoint: POST/GET /api/cron/ingest
 * Security: Requires INGEST_SECRET_KEY for authentication
 */

// Allow up to 60 seconds (Hobby limit) or 300 seconds (Pro)
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/ingest
 * Main cron handler - automated trigger
 */
export async function GET(request: NextRequest) {
    const startTime = Date.now();

    try {
        // Validate authentication
        const authHeader = request.headers.get("Authorization");
        const ingestSecret = process.env.INGEST_SECRET_KEY;

        // Allow Vercel cron jobs (they have a specific header)
        const isVercelCron = request.headers.get("x-vercel-cron") === "true";

        const providedSecret = authHeader?.replace("Bearer ", "");

        if (!isVercelCron && ingestSecret && providedSecret !== ingestSecret) {
            return NextResponse.json(
                { success: false, error: "Unauthorized - Invalid secret" },
                { status: 401 }
            );
        }

        console.log("🚀 [Cron] Starting advanced global sync...");

        // Initialize the orchestrator
        const orchestrator = new SyncOrchestrator();

        // Smart query selection based on time
        const hour = new Date().getUTCHours();
        let query: string;

        // Morning run (6am UTC = 7am Spain): Tech & Electronics
        if (hour >= 6 && hour < 12) {
            const morningQueries = ["iPhone", "MacBook", "iPad", "Samsung Galaxy"];
            query = morningQueries[Math.floor(Math.random() * morningQueries.length)];
        }
        // Evening run (6pm UTC = 7pm Spain): Home, Fashion & Vehicles
        else if (hour >= 18 && hour < 24) {
            const eveningQueries = ["Sofá", "Nike", "Bicicleta", "Coche"];
            query = eveningQueries[Math.floor(Math.random() * eveningQueries.length)];
        }
        // Fallback
        else {
            query = "iPhone";
        }

        // STRATEGY: Pick ONE random platform to avoid Vercel Timeouts (10-60s limit)
        // We rotate platforms naturally across cron runs
        const platforms: Platform[] = ["wallapop", "vinted", "ebay", "milanuncios"];
        // Weighted selection? No, just random for now.
        const targetPlatform = platforms[Math.floor(Math.random() * platforms.length)];

        console.log(`📝 [Cron] Query: "${query}" | Platform: ${targetPlatform} (${hour}:00 UTC)`);

        // Run the sync for specific platform
        const result = await orchestrator.runGlobalSync(query, undefined, {
            platforms: [targetPlatform],
            skipBannedPlatforms: true
        });

        const duration = Date.now() - startTime;

        console.log("✅ [Cron] Global sync complete");

        return NextResponse.json({
            success: true,
            message: "Advanced scraper completed successfully",
            query,
            targetPlatform,
            duration_ms: duration,
            result,
        });

    } catch (error) {
        const duration = Date.now() - startTime;
        console.error("❌ [Cron] Fatal error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Cron job failed",
                details: error instanceof Error ? error.message : String(error),
                duration_ms: duration,
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/cron/ingest
 * Manual trigger (same logic as GET)
 */
export async function POST(request: NextRequest) {
    return GET(request);
}
