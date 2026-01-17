import { supabase } from "./supabase";
import { Product, Category, BUDGET_LIMITS, BudgetRange } from "@/types";

/**
 * Fetch products from Supabase for gift recommendations
 */
export async function fetchProducts(filters?: {
    categories?: Category[];
    budget?: BudgetRange;
}): Promise<Product[]> {
    try {
        let query = supabase.from("products").select("*");

        // Apply category filter
        if (filters?.categories && filters.categories.length > 0) {
            query = query.in("category", filters.categories);
        }

        // Apply budget filter
        if (filters?.budget) {
            const limits = BUDGET_LIMITS[filters.budget];
            query = query.gte("price", limits.min).lte("price", limits.max);
        }

        query = query.order("created_at", { ascending: false }).limit(20);

        const { data, error } = await query;

        if (error) {
            console.error("Supabase query error:", error);
            return [];
        }

        return convertProducts(data || []);

    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

/**
 * Fetch products by category for gift quiz results
 */
export async function fetchGiftRecommendations(
    categories: Category[],
    budget: BudgetRange
): Promise<Product[]> {
    const limits = BUDGET_LIMITS[budget];

    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .in("category", categories)
            .gte("price", limits.min)
            .lte("price", limits.max)
            .order("created_at", { ascending: false })
            .limit(5);

        if (error) {
            console.error("Gift recommendations query error:", error);
            return [];
        }

        return convertProducts(data || []);

    } catch (error) {
        console.error("Failed to fetch gift recommendations:", error);
        return [];
    }
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
