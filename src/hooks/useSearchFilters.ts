"use client";

import { useState, useCallback } from "react";
import { SearchFilters, SortOption, Category, ProductCondition } from "@/types";

/**
 * Custom hook to manage search filters state
 * Provides a clean API for updating filters across components
 */
export function useSearchFilters(initialFilters?: Partial<SearchFilters>) {
    const [filters, setFilters] = useState<SearchFilters>({
        sortBy: "relevance",
        ...initialFilters,
    });

    const updateQuery = useCallback((query: string) => {
        setFilters((prev) => ({ ...prev, query: query || undefined }));
    }, []);

    const updateCategory = useCallback((category: Category | undefined) => {
        setFilters((prev) => ({ ...prev, category }));
    }, []);

    const updatePriceRange = useCallback((minPrice?: number, maxPrice?: number) => {
        setFilters((prev) => ({
            ...prev,
            minPrice: minPrice && minPrice > 0 ? minPrice : undefined,
            maxPrice: maxPrice && maxPrice > 0 ? maxPrice : undefined,
        }));
    }, []);

    const updateLocation = useCallback((location: string) => {
        setFilters((prev) => ({ ...prev, location: location || undefined }));
    }, []);

    const updateConditions = useCallback((conditions: ProductCondition[]) => {
        setFilters((prev) => ({
            ...prev,
            condition: conditions.length > 0 ? conditions : undefined,
        }));
    }, []);

    const updateSortBy = useCallback((sortBy: SortOption) => {
        setFilters((prev) => ({ ...prev, sortBy }));
    }, []);

    const updateDateFilter = useCallback((dateFilter: "24h" | "week" | "month" | "all") => {
        setFilters((prev) => ({
            ...prev,
            dateFilter: dateFilter === "all" ? undefined : dateFilter,
        }));
    }, []);

    const setAllFilters = useCallback((newFilters: SearchFilters) => {
        setFilters(newFilters);
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            query: filters.query,
            category: filters.category,
            sortBy: "relevance",
        });
    }, [filters.query, filters.category]);

    const hasActiveFilters = useCallback(() => {
        return !!(
            filters.minPrice ||
            filters.maxPrice ||
            filters.location ||
            filters.condition?.length ||
            filters.platform?.length ||
            filters.priceScore?.length ||
            filters.dateFilter
        );
    }, [filters]);

    return {
        filters,
        updateQuery,
        updateCategory,
        updatePriceRange,
        updateLocation,
        updateConditions,
        updateSortBy,
        updateDateFilter,
        setAllFilters,
        clearFilters,
        hasActiveFilters: hasActiveFilters(),
    };
}
