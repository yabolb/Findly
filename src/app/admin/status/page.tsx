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
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

    // Fetch catalog data
    const fetchCatalogData = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) {
                console.error("Error fetching products:", error);
                return;
            }

            const productList = data || [];
            setProducts(productList);

            // Calculate stats
            const byCategory: Record<string, number> = {};
            const byPlatform: Record<string, number> = {};
            let totalPrice = 0;

            productList.forEach((product: any) => {
                byCategory[product.category] = (byCategory[product.category] || 0) + 1;
                byPlatform[product.platform] = (byPlatform[product.platform] || 0) + 1;
                totalPrice += product.price;
            });

            setStats({
                totalProducts: productList.length,
                byCategory: byCategory as Record<Category, number>,
                byPlatform: byPlatform as Record<Platform, number>,
                avgPrice: productList.length > 0 ? Math.round(totalPrice / productList.length) : 0,
            });

            setLastRefresh(new Date());
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCatalogData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
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
                                onClick={fetchCatalogData}
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
                                Actualizar
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
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60"
                    >
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Total Productos
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">
                            {stats?.totalProducts || 0}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60"
                    >
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Categorías
                        </p>
                        <p className="text-3xl font-bold text-primary mt-1">
                            {stats ? Object.keys(stats.byCategory).length : 0}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60"
                    >
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Plataformas
                        </p>
                        <p className="text-3xl font-bold text-emerald-600 mt-1">
                            {stats ? Object.keys(stats.byPlatform).length : 0}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60"
                    >
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Precio Medio
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">
                            {stats?.avgPrice || 0}€
                        </p>
                    </motion.div>
                </div>

                {/* Category Breakdown */}
                {stats && Object.keys(stats.byCategory).length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 mb-8">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            Productos por Categoría
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(stats.byCategory).map(([category, count]) => (
                                <div key={category} className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-xs text-slate-500 truncate">
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
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 mb-8">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            Productos por Plataforma
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(stats.byPlatform).map(([platform, count]) => (
                                <div key={platform} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                                    <span className="text-2xl">{PLATFORM_LOGOS[platform as Platform] || "📦"}</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {PLATFORM_NAMES[platform as Platform] || platform}
                                        </p>
                                        <p className="text-xs text-slate-500">{count} productos</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Products Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-800">
                            Productos Recientes
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
                                {products.slice(0, 20).map((product: any) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image_url}
                                                    alt={product.title}
                                                    className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="%23e2e8f0" width="40" height="40"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="20">🎁</text></svg>';
                                                    }}
                                                />
                                                <p className="text-sm font-medium text-slate-900 truncate max-w-xs">
                                                    {product.title}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600">
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
                                            <span className="text-sm font-semibold text-slate-900">
                                                {product.price.toLocaleString('es-ES')}€
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
