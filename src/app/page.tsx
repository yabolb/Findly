"use client";

import { TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import ZeroResults from "@/components/ZeroResults";
import CategoryBar from "@/components/CategoryBar";
import Navbar from "@/components/Navbar";
import { Product, Category } from "@/types";
import { fetchProducts } from "@/lib/product-service";
import { useScrollPosition } from "@/hooks/useScrollPosition";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
    const { isScrolled } = useScrollPosition();

    // Load initial "Trending Bargains" on mount
    useEffect(() => {
        loadTrendingBargains();
    }, []);

    const loadTrendingBargains = async () => {
        setLoading(true);
        try {
            // Fetch all products and filter for bargains
            const data = await fetchProducts();
            const bargains = data.filter(product => product.price_score === "bargain");
            setProducts(bargains);
        } catch (error) {
            console.error("Failed to load trending bargains:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async (query?: string, category?: string, location?: string) => {
        setLoading(true);
        try {
            const filters: any = {};

            if (query) filters.query = query;
            if (category && category !== "all") filters.category = category as Category;
            if (location) filters.location = location;

            const data = await fetchProducts(Object.keys(filters).length > 0 ? filters : undefined);
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string, category: string, location: string) => {
        console.log("🔍 Search initiated:");
        console.log("  Query:", query);
        console.log("  Category:", category);
        console.log("  Location:", location);

        setSearchQuery(query);
        setHasSearched(true);
        setSelectedCategory(category as Category || "all");
        loadProducts(query, category, location);
    };

    const handleCategorySelect = async (category: Category | "all") => {
        setSelectedCategory(category);

        if (!hasSearched) {
            // In discovery mode, filter bargains by category
            setLoading(true);
            try {
                const data = await fetchProducts(
                    category !== "all" ? { category: category as Category } : undefined
                );
                const bargains = data.filter(product => product.price_score === "bargain");
                setProducts(bargains);
            } catch (error) {
                console.error("Failed to filter bargains:", error);
            } finally {
                setLoading(false);
            }
        } else {
            // In search mode, filter search results by category
            loadProducts(searchQuery, category !== "all" ? category : undefined);
        }
    };

    return (
        <main className="min-h-screen">
            <Navbar onSearch={handleSearch} />

            {/* Hero Section */}
            <section className="pt-24 pb-8 px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-4">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            Over 10,000 items listed this month
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-main mb-4 leading-tight">
                        Find everything.
                        <br />
                        <span className="text-primary">Second-hand.</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-base md:text-lg text-text-main/60 mb-8 max-w-2xl mx-auto font-light">
                        Discover unique treasures and sustainable finds from people in your
                        community. Buy, sell, and save the planet.
                    </p>

                    {/* Premium Search Bar */}
                    <div className={`transition-all duration-300 ${isScrolled ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
                        }`}>
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>
            </section>

            {/* Category Quick-Links Bar */}
            <CategoryBar
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
            />

            {/* Results Section - Always visible with Discovery/Search modes */}
            <section className="pb-20 px-6 lg:px-8 mt-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Title */}
                    <div className="mb-6">
                        <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-main mb-2">
                            {hasSearched
                                ? `Results for "${searchQuery}"`
                                : "🔥 Trending Bargains"
                            }
                        </h2>
                        <p className="text-slate-600">
                            {hasSearched
                                ? "Based on your search criteria"
                                : "The best deals on the market right now"
                            }
                        </p>
                    </div>

                    {loading ? (
                        // Loading State
                        <div className="text-center py-20">
                            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-slate-600">
                                {hasSearched ? "Searching for products..." : "Loading trending bargains..."}
                            </p>
                        </div>
                    ) : products.length > 0 ? (
                        // Products Grid
                        <ProductGrid products={products} />
                    ) : (
                        // Zero Results
                        <ZeroResults query={searchQuery || "bargains"} />
                    )}
                </div>
            </section>

        </main>
    );
}
