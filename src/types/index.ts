// Product from marketplace listings
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    condition: "new" | "like-new" | "good" | "fair";
    category: string;
    images: string[];
    location: Location;
    seller: Seller;
    source: "wallapop" | "vinted" | "milanuncios" | "manual";
    externalUrl?: string;
    createdAt: Date;
    updatedAt: Date;
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

// Category structure
export interface Category {
    id: string;
    name: string;
    slug: string;
    icon?: string;
    parentId?: string;
    subcategories?: Category[];
}

// Search filters
export interface SearchFilters {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: Product["condition"][];
    location?: string;
    radius?: number; // in kilometers
    source?: Product["source"][];
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
