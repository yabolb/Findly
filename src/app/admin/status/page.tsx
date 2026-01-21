"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Product, Category, Platform, CATEGORY_LABELS } from "@/types";
import { PLATFORM_NAMES, PLATFORM_LOGOS } from "@/lib/mock-data";

// ============================================
// TYPES
// ============================================

interface CatalogStats {
    totalProducts: number;
    byCategory: Record<Category, number>;
    byPlatform: Record<Platform, number>;
    avgPrice: number;
}

// ============================================
// STAT CARD
// ============================================

function StatCard({
    label,
    value,
    suffix = "",
    color = "text-slate-900"
}: {
    label: string;
    value: string | number;
    suffix?: string;
    color?: string;
}) {
    return (
        <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                {label}
            </p>
            <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${color}`}>
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
// MAIN PAGE COMPONENT
// ============================================

export default function AdminStatusPage() {
    const [stats, setStats] = useState<CatalogStats | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [syncLogs, setSyncLogs] = useState<any[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

    // Pagination & Filtering for Sync Logs
    const [logsPage, setLogsPage] = useState(1);
    const [logsTotalPages, setLogsTotalPages] = useState(1);
    const [platformFilter, setPlatformFilter] = useState<string>("all");
    const LOGS_PER_PAGE = 10;

    // Pagination for Products
    const [productsPage, setProductsPage] = useState(1);
    const [productsTotalPages, setProductsTotalPages] = useState(1);
    const PRODUCTS_PER_PAGE = 10;

    // Fetch catalog stats (lightweight query)
    const fetchStats = async () => {
        setIsLoading(true);
        try {
            // Get total stats (using count is cheaper than fetching all rows)
            const { count: totalProducts, error: countError } = await supabase
                .from("products")
                .select("*", { count: 'exact', head: true });

            if (countError) {
                console.error("Error fetching count:", countError);
                return;
            }

            // For detailed stats (categories/platforms), we might need a different approach 
            // if the dataset is huge (e.g., using RPC or a separate stats table).
            // For now, we will fetch the last 1000 items to get a representative distribution 
            // without killing the browser or DB.
            const { data: recentProducts, error: dataError } = await supabase
                .from("products")
                .select("category, platform, price")
                .order("created_at", { ascending: false })
                .limit(1000);

            if (dataError) {
                console.error("Error fetching stats data:", dataError);
                return;
            }

            const byCategory: Record<string, number> = {};
            const byPlatform: Record<string, number> = {};
            let totalPrice = 0;

            (recentProducts || []).forEach((p: any) => {
                byCategory[p.category] = (byCategory[p.category] || 0) + 1;
                byPlatform[p.platform] = (byPlatform[p.platform] || 0) + 1;
                totalPrice += p.price;
            });

            setStats({
                totalProducts: totalProducts || 0,
                byCategory: byCategory as Record<Category, number>,
                byPlatform: byPlatform as Record<Platform, number>,
                avgPrice: recentProducts?.length ? Math.round(totalPrice / recentProducts.length) : 0,
            });

            setLastRefresh(new Date());
        } catch (error) {
            console.error("Error stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch Products with Pagination
    const fetchProducts = async () => {
        try {
            // Get count for pagination
            const { count } = await supabase
                .from("products")
                .select("*", { count: 'exact', head: true });

            setProductsTotalPages(Math.ceil((count || 0) / PRODUCTS_PER_PAGE));

            // Get paginated data
            const from = (productsPage - 1) * PRODUCTS_PER_PAGE;
            const to = from + PRODUCTS_PER_PAGE - 1;

            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false })
                .range(from, to);

            if (!error && data) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // Fetch Logs with Pagination & Filtering
    const fetchLogs = async () => {
        try {
            // Base query for count
            let countQuery = supabase
                .from("sync_logs")
                .select("*", { count: 'exact', head: true });

            if (platformFilter !== "all") {
                countQuery = countQuery.ilike('platform', `%${platformFilter}%`);
            }

            const { count } = await countQuery;
            setLogsTotalPages(Math.ceil((count || 0) / LOGS_PER_PAGE));

            // Base query for data
            const from = (logsPage - 1) * LOGS_PER_PAGE;
            const to = from + LOGS_PER_PAGE - 1;

            let dataQuery = supabase
                .from("sync_logs")
                .select("*")
                .order("created_at", { ascending: false })
                .range(from, to);

            if (platformFilter !== "all") {
                dataQuery = dataQuery.ilike('platform', `%${platformFilter}%`);
            }

            const { data: logs, error: logsError } = await dataQuery;

            if (!logsError && logs) {
                setSyncLogs(logs);
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [productsPage]);

    useEffect(() => {
        fetchLogs();
    }, [logsPage, platformFilter]);

    const handleRefresh = () => {
        fetchStats();
        fetchProducts();
        fetchLogs();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Catálogo de Regalos
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Gestión del catálogo de productos
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Refresh Button */}


                            <button
                                onClick={async () => {
                                    setIsSyncing(true);
                                    try {
                                        const res = await fetch("/api/admin/sync-awin", { method: "POST" });
                                        if (res.ok) {
                                            alert("Sync started successfully!");
                                            handleRefresh();
                                        } else {
                                            alert("Sync failed to start.");
                                        }
                                    } catch (e) {
                                        console.error(e);
                                        alert("Error triggering sync.");
                                    } finally {
                                        setIsSyncing(false);
                                    }
                                }}
                                disabled={isSyncing}
                                className="
                                    px-4 py-2 bg-indigo-600 text-white text-sm font-medium
                                    rounded-xl hover:bg-indigo-700 transition-colors
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                "
                            >
                                {isSyncing ? "Syncing..." : "Sync Awin (Beta)"}
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
                                "
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>

                    {lastRefresh && (
                        <p className="text-xs text-slate-400 mt-2" suppressHydrationWarning>
                            Última actualización: {lastRefresh.toLocaleTimeString('es-ES')}
                        </p>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* 1. High-Level KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Total Products */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total Productos</p>
                            <p className="text-3xl font-bold text-slate-900">
                                {stats?.totalProducts ? stats.totalProducts.toLocaleString() : "0"}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                            📦
                        </div>
                    </div>

                    {/* Active Platforms */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Plataformas Activas</p>
                            <p className="text-3xl font-bold text-slate-900">
                                {stats?.byPlatform ? Object.keys(stats.byPlatform).length : 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            🔗
                        </div>
                    </div>

                    {/* Avg Price */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Precio Medio</p>
                            <p className="text-3xl font-bold text-slate-900">
                                {stats?.avgPrice ? `${stats.avgPrice}€` : "0€"}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                            💰
                        </div>
                    </div>

                    {/* Last Sync */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Última Actualización</p>
                            <p className="text-lg font-bold text-slate-900 truncate">
                                {lastRefresh ? lastRefresh.toLocaleTimeString() : "-"}
                            </p>
                            <p className="text-xs text-slate-400">
                                {lastRefresh ? lastRefresh.toLocaleDateString() : ""}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                            🕒
                        </div>
                    </div>
                </div>

                {/* 2. Operational Health: Sync Status (Moved Up) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <span>🔄</span> Estado de Sincronización (Awin)
                        </h2>
                        <select
                            value={platformFilter}
                            onChange={(e) => {
                                setPlatformFilter(e.target.value);
                                setLogsPage(1); // Reset to page 1 on filter change
                            }}
                            className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all">Todas las plataformas</option>
                            <option value="awin">Awin (General)</option>
                            <option value="el corte ingles">El Corte Inglés</option>
                            <option value="wallapop">Wallapop</option>
                            <option value="vinted">Vinted</option>
                            <option value="ebay">eBay</option>
                            <option value="milanuncios">Milanuncios</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-slate-500">Fecha</th>
                                    <th className="px-4 py-3 text-left font-medium text-slate-500">Plataforma</th>
                                    <th className="px-4 py-3 text-left font-medium text-slate-500">Estado</th>
                                    <th className="px-4 py-3 text-right font-medium text-slate-500">Items</th>
                                    <th className="px-4 py-3 text-left font-medium text-slate-500">Detalles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {syncLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-slate-900 font-medium">
                                            {log.platform}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`
                                                px-2 py-1 rounded-full text-xs font-medium
                                                ${log.status === 'success' ? 'bg-green-100 text-green-700' :
                                                    log.status === 'error' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'}
                                            `}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-600">
                                            {log.items_added !== undefined ? log.items_added : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate" title={log.error_message || ''}>
                                            {log.error_message ||
                                                (log.items_found !== null ? `Found: ${log.items_found}` : 'OK')}
                                        </td>
                                    </tr>
                                ))}
                                {syncLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                            No hay registros disponibles.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Página {logsPage} de {logsTotalPages || 1}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setLogsPage(p => Math.max(1, p - 1))}
                                disabled={logsPage === 1}
                                className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setLogsPage(p => Math.min(logsTotalPages, p + 1))}
                                disabled={logsPage >= logsTotalPages}
                                className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Catalog Distribution (2 Columns) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Category Breakdown */}
                    {stats && Object.keys(stats.byCategory).length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 h-full">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                Productos por Categoría
                            </h2>
                            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                                {Object.entries(stats.byCategory)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([category, count]) => (
                                        <div key={category} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                            <p className="text-xs text-slate-500 truncate mb-1">
                                                {CATEGORY_LABELS[category as Category] || category}
                                            </p>
                                            <p className="text-xl font-bold text-slate-900">{count}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Platform Breakdown */}
                    {stats && Object.keys(stats.byPlatform).length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 h-full">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                Productos por Plataforma
                            </h2>
                            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                                {Object.entries(stats.byPlatform)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([platform, count]) => (
                                        <div key={platform} className="flex items-center gap-4 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                            <span className="text-2xl">{PLATFORM_LOGOS[platform as Platform] || "📦"}</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-900">
                                                    {PLATFORM_NAMES[platform as Platform] || platform}
                                                </p>
                                                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                                                    <div
                                                        className="bg-indigo-500 h-1.5 rounded-full"
                                                        style={{ width: `${Math.min(100, (count / (stats?.totalProducts || 1)) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-600">{count}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Detailed Data Explorer (Recent Products) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-semibold text-slate-800">
                            Explorador de Productos Recientes
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Producto</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Categoría</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Plataforma</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Precio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map((product: any) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image_url}
                                                    alt={product.title}
                                                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 shadow-sm"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="%23e2e8f0" width="40" height="40"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="20">🎁</text></svg>';
                                                    }}
                                                />
                                                <p className="text-sm font-medium text-slate-900 truncate max-w-xs" title={product.title}>
                                                    {product.title}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                {CATEGORY_LABELS[product.category as Category] || product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                                                {PLATFORM_LOGOS[product.platform as Platform] || "📦"}
                                                {PLATFORM_NAMES[product.platform as Platform] || product.platform}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-900 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
                                                {product.price.toLocaleString('es-ES')}€
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Products Pagination Controls */}
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <div className="text-sm text-slate-500">
                            Página {productsPage} de {productsTotalPages || 1}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setProductsPage(p => Math.max(1, p - 1))}
                                disabled={productsPage === 1}
                                className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setProductsPage(p => Math.min(productsTotalPages, p + 1))}
                                disabled={productsPage >= productsTotalPages}
                                className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                    {products.length === 0 && !isLoading && (
                        <div className="px-6 py-12 text-center">
                            <p className="text-slate-500">No hay productos en el catálogo</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
