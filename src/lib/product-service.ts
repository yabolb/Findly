import { supabase } from "./supabase";
import { Product, SearchFilters } from "@/types";
import { MOCK_PRODUCTS } from "./mock-data";

/**
 * Fetch products from Supabase with optional filters
 * Falls back to mock data if database is empty
 */
export async function fetchProducts(filters?: SearchFilters): Promise<Product[]> {
    try {
        let query = supabase.from("products").select("*");

        // Apply filters if provided
        if (filters) {
            if (filters.query) {
                // Full-text search on title and description
                query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
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

            if (filters.location) {
                query = query.ilike("location", `%${filters.location}%`);
            }

            if (filters.condition && filters.condition.length > 0) {
                query = query.in("condition", filters.condition);
            }

            if (filters.platform && filters.platform.length > 0) {
                query = query.in("platform", filters.platform);
            }

            if (filters.priceScore && filters.priceScore.length > 0) {
                query = query.in("price_score", filters.priceScore);
            }
        }

        // Order by most recent first
        query = query.order("created_at", { ascending: false });

        const { data, error } = await query;

        if (error) {
            console.error("Supabase query error:", error);
            // Fall back to mock data on error
            return applyMockFilters(MOCK_PRODUCTS, filters);
        }

        // If database is empty, use mock data
        if (!data || data.length === 0) {
            console.log("📦 Database empty - using mock data");
            return applyMockFilters(MOCK_PRODUCTS, filters);
        }

        // Convert created_at strings to Date objects
        return data.map((product) => ({
            ...product,
            created_at: new Date(product.created_at),
        }));
    } catch (error) {
        console.error("Failed to fetch products:", error);
        // Fall back to mock data on error
        return applyMockFilters(MOCK_PRODUCTS, filters);
    }
}

/**
 * Apply filters to mock data (used when database is empty or unavailable)
 */
function applyMockFilters(products: Product[], filters?: SearchFilters): Product[] {
    if (!filters) return products;

    let filtered = [...products];

    if (filters.query) {
        const query = filters.query.toLowerCase();
        filtered = filtered.filter(
            (p) =>
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
        );
    }

    if (filters.category) {
        filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
        filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.location) {
        const location = filters.location.toLowerCase();
        filtered = filtered.filter((p) => p.location.toLowerCase().includes(location));
    }

    if (filters.condition && filters.condition.length > 0) {
        filtered = filtered.filter((p) => filters.condition!.includes(p.condition));
    }

    if (filters.platform && filters.platform.length > 0) {
        filtered = filtered.filter((p) => filters.platform!.includes(p.platform));
    }

    if (filters.priceScore && filters.priceScore.length > 0) {
        filtered = filtered.filter((p) => p.price_score && filters.priceScore!.includes(p.price_score));
    }

    return filtered;
}
