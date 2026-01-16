"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import SortDropdown from "@/components/SortDropdown";
import { Product, SearchFilters, SortOption, Category } from "@/types";
import { ProductService } from "@/services/productService";

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Initialize filters from URL params
    const [filters, setFilters] = useState<SearchFilters>({
        query: searchParams.get("q") || undefined,
        category: (searchParams.get("category") as Category) || undefined,
        sortBy: (searchParams.get("sort") as SortOption) || "relevance",
    });

    // Fetch products
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await ProductService.searchProducts(filters, currentPage, 20);
            setProducts(response.data);
            setTotalResults(response.pagination.total);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters, currentPage]);

    const handleSortChange = (sortBy: SortOption) => {
        setFilters((prev) => ({ ...prev, sortBy }));
        setCurrentPage(1);
    };

    const handleFiltersChange = (newFilters: SearchFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Bar with Sort and Filter */}
            <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {filters.query ? (
                                    <>
                                        Results for <span className="text-violet-600">"{filters.query}"</span>
                                    </>
                                ) : filters.category ? (
                                    <span className="capitalize">{filters.category.replace("-", " ")}</span>
                                ) : (
                                    "All Products"
                                )}
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">
                                {loading ? "Loading..." : `${totalResults.toLocaleString()} results found`}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Sort Dropdown */}
                            <SortDropdown value={filters.sortBy || "relevance"} onChange={handleSortChange} />

                            {/* Filter Toggle (Mobile) */}
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl font-medium shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-colors"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Filter Sidebar (Desktop always visible) */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <FilterSidebar
                            isOpen={true}
                            onClose={() => { }}
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            onApply={fetchProducts}
                        />
                    </div>

                    {/* Mobile Filter Drawer */}
                    <FilterSidebar
                        isOpen={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        onApply={fetchProducts}
                    />

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(9)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-80 bg-slate-200 animate-pulse rounded-2xl"
                                    />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🔍</div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    No results found
                                </h2>
                                <p className="text-slate-600">
                                    Try adjusting your filters or search query
                                </p>
                            </div>
                        ) : (
                            <ProductGrid products={products} />
                        )}

                        {/* Pagination */}
                        {!loading && totalResults > 20 && (
                            <div className="flex justify-center gap-2 mt-12">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-violet-600 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm text-slate-600">
                                    Page {currentPage} of {Math.ceil(totalResults / 20)}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    disabled={currentPage >= Math.ceil(totalResults / 20)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-violet-600 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
