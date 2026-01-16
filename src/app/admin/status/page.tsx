"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PLATFORMS_CONFIG,
    getActivePlatforms,
    PlatformConfig
} from "@/config/platforms";
import { Platform, SyncStatus, SyncLog } from "@/types";

// ============================================
// TYPES
// ============================================

interface PlatformHealthData {
    platform: Platform;
    config: PlatformConfig;
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

// ============================================
// HEALTH STATUS INDICATOR
// ============================================

function HealthIndicator({ status }: { status: "healthy" | "banned" | "suspicious" | "unknown" }) {
    const getIndicatorStyles = () => {
        switch (status) {
            case "healthy":
                return {
                    bg: "bg-emerald-500",
                    ring: "ring-emerald-500/30",
                    animate: false,
                    label: "Healthy",
                    description: "Last sync successful"
                };
            case "banned":
                return {
                    bg: "bg-red-500",
                    ring: "ring-red-500/30",
                    animate: true,
                    label: "Banned",
                    description: "Platform detected a block"
                };
            case "suspicious":
                return {
                    bg: "bg-amber-500",
                    ring: "ring-amber-500/30",
                    animate: false,
                    label: "Suspicious",
                    description: "No data in recent attempts"
                };
            default:
                return {
                    bg: "bg-slate-400",
                    ring: "ring-slate-400/30",
                    animate: false,
                    label: "Unknown",
                    description: "No sync data available"
                };
        }
    };

    const styles = getIndicatorStyles();

    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <span
                    className={`
                        block w-3 h-3 rounded-full ${styles.bg}
                        ring-4 ${styles.ring}
                        ${styles.animate ? "animate-pulse" : ""}
                    `}
                />
                {styles.animate && (
                    <span
                        className={`
                            absolute inset-0 w-3 h-3 rounded-full ${styles.bg}
                            animate-ping opacity-75
                        `}
                    />
                )}
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-900">{styles.label}</p>
                <p className="text-xs text-slate-500">{styles.description}</p>
            </div>
        </div>
    );
}

// ============================================
// MINI SPARKLINE CHART
// ============================================

function Sparkline({ data, color }: { data: number[]; color: string }) {
    if (data.length === 0) return null;

    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1 || 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
    }).join(" ");

    return (
        <svg
            viewBox="0 0 100 40"
            className="w-full h-10"
            preserveAspectRatio="none"
        >
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

// ============================================
// STAT CARD
// ============================================

function StatCard({
    label,
    value,
    suffix = "",
    trend
}: {
    label: string;
    value: string | number;
    suffix?: string;
    trend?: "up" | "down" | "neutral";
}) {
    return (
        <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                {label}
            </p>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">
                    {value}
                </span>
                {suffix && (
                    <span className="text-sm font-medium text-slate-500">
                        {suffix}
                    </span>
                )}
            </div>
        </div>
    );
}

// ============================================
// PLATFORM CARD
// ============================================

function PlatformCard({ data }: { data: PlatformHealthData }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const statusColors: Record<SyncStatus, string> = {
        success: "bg-emerald-100 text-emerald-700",
        error: "bg-red-100 text-red-700",
        banned: "bg-red-100 text-red-700",
        suspicious: "bg-amber-100 text-amber-700",
        timeout: "bg-slate-100 text-slate-700",
    };

    const recentStatusData = data.recentLogs
        .slice(0, 20)
        .reverse()
        .map(log => log.status === "success" ? 1 : 0);

    return (
        <motion.div
            layout
            className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div
                className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        {/* Platform Logo */}
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: data.config.primaryColor }}
                        >
                            {data.config.displayName.charAt(0)}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                {data.config.displayName}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {data.config.description}
                            </p>
                        </div>
                    </div>

                    <HealthIndicator status={data.healthStatus} />
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                    <StatCard
                        label="Success Rate"
                        value={data.stats.successRate}
                        suffix="%"
                    />
                    <StatCard
                        label="Items Contributed"
                        value={data.stats.totalItemsContributed.toLocaleString()}
                    />
                    <StatCard
                        label="Avg Response"
                        value={data.stats.avgResponseTime}
                        suffix="ms"
                    />
                </div>

                {/* Mini Sparkline */}
                {recentStatusData.length > 0 && (
                    <div className="mt-4">
                        <Sparkline
                            data={recentStatusData}
                            color={data.healthStatus === "healthy" ? "#10b981" : "#ef4444"}
                        />
                    </div>
                )}
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-slate-100"
                    >
                        <div className="p-6">
                            {/* Platform Status Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`
                                    px-3 py-1 rounded-full text-xs font-medium
                                    ${data.config.status === "active"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-slate-100 text-slate-600"
                                    }
                                `}>
                                    {data.config.status.toUpperCase()}
                                </span>
                                <span className="text-xs text-slate-500">
                                    Rate: {data.config.requestsPerMinute} req/min
                                </span>
                            </div>

                            {/* Recent Sync History */}
                            <h4 className="text-sm font-semibold text-slate-700 mb-3">
                                Recent Sync History
                            </h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {data.recentLogs.length === 0 ? (
                                    <p className="text-sm text-slate-500 italic">
                                        No sync history available
                                    </p>
                                ) : (
                                    data.recentLogs.slice(0, 10).map((log, index) => (
                                        <div
                                            key={log.id || index}
                                            className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`
                                                    px-2 py-0.5 rounded text-xs font-medium
                                                    ${statusColors[log.status]}
                                                `}>
                                                    {log.status.toUpperCase()}
                                                </span>
                                                <span className="text-sm text-slate-600">
                                                    {log.items_found} items
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-slate-500">
                                                    {formatTimeAgo(log.created_at)}
                                                </span>
                                                {log.error_code && (
                                                    <span className="ml-2 text-xs text-red-500">
                                                        HTTP {log.error_code}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* URLs */}
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <p className="text-xs text-slate-500">
                                    <span className="font-medium">Base URL:</span> {data.config.baseUrl}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    <span className="font-medium">Search Path:</span> {data.config.searchPath}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatTimeAgo(date: Date | string): string {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
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
        log => log.status === "banned" || log.status === "error"
    );
    if (allFailed && last3.length >= 3) return "banned";

    // Check for suspicious (no items in last 3 attempts)
    const noItems = last3.every(log => log.items_found === 0);
    if (noItems && last3.length >= 3) return "suspicious";

    // Otherwise healthy
    if (lastStatus === "success") return "healthy";

    return "unknown";
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function AdminStatusPage() {
    const [platformsData, setPlatformsData] = useState<PlatformHealthData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Fetch health data
    const fetchHealthData = async () => {
        try {
            const response = await fetch("/api/admin/health");
            if (!response.ok) throw new Error("Failed to fetch health data");

            const data = await response.json();
            setPlatformsData(data.platforms);
            setLastRefresh(new Date());
        } catch (error) {
            console.error("Error fetching health data:", error);
            // Use mock data for now
            const mockData = generateMockData();
            setPlatformsData(mockData);
            setLastRefresh(new Date());
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHealthData();

        // Auto refresh every 30 seconds
        let interval: NodeJS.Timeout;
        if (autoRefresh) {
            interval = setInterval(fetchHealthData, 30000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh]);

    // Generate mock data when API isn't available
    const generateMockData = (): PlatformHealthData[] => {
        return Object.values(PLATFORMS_CONFIG).map((config) => {
            const mockLogs: SyncLog[] = Array.from({ length: 10 }, (_, i) => ({
                id: `mock-${config.id}-${i}`,
                platform: config.id,
                status: Math.random() > 0.2 ? "success" : "error" as SyncStatus,
                error_code: null,
                error_message: null,
                items_found: Math.floor(Math.random() * 50),
                items_inserted: Math.floor(Math.random() * 30),
                items_updated: Math.floor(Math.random() * 10),
                search_query: null,
                request_duration_ms: Math.floor(Math.random() * 2000) + 500,
                ban_reason: null,
                created_at: new Date(Date.now() - i * 3600000),
            }));

            const successCount = mockLogs.filter(l => l.status === "success").length;
            const healthStatus = determineHealthStatus(
                mockLogs[0]?.status || null,
                mockLogs
            );

            return {
                platform: config.id,
                config,
                lastSync: mockLogs[0] || null,
                recentLogs: mockLogs,
                stats: {
                    totalSyncs: mockLogs.length,
                    successRate: Math.round((successCount / mockLogs.length) * 100),
                    totalItemsContributed: mockLogs.reduce((sum, l) => sum + l.items_found, 0),
                    avgResponseTime: Math.round(
                        mockLogs.reduce((sum, l) => sum + (l.request_duration_ms || 0), 0) / mockLogs.length
                    ),
                },
                healthStatus,
            };
        });
    };

    // Calculate overall stats
    const overallStats = {
        totalPlatforms: platformsData.length,
        activePlatforms: platformsData.filter(p => p.config.status === "active").length,
        healthyPlatforms: platformsData.filter(p => p.healthStatus === "healthy").length,
        bannedPlatforms: platformsData.filter(p => p.healthStatus === "banned").length,
        totalItems: platformsData.reduce((sum, p) => sum + p.stats.totalItemsContributed, 0),
        avgSuccessRate: Math.round(
            platformsData.reduce((sum, p) => sum + p.stats.successRate, 0) /
            (platformsData.length || 1)
        ),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Health Center
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Scraper monitoring and platform status
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Auto Refresh Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-sm text-slate-600">Auto-refresh</span>
                                <div
                                    className={`
                                        relative w-10 h-6 rounded-full transition-colors
                                        ${autoRefresh ? "bg-violet-600" : "bg-slate-300"}
                                    `}
                                    onClick={() => setAutoRefresh(!autoRefresh)}
                                >
                                    <span
                                        className={`
                                            absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm
                                            transition-transform duration-200
                                            ${autoRefresh ? "translate-x-5" : "translate-x-1"}
                                        `}
                                    />
                                </div>
                            </label>

                            {/* Refresh Button */}
                            <button
                                onClick={fetchHealthData}
                                disabled={isLoading}
                                className="
                                    px-4 py-2 bg-slate-900 text-white text-sm font-medium
                                    rounded-xl hover:bg-slate-800 transition-colors
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    flex items-center gap-2
                                "
                            >
                                <svg
                                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Refresh
                            </button>

                            {/* Logout Button */}
                            <button
                                onClick={async () => {
                                    await fetch("/api/admin/logout", { method: "POST" });
                                    window.location.href = "/admin/login";
                                }}
                                className="
                                    px-4 py-2 bg-red-600 text-white text-sm font-medium
                                    rounded-xl hover:bg-red-700 transition-colors
                                    flex items-center gap-2
                                "
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Last Refresh */}
                    {lastRefresh && (
                        <p className="text-xs text-slate-400 mt-2" suppressHydrationWarning>
                            Last updated: {lastRefresh.toLocaleTimeString()}
                        </p>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Overall Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60"
                    >
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Total Platforms
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">
                            {overallStats.totalPlatforms}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60"
                    >
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Active
                        </p>
                        <p className="text-3xl font-bold text-emerald-600 mt-1">
                            {overallStats.activePlatforms}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60"
                    >
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Healthy
                        </p>
                        <p className="text-3xl font-bold text-emerald-600 mt-1">
                            {overallStats.healthyPlatforms}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60"
                    >
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Banned
                        </p>
                        <p className={`text-3xl font-bold mt-1 ${overallStats.bannedPlatforms > 0 ? "text-red-600" : "text-slate-400"
                            }`}>
                            {overallStats.bannedPlatforms}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60"
                    >
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Total Items
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">
                            {overallStats.totalItems.toLocaleString()}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60"
                    >
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Avg Success
                        </p>
                        <p className="text-3xl font-bold text-violet-600 mt-1">
                            {overallStats.avgSuccessRate}%
                        </p>
                    </motion.div>
                </div>

                {/* RED PULSE ALERT - Shows when any platform is banned */}
                {platformsData.some(p => p.healthStatus === "banned") && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-6 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg relative overflow-hidden"
                    >
                        {/* Animated pulse background */}
                        <div className="absolute inset-0 bg-red-500 animate-pulse opacity-20" />

                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white">
                                    🚨 Platform Ban Detected
                                </h3>
                                <p className="text-red-100 mt-1">
                                    {platformsData.filter(p => p.healthStatus === "banned").map(p => p.config.displayName).join(", ")} returning 403/429 errors.
                                    Proxy may be blocked. Check residential proxy configuration.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={fetchHealthData}
                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Platform Status Table */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">
                        Worker Status Table
                    </h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Platform</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Last Sync</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Items Added</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">HTTP Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Health</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {platformsData.map((data) => (
                                    <tr
                                        key={data.platform}
                                        className={`hover:bg-slate-50 transition-colors ${data.healthStatus === "banned" ? "bg-red-50/50" : ""
                                            }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                                                    style={{ backgroundColor: data.config.primaryColor }}
                                                >
                                                    {data.config.displayName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{data.config.displayName}</p>
                                                    <p className="text-xs text-slate-500">{data.config.baseUrl}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-900" suppressHydrationWarning>
                                                {data.lastSync ? formatTimeAgo(data.lastSync.created_at) : "Never"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {data.stats.avgResponseTime}ms avg
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-lg font-bold text-slate-900">
                                                {data.stats.totalItemsContributed.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {data.lastSync?.items_inserted || 0} last sync
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {data.lastSync?.error_code ? (
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${data.lastSync.error_code === 403 || data.lastSync.error_code === 429
                                                        ? "bg-red-100 text-red-700"
                                                        : data.lastSync.error_code >= 500
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-slate-100 text-slate-700"
                                                    }`}>
                                                    {data.lastSync.error_code}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                    200
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${data.healthStatus === "healthy" ? "bg-emerald-500" :
                                                        data.healthStatus === "banned" ? "bg-red-500 animate-pulse" :
                                                            data.healthStatus === "suspicious" ? "bg-amber-500" :
                                                                "bg-slate-400"
                                                    }`} />
                                                <span className={`text-sm font-medium ${data.healthStatus === "healthy" ? "text-emerald-700" :
                                                        data.healthStatus === "banned" ? "text-red-700" :
                                                            data.healthStatus === "suspicious" ? "text-amber-700" :
                                                                "text-slate-600"
                                                    }`}>
                                                    {data.healthStatus.charAt(0).toUpperCase() + data.healthStatus.slice(1)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Platform Cards */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Platform Details
                    </h2>

                    {isLoading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl h-64 animate-pulse border border-slate-200/60"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {platformsData.map((data) => (
                                <PlatformCard key={data.platform} data={data} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="mt-12 p-6 bg-slate-50 rounded-2xl">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">
                        Health Status Legend
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-sm text-slate-600">
                                Healthy - Last sync successful
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-sm text-slate-600">
                                Banned - 403/429 detected
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-500" />
                            <span className="text-sm text-slate-600">
                                Suspicious - No data in 3 attempts
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-slate-400" />
                            <span className="text-sm text-slate-600">
                                Unknown - No sync data
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
