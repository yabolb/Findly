import { NextRequest, NextResponse } from "next/server";
import { SyncOrchestrator } from "@/services/sync-orchestrator";

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
 * 
 * Trigger via:
 * - Vercel Cron Jobs (automated)
 * - Manual API call (for testing)
 */

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
        // Fallback (shouldn't happen with 6,18 schedule, but just in case)
        else {
            query = "iPhone";
        }

        console.log(`📝 [Cron] Search query: "${query}" (${hour}:00 UTC)`);

        // Run the global sync
        const result = await orchestrator.runGlobalSync(query);

        const duration = Date.now() - startTime;

        console.log("✅ [Cron] Global sync complete");

        return NextResponse.json({
            success: true,
            message: "Advanced scraper completed successfully",
            query,
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
 * Manual trigger with custom parameters
 */
export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        // Validate authentication
        const authHeader = request.headers.get("Authorization");
        const ingestSecret = process.env.INGEST_SECRET_KEY;

        const providedSecret = authHeader?.replace("Bearer ", "");

        if (ingestSecret && providedSecret !== ingestSecret) {
            return NextResponse.json(
                { success: false, error: "Unauthorized - Invalid secret" },
                { status: 401 }
            );
        }

        // Parse request body for custom parameters
        const body = await request.json().catch(() => ({}));
        const query = body.query || "iPhone";
        const category = body.category; // Optional category filter

        console.log(`🚀 [Manual] Starting advanced global sync for: "${query}"`);

        // Initialize the orchestrator
        const orchestrator = new SyncOrchestrator();

        // Run the global sync
        const result = await orchestrator.runGlobalSync(query, category);

        const duration = Date.now() - startTime;

        console.log("✅ [Manual] Global sync complete");

        return NextResponse.json({
            success: true,
            message: "Advanced scraper completed successfully",
            query,
            category: category || "all",
            duration_ms: duration,
            result,
        });

    } catch (error) {
        const duration = Date.now() - startTime;
        console.error("❌ [Manual] Fatal error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Manual scrape failed",
                details: error instanceof Error ? error.message : String(error),
                duration_ms: duration,
            },
            { status: 500 }
        );
    }
}
