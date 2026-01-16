import { Product, SearchFilters, PaginatedResponse, SortOption } from "@/types";
import { supabase } from "@/lib/supabase";
import { filterTrustedProducts, getPriceScoreForProduct } from "./trust-engine";

/**
 * Product Service - Handles all product-related operations
 * Enhanced with PRD Section 4.3 filtering + Trust Engine integration
 */
export class ProductService {
    /**
     * Search products with advanced filters and sorting
     * PRD Section 4.2 & 4.3
     */
    static async searchProducts(
        filters: SearchFilters,
        page: number = 1,
        pageSize: number = 20
    ): Promise<PaginatedResponse<Product>> {
        try {
            let query = supabase
                .from("products")
                .select("*", { count: "exact" });

            // ===== FULL-TEXT SEARCH =====
            if (filters.query) {
                // Use full-text search on title and description
                query = query.or(
                    `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
                );
            }

            // ===== CATEGORY FILTER =====
            if (filters.category) {
                query = query.eq("category", filters.category);
            }

            // ===== PRICE RANGE FILTER =====
            if (filters.minPrice !== undefined && filters.minPrice > 0) {
                query = query.gte("price", filters.minPrice);
            }

            if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
                query = query.lte("price", filters.maxPrice);
            }

            // ===== CONDITION FILTER =====
            if (filters.condition && filters.condition.length > 0) {
                query = query.in("condition", filters.condition);
            }

            // ===== LOCATION FILTER =====
            if (filters.location) {
                query = query.ilike("location", `%${filters.location}%`);
            }

            // ===== PLATFORM FILTER =====
            if (filters.platform && filters.platform.length > 0) {
                query = query.in("platform", filters.platform);
            }

            // ===== PRICE SCORE FILTER =====
            if (filters.priceScore && filters.priceScore.length > 0) {
                query = query.in("price_score", filters.priceScore);
            }

            // ===== DATE FILTER =====
            if (filters.dateFilter && filters.dateFilter !== "all") {
                const now = new Date();
                let startDate = new Date();

                switch (filters.dateFilter) {
                    case "24h":
                        startDate.setHours(now.getHours() - 24);
                        break;
                    case "week":
                        startDate.setDate(now.getDate() - 7);
                        break;
                    case "month":
                        startDate.setMonth(now.getMonth() - 1);
                        break;
                }

                query = query.gte("created_at", startDate.toISOString());
            }

            // ===== SORTING =====
            const sortBy = filters.sortBy || "relevance";
            switch (sortBy) {
                case "price_asc":
                    query = query.order("price", { ascending: true });
                    break;
                case "price_desc":
                    query = query.order("price", { ascending: false });
                    break;
                case "date_desc":
                    query = query.order("created_at", { ascending: false });
                    break;
                case "relevance":
                default:
                    // For relevance, prioritize:
                    // 1. Bargains (price_score = 'bargain')
                    // 2. Recent posts (created_at desc)
                    if (filters.query) {
                        // If searching, prioritize by created_at
                        query = query.order("created_at", { ascending: false });
                    } else {
                        // For browsing, show bargains first
                        query = query.order("created_at", { ascending: false });
                    }
                    break;
            }

            // ===== PAGINATION =====
            query = query.range((page - 1) * pageSize, page * pageSize - 1);

            const { data, error, count } = await query;

            if (error) {
                console.error("Supabase query error:", error);
                throw error;
            }

            // Apply Trust Engine filtering (client-side for now)
            const products = data as Product[];
            const trustedProducts = filterTrustedProducts(products);

            return {
                data: trustedProducts,
                pagination: {
                    page,
                    pageSize,
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / pageSize),
                },
            };
        } catch (error) {
            console.error("Error searching products:", error);
            throw error;
        }
    }

    /**
     * Get product by ID
     */
    static async getProductById(id: string): Promise<Product | null> {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            return data as Product;
        } catch (error) {
            console.error("Error fetching product:", error);
            return null;
        }
    }

    /**
     * Get featured products
     */
    static async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data as Product[];
        } catch (error) {
            console.error("Error fetching featured products:", error);
            return [];
        }
    }
}
