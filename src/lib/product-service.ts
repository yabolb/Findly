import { supabase } from "./supabase";
import { Product, SearchFilters } from "@/types";

/**
 * Fetch products from Supabase with intelligent demo product mixing
 * Strategy: Fetch real products first, backfill with demo if insufficient
 */
export async function fetchProducts(filters?: SearchFilters): Promise<Product[]> {
    try {
        // First, try to fetch real products (is_demo = false)
        let realQuery = supabase.from("products").select("*").eq("is_demo", false);

        // Apply filters
        realQuery = applyFiltersToQuery(realQuery, filters);
        realQuery = realQuery.order("created_at", { ascending: false });

        const { data: realProducts, error: realError } = await realQuery;

        if (realError) {
            console.error("Supabase query error (real products):", realError);
        }

        const realCount = realProducts?.length || 0;
        const minProductsThreshold = 20;

        // If we have enough real products, return them
        if (realCount >= minProductsThreshold) {
            console.log(`✅ Fetched ${realCount} real products`);
            return convertProducts(realProducts || []);
        }

        // Otherwise, fetch demo products to backfill
        console.log(`📦 Only ${realCount} real products - backfilling with demo products`);

        let demoQuery = supabase.from("products").select("*").eq("is_demo", true);
        demoQuery = applyFiltersToQuery(demoQuery, filters);
        demoQuery = demoQuery.order("created_at", { ascending: false });
        demoQuery = demoQuery.limit(minProductsThreshold - realCount);

        const { data: demoProducts, error: demoError } = await demoQuery;

        if (demoError) {
            console.error("Supabase query error (demo products):", demoError);
        }

        // Combine real and demo products
        const combined = [...(realProducts || []), ...(demoProducts || [])];
        console.log(`📊 Mixed results: ${realCount} real + ${demoProducts?.length || 0} demo`);

        return convertProducts(combined);

    } catch (error) {
        console.error("Failed to fetch products:", error);

        // Last resort: fetch any products (demo or real)
        try {
            const { data } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(20);

            return convertProducts(data || []);
        } catch {
            return [];
        }
    }
}

/**
 * Apply filters to a Supabase query
 */
function applyFiltersToQuery(query: any, filters?: SearchFilters) {
    if (!filters) return query;

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

    return query;
}

/**
 * Convert database products to Product type with proper date handling
 */
function convertProducts(data: any[]): Product[] {
    return data.map((product) => ({
        ...product,
        created_at: new Date(product.created_at),
    }));
}
