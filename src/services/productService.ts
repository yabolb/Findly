import { Product, SearchFilters, PaginatedResponse } from "@/types";
import { supabase } from "@/lib/supabase";

/**
 * Product Service - Handles all product-related operations
 */
export class ProductService {
    /**
     * Search products with filters
     */
    static async searchProducts(
        filters: SearchFilters,
        page: number = 1,
        pageSize: number = 20
    ): Promise<PaginatedResponse<Product>> {
        try {
            let query = supabase
                .from("products")
                .select("*", { count: "exact" })
                .range((page - 1) * pageSize, page * pageSize - 1);

            // Apply filters
            if (filters.query) {
                query = query.or(
                    `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
                );
            }

            if (filters.category) {
                query = query.eq("category", filters.category);
            }

            if (filters.minPrice !== undefined) {
                query = query.gte("price", filters.minPrice);
            }

            if (filters.maxPrice !== undefined) {
                query = query.lte("price", filters.maxPrice);
            }

            if (filters.condition && filters.condition.length > 0) {
                query = query.in("condition", filters.condition);
            }

            const { data, error, count } = await query;

            if (error) throw error;

            return {
                data: data as Product[],
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
