// ========================================
// FINDLY - TYPE DEFINITIONS (PRD-Aligned)
// ========================================

// 13 Core Categories from PRD
export type Category =
    | "cars-motorcycles"
    | "fashion"
    | "real-estate"
    | "tech-electronics"
    | "sports-leisure"
    | "home-garden"
    | "movies-books-music"
    | "baby-kids"
    | "collectibles-art"
    | "diy"
    | "agriculture-industrial"
    | "services"
    | "others";

// Product Condition
export type ProductCondition = "new" | "like-new" | "good" | "fair" | "poor";

// Platform Sources
export type Platform = "wallapop" | "vinted" | "ebay" | "milanuncios";

// Price Score (Trust Engine)
export type PriceScore = "bargain" | "fair" | "expensive" | null;

// ============================================
// SYNC LOGS (Scraper Health Monitoring)
// ============================================

// Sync status types
export type SyncStatus = "success" | "error" | "banned" | "suspicious" | "timeout";

// Sync log entry
export interface SyncLog {
    id: string;
    platform: Platform;
    status: SyncStatus;
    error_code: number | null;
    error_message: string | null;
    items_found: number;
    items_inserted: number;
    items_updated: number;
    search_query: string | null;
    request_duration_ms: number | null;
    ban_reason: string | null;
    created_at: Date;
}

// Platform health statistics
export interface PlatformHealth {
    platform: Platform;
    totalSyncs: number;
    successCount: number;
    errorCount: number;
    bannedCount: number;
    suspiciousCount: number;
    successRate: number;
    totalItemsFound: number;
    lastSyncAt: Date | null;
    lastStatus: SyncStatus | null;
    isHealthy: boolean;
}

// Product from marketplace listings (PRD Database Schema)
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string; // default 'EUR'
    image_url: string;
    source_url: string; // unique external URL
    platform: Platform;
    category: Category;
    location: string;
    condition: ProductCondition;
    phash: string | null; // Perceptual hash for de-duplication
    price_score: PriceScore; // Bargain/Fair/Expensive indicator
    created_at: Date;
}

// Geographic location
export interface Location {
    city: string;
    region?: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

// User/Seller information
export interface Seller {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
    totalSales?: number;
    verified: boolean;
}

// Category structure (for navigation)
export interface CategoryItem {
    id: Category;
    name: string;
    slug: string;
    icon?: string;
    parentId?: string;
    subcategories?: CategoryItem[];
}

// Sort options for search results
export type SortOption = "relevance" | "price_asc" | "price_desc" | "date_desc";

// Search filters
export interface SearchFilters {
    query?: string;
    category?: Category;
    minPrice?: number;
    maxPrice?: number;
    condition?: ProductCondition[];
    location?: string;
    radius?: number; // in kilometers
    platform?: Platform[];
    priceScore?: PriceScore[];
    dateFilter?: "24h" | "week" | "month" | "all";
    sortBy?: SortOption;
}

// Paginated response
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

// Category Mapping (for display)
export const CATEGORY_LABELS: Record<Category, string> = {
    "cars-motorcycles": "Cars & Motorcycles",
    fashion: "Fashion",
    "real-estate": "Real Estate",
    "tech-electronics": "Tech & Electronics",
    "sports-leisure": "Sports & Leisure",
    "home-garden": "Home & Garden",
    "movies-books-music": "Movies, Books & Music",
    "baby-kids": "Baby & Kids",
    "collectibles-art": "Collectibles & Art",
    diy: "DIY",
    "agriculture-industrial": "Agriculture & Industrial",
    services: "Services",
    others: "Others",
};
