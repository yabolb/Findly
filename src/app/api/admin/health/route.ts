import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { PLATFORMS_CONFIG } from "@/config/platforms";
import { Platform, SyncLog, SyncStatus } from "@/types";

/**
 * ADMIN HEALTH API
 * ================
 * Returns health statistics for all platforms
 * Used by the Health Center dashboard
 */

interface PlatformHealthResponse {
    platform: Platform;
    config: typeof PLATFORMS_CONFIG[keyof typeof PLATFORMS_CONFIG];
    lastSync: SyncLog | null;
    recentLogs: SyncLog[];
    stats: {
        totalSyncs: number;
        successRate: number;
        totalItemsContributed: number;
        avgResponseTime: number;
    };
    healthStatus: "healthy" | "banned" | "suspicious" | "unknown";
}

function determineHealthStatus(
    lastStatus: SyncStatus | null,
    recentLogs: SyncLog[]
): "healthy" | "banned" | "suspicious" | "unknown" {
    if (!lastStatus || recentLogs.length === 0) return "unknown";

    // Check for banned
    if (lastStatus === "banned") return "banned";

    // Check for 3 consecutive failures
    const last3 = recentLogs.slice(0, 3);
    const allFailed = last3.every(
        (log) => log.status === "banned" || log.status === "error"
    );
    if (allFailed && last3.length >= 3) return "banned";

    // Check for suspicious (no items in last 3 attempts)
    const noItems = last3.every((log) => log.items_found === 0);
    if (noItems && last3.length >= 3) return "suspicious";

    // Otherwise healthy
    if (lastStatus === "success") return "healthy";

    return "unknown";
}

export async function GET(request: NextRequest) {
    try {
        const platforms: PlatformHealthResponse[] = [];

        for (const [platformId, config] of Object.entries(PLATFORMS_CONFIG)) {
            // Fetch recent logs for this platform
            const { data: logs, error } = await supabaseAdmin
                .from("sync_logs")
                .select("*")
                .eq("platform", platformId)
                .order("created_at", { ascending: false })
                .limit(20);

            if (error) {
                console.error(`Error fetching logs for ${platformId}:`, error.message);
            }

            const recentLogs = (logs || []) as SyncLog[];
            const lastSync = recentLogs[0] || null;

            // Calculate stats
            const successCount = recentLogs.filter((l) => l.status === "success").length;
            const totalItems = recentLogs.reduce((sum, l) => sum + (l.items_found || 0), 0);
            const avgResponse = recentLogs.length > 0
                ? Math.round(
                    recentLogs.reduce((sum, l) => sum + (l.request_duration_ms || 0), 0) /
                    recentLogs.length
                )
                : 0;

            const healthStatus = determineHealthStatus(
                lastSync?.status as SyncStatus || null,
                recentLogs
            );

            platforms.push({
                platform: platformId as Platform,
                config: config,
                lastSync,
                recentLogs,
                stats: {
                    totalSyncs: recentLogs.length,
                    successRate: recentLogs.length > 0
                        ? Math.round((successCount / recentLogs.length) * 100)
                        : 0,
                    totalItemsContributed: totalItems,
                    avgResponseTime: avgResponse,
                },
                healthStatus,
            });
        }

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            platforms,
        });
    } catch (error) {
        console.error("Admin health API error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch health data" },
            { status: 500 }
        );
    }
}
