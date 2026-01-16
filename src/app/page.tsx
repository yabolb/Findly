"use client";

import { TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import CategoryBar from "@/components/CategoryBar";
import StructuredData from "@/components/seo/StructuredData";
import Leaderboard from "@/components/ads/Leaderboard";
import { Product, Category } from "@/types";
import { fetchProducts } from "@/lib/product-service";
import { useScrollPosition } from "@/hooks/useScrollPosition";

export default function Home() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { isScrolled } = useScrollPosition();

    // Load "Trending Bargains" on mount
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

    const handleSearch = (query: string, category: string, location: string) => {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (category && category !== "all") params.set("category", category);
        if (location) params.set("location", location);
        router.push(`/search?${params.toString()}`);
    };

    const handleCategorySelect = (category: Category | "all") => {
        if (category === "all") {
            router.push("/search");
        } else {
            router.push(`/search?category=${category}`);
        }
    };

    return (
        <main className="min-h-screen">
            {/* JSON-LD Structured Data for AISO (AI Search Optimization) */}
            <StructuredData
                products={products}
                includeWebsite={true}
                includeOrganization={true}
            />

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
                selectedCategory="all"
                onCategorySelect={handleCategorySelect}
            />

            {/* Leaderboard Ad */}
            <Leaderboard />

            {/* Trending Section */}
            <section className="pb-20 px-6 lg:px-8 mt-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Title */}
                    <div className="mb-6">
                        <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-main mb-2">
                            🔥 Trending Bargains
                        </h2>
                        <p className="text-slate-600">
                            The best deals on the market right now
                        </p>
                    </div>

                    {loading ? (
                        // Loading State
                        <div className="text-center py-20">
                            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-slate-600">
                                Loading trending bargains...
                            </p>
                        </div>
                    ) : (
                        // Products Grid
                        <ProductGrid products={products} />
                    )}
                </div>
            </section>
        </main>
    );
}
