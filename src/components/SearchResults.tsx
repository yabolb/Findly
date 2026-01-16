/**
 * SEARCH RESULTS PAGE COMPONENT
 * PRD Section 3, 4, 7, 8: Search, Filters, Monetization, SEO
 * 
 * Complete search experience with:
 * - Leaderboard ad (above-the-fold)
 * - Filter sidebar
 * - Product grid with in-feed ads
 * - Apple-style pagination
 * - Structured data for AISO
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import SortDropdown from "@/components/SortDropdown";
import Leaderboard from "@/components/ads/Leaderboard";
import Pagination from "@/components/ui/Pagination";
import StructuredData from "@/components/seo/StructuredData";
import { Product, SearchFilters, SortOption, Category } from "@/types";
import { ProductService } from "@/services/productService";

const ITEMS_PER_PAGE = 20;

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const gridRef = useRef<HTMLDivElement>(null);

    // Initialize filters from URL params
    const [filters, setFilters] = useState<SearchFilters>({
        query: searchParams.get("q") || undefined,
        category: (searchParams.get("category") as Category) || undefined,
        sortBy: (searchParams.get("sort") as SortOption) || "relevance",
    });

    // Fetch products with pagination
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await ProductService.searchProducts(
                filters,
                currentPage,
                ITEMS_PER_PAGE
            );
            setProducts(response.data);
            setTotalResults(response.pagination.total);
            setTotalPages(response.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters, currentPage]);

    // Update filters from URL when params change
    useEffect(() => {
        setFilters({
            query: searchParams.get("q") || undefined,
            category: (searchParams.get("category") as Category) || undefined,
            sortBy: (searchParams.get("sort") as SortOption) || filters.sortBy || "relevance",
        });
        setCurrentPage(1);
    }, [searchParams]);

    const handleSortChange = (sortBy: SortOption) => {
        setFilters((prev) => ({ ...prev, sortBy }));
        setCurrentPage(1);
    };

    const handleFiltersChange = (newFilters: SearchFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            {/* JSON-LD Structured Data for AISO (AI Search Optimization) */}
            {!loading && products.length > 0 && (
                <StructuredData
                    products={products}
                    query={filters.query}
                    category={filters.category}
                />
            )}

            {/* Top Bar with Sort and Filter */}
            <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
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
                            <p className="text-sm text-slate-600 mt-0.5">
                                {loading ? "Loading..." : `${totalResults.toLocaleString()} results found`}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Sort Dropdown */}
                            <SortDropdown value={filters.sortBy || "relevance"} onChange={handleSortChange} />

                            {/* Filter Toggle (Mobile) */}
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-violet-600 text-white rounded-xl font-medium shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-colors"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                <span className="hidden sm:inline">Filters</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard Ad - Above the Fold */}
            <Leaderboard className="border-b border-slate-100" />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex gap-6 lg:gap-8" ref={gridRef}>
                    {/* Filter Sidebar (Desktop always visible) */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-44">
                            <FilterSidebar
                                isOpen={true}
                                onClose={() => { }}
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                onApply={fetchProducts}
                            />
                        </div>
                    </div>

                    {/* Mobile Filter Drawer */}
                    <FilterSidebar
                        isOpen={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        onApply={fetchProducts}
                    />

                    {/* Product Grid + Pagination */}
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            /* Loading Skeleton */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {[...Array(9)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="aspect-[3/4] bg-slate-200 animate-pulse rounded-3xl"
                                    />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            /* No Results */
                            <div className="text-center py-16 sm:py-20">
                                <div className="text-6xl mb-4">🔍</div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                                    No results found
                                </h2>
                                <p className="text-slate-600 max-w-md mx-auto">
                                    Try adjusting your filters or search for something else
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Product Grid with In-feed Ads */}
                                <ProductGrid
                                    products={products}
                                    showAds={true}
                                    hideResultsCount={true}
                                    gridId="search-results-grid"
                                />

                                {/* Apple-style Pagination */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    scrollToId="search-results-grid"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
