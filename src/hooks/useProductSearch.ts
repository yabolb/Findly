import { useState, useEffect } from "react";
import { Product, SearchFilters } from "@/types";
import { ProductService } from "@/services/productService";

/**
 * Custom hook for searching products
 * Handles loading states, errors, and pagination
 */
export function useProductSearch(initialFilters: SearchFilters = {}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [filters, setFilters] = useState<SearchFilters>(initialFilters);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const searchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await ProductService.searchProducts(filters, page);
                setProducts(response.data);
                setTotalPages(response.pagination.totalPages);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to search products");
            } finally {
                setLoading(false);
            }
        };

        searchProducts();
    }, [filters, page]);

    const updateFilters = (newFilters: Partial<SearchFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(1); // Reset to first page when filters change
    };

    const nextPage = () => {
        if (page < totalPages) setPage((p) => p + 1);
    };

    const prevPage = () => {
        if (page > 1) setPage((p) => p - 1);
    };

    return {
        products,
        loading,
        error,
        filters,
        updateFilters,
        page,
        totalPages,
        nextPage,
        prevPage,
    };
}
