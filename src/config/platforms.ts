/**
 * CENTRALIZED PLATFORM CONFIGURATION
 * ===================================
 * This is the SINGLE SOURCE OF TRUTH for all scraped platforms.
 * 
 * PRD Section 5.2: Data Ingestion - Resilient Scraping
 * Senior Reliability & Data Engineer Configuration
 */

import { Platform, Category } from "@/types";

// ============================================
// PLATFORM STATUS ENUM
// ============================================
export type PlatformStatus = "active" | "inactive" | "maintenance";

// ============================================
// SELECTOR CONFIGURATION
// ============================================
export interface PlatformSelectors {
    // Product listing selectors
    productContainer: string;           // Container for each product item
    productTitle: string;               // Title selector within product
    productPrice: string;               // Price selector within product
    productImage: string;               // Image selector within product
    productLink: string;                // Link selector within product
    productLocation?: string;           // Location selector (optional)
    productCondition?: string;          // Condition selector (optional)

    // Pagination
    nextPage?: string;                  // Next page button/link
    totalResults?: string;              // Total results count

    // Anti-scraping detection
    captchaIndicator?: string;          // Captcha page indicator
    accessDeniedIndicator?: string;     // Access denied page indicator
    rateLimitIndicator?: string;        // Rate limit page indicator
}

// ============================================
// PLATFORM MAPPING RULES
// ============================================
export interface PlatformMappingRules {
    // Price parsing
    priceRegex: RegExp;                 // Regex to extract price from text
    currencyDefault: string;            // Default currency code

    // Category mapping from platform categories
    categoryMapping: Record<string, Category>;

    // Condition mapping from platform conditions
    conditionMapping: Record<string, string>;

    // Platform-specific transformations
    normalizePrice?: (raw: string) => number;
    normalizeTitle?: (raw: string) => string;
}

// ============================================
// PLATFORM CONFIGURATION INTERFACE
// ============================================
export interface PlatformConfig {
    id: Platform;
    name: string;
    displayName: string;
    description: string;

    // URLs
    baseUrl: string;
    searchPath: string;                 // Search URL template, use {query} for search term
    apiEndpoint?: string;               // Optional API endpoint if available

    // Status
    status: PlatformStatus;

    // Rate Limiting
    requestsPerMinute: number;
    delayBetweenRequests: number;       // in milliseconds

    // Request Configuration
    headers: Record<string, string>;
    userAgentRotation: boolean;
    proxyRequired: boolean;

    // Selectors & Mapping
    selectors: PlatformSelectors;
    mappingRules: PlatformMappingRules;

    // Detection patterns for ban/rate limiting
    banPatterns: {
        statusCodes: number[];          // HTTP status codes indicating ban
        bodyPatterns: string[];         // Text patterns in response body
    };

    // Logo/Icon for dashboard
    logo: string;
    primaryColor: string;
}

// ============================================
// PLATFORMS CONFIGURATION
// ============================================
export const PLATFORMS_CONFIG: Record<Platform, PlatformConfig> = {
    wallapop: {
        id: "wallapop",
        name: "wallapop",
        displayName: "Wallapop",
        description: "Spain's #1 marketplace for second-hand items",

        // URLs
        baseUrl: "https://es.wallapop.com",
        searchPath: "/app/search?keywords={query}",
        apiEndpoint: "https://api.wallapop.com/api/v3/general/search",

        // Status
        status: "active",

        // Rate Limiting
        requestsPerMinute: 30,
        delayBetweenRequests: 2000,

        // Request Configuration
        headers: {
            "Accept": "application/json, text/html",
            "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
            "Cache-Control": "no-cache",
            "X-DeviceOS": "0",
        },
        userAgentRotation: true,
        proxyRequired: true,

        // Selectors
        selectors: {
            productContainer: "[data-testid='ItemCard']",
            productTitle: "[data-testid='ItemCard__title']",
            productPrice: "[data-testid='ItemCard__price']",
            productImage: "img.ItemCard__image",
            productLink: "a[href*='/item/']",
            productLocation: "[data-testid='ItemCard__location']",
            captchaIndicator: ".captcha-container, #captcha",
            accessDeniedIndicator: "Access Denied",
            rateLimitIndicator: "Too Many Requests",
        },

        // Mapping Rules
        mappingRules: {
            priceRegex: /(\d+(?:[.,]\d{1,2})?)/,
            currencyDefault: "EUR",
            categoryMapping: {
                "coches": "cars-motorcycles",
                "motos": "cars-motorcycles",
                "moda": "fashion",
                "inmobiliaria": "real-estate",
                "tecnologia": "tech-electronics",
                "electronica": "tech-electronics",
                "deportes": "sports-leisure",
                "hogar": "home-garden",
                "libros": "movies-books-music",
                "ninos": "baby-kids",
                "arte": "collectibles-art",
                "bricolaje": "diy",
                "agricultura": "agriculture-industrial",
                "servicios": "services",
            },
            conditionMapping: {
                "nuevo": "new",
                "como_nuevo": "like-new",
                "buen_estado": "good",
                "aceptable": "fair",
                "usado": "poor",
            },
        },

        // Ban Detection
        banPatterns: {
            statusCodes: [403, 429, 503],
            bodyPatterns: [
                "Captcha",
                "Access Denied",
                "blocked",
                "rate limit",
                "Too Many Requests",
                "suspicious activity",
            ],
        },

        // Branding
        logo: "/platforms/wallapop.svg",
        primaryColor: "#00D6BC",
    },

    vinted: {
        id: "vinted",
        name: "vinted",
        displayName: "Vinted",
        description: "Europe's largest fashion marketplace",

        // URLs
        baseUrl: "https://www.vinted.es",
        searchPath: "/catalog?search_text={query}",

        // Status
        status: "active",

        // Rate Limiting
        requestsPerMinute: 20,
        delayBetweenRequests: 3000,

        // Request Configuration
        headers: {
            "Accept": "application/json, text/html",
            "Accept-Language": "es-ES,es;q=0.9",
        },
        userAgentRotation: true,
        proxyRequired: true,

        // Selectors
        selectors: {
            productContainer: "[data-testid='grid-item']",
            productTitle: ".ItemBox_title",
            productPrice: ".ItemBox_price",
            productImage: ".ItemBox_image img",
            productLink: "a.ItemBox_overlay",
            captchaIndicator: ".cf-browser-verification",
            accessDeniedIndicator: "Access Denied",
        },

        // Mapping Rules
        mappingRules: {
            priceRegex: /(\d+(?:[.,]\d{1,2})?)/,
            currencyDefault: "EUR",
            categoryMapping: {
                "ropa-mujer": "fashion",
                "ropa-hombre": "fashion",
                "ninos": "baby-kids",
                "hogar": "home-garden",
                "entretenimiento": "movies-books-music",
                "mascotas": "others",
            },
            conditionMapping: {
                "nuevo_con_etiqueta": "new",
                "nuevo_sin_etiqueta": "like-new",
                "muy_bueno": "good",
                "bueno": "fair",
                "satisfactorio": "poor",
            },
        },

        // Ban Detection
        banPatterns: {
            statusCodes: [403, 429, 503],
            bodyPatterns: [
                "Captcha",
                "Access Denied",
                "Cloudflare",
                "rate limit",
                "verify you are human",
            ],
        },

        // Branding
        logo: "/platforms/vinted.svg",
        primaryColor: "#09B1BA",
    },

    ebay: {
        id: "ebay",
        name: "ebay",
        displayName: "eBay",
        description: "Global marketplace for new and used items",

        // URLs
        baseUrl: "https://www.ebay.es",
        searchPath: "/sch/i.html?_nkw={query}",

        // Status
        status: "active",

        // Rate Limiting
        requestsPerMinute: 40,
        delayBetweenRequests: 1500,

        // Request Configuration
        headers: {
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        },
        userAgentRotation: true,
        proxyRequired: false,

        // Selectors
        selectors: {
            productContainer: ".s-item",
            productTitle: ".s-item__title",
            productPrice: ".s-item__price",
            productImage: ".s-item__image img",
            productLink: ".s-item__link",
            productLocation: ".s-item__location",
            totalResults: ".srp-controls__count-heading",
            nextPage: ".pagination__next",
            captchaIndicator: "#captcha",
            accessDeniedIndicator: "Access Denied",
        },

        // Mapping Rules
        mappingRules: {
            priceRegex: /(\d+(?:[.,]\d{1,2})?)/,
            currencyDefault: "EUR",
            categoryMapping: {
                "coches": "cars-motorcycles",
                "ropa": "fashion",
                "moviles": "tech-electronics",
                "ordenadores": "tech-electronics",
                "consolas": "tech-electronics",
                "deportes": "sports-leisure",
                "hogar": "home-garden",
                "musica": "movies-books-music",
                "juguetes": "baby-kids",
                "coleccionables": "collectibles-art",
            },
            conditionMapping: {
                "Nuevo": "new",
                "Nuevo con defectos": "like-new",
                "Abierto – sin usar": "like-new",
                "Usado": "good",
                "Para piezas": "poor",
            },
        },

        // Ban Detection
        banPatterns: {
            statusCodes: [403, 429],
            bodyPatterns: [
                "Captcha",
                "Access Denied",
                "verify yourself",
                "suspicious activity",
            ],
        },

        // Branding
        logo: "/platforms/ebay.svg",
        primaryColor: "#E53238",
    },

    milanuncios: {
        id: "milanuncios",
        name: "milanuncios",
        displayName: "Milanuncios",
        description: "Spain's classifieds portal since 1998",

        // URLs
        baseUrl: "https://www.milanuncios.com",
        searchPath: "/anuncios/{query}.htm",

        // Status
        status: "inactive",  // Currently disabled for maintenance

        // Rate Limiting
        requestsPerMinute: 15,
        delayBetweenRequests: 4000,

        // Request Configuration
        headers: {
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "es-ES,es;q=0.9",
        },
        userAgentRotation: true,
        proxyRequired: true,

        // Selectors
        selectors: {
            productContainer: ".ma-AdCardV2",
            productTitle: ".ma-AdCardV2-title",
            productPrice: ".ma-AdPrice-value",
            productImage: ".ma-AdCardV2-photo img",
            productLink: ".ma-AdCardV2-titleLink",
            productLocation: ".ma-AdCardV2-location",
            captchaIndicator: ".captcha",
            accessDeniedIndicator: "Acceso denegado",
        },

        // Mapping Rules
        mappingRules: {
            priceRegex: /(\d+(?:\.\d{3})*(?:,\d{1,2})?)/,
            currencyDefault: "EUR",
            categoryMapping: {
                "motor": "cars-motorcycles",
                "coches": "cars-motorcycles",
                "motos": "cars-motorcycles",
                "moda-accesorios": "fashion",
                "inmobiliaria": "real-estate",
                "informatica": "tech-electronics",
                "moviles-telefonia": "tech-electronics",
                "deportes-ocio": "sports-leisure",
                "hogar-jardin": "home-garden",
                "libros-peliculas-musica": "movies-books-music",
                "bebes-ninos": "baby-kids",
                "coleccionismo": "collectibles-art",
                "construccion-reformas": "diy",
                "agricultura": "agriculture-industrial",
                "servicios": "services",
            },
            conditionMapping: {
                "nuevo": "new",
                "seminuevo": "like-new",
                "buen-estado": "good",
                "usado": "fair",
            },
        },

        // Ban Detection
        banPatterns: {
            statusCodes: [403, 429, 503],
            bodyPatterns: [
                "Captcha",
                "Acceso denegado",
                "bloqueado",
                "demasiadas solicitudes",
            ],
        },

        // Branding
        logo: "/platforms/milanuncios.svg",
        primaryColor: "#FF5A00",
    },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all active platforms
 */
export function getActivePlatforms(): PlatformConfig[] {
    return Object.values(PLATFORMS_CONFIG).filter(
        (platform) => platform.status === "active"
    );
}

/**
 * Get platform configuration by ID
 */
export function getPlatformConfig(platformId: Platform): PlatformConfig | undefined {
    return PLATFORMS_CONFIG[platformId];
}

/**
 * Get all platform IDs
 */
export function getAllPlatformIds(): Platform[] {
    return Object.keys(PLATFORMS_CONFIG) as Platform[];
}

/**
 * Check if a platform is active
 */
export function isPlatformActive(platformId: Platform): boolean {
    return PLATFORMS_CONFIG[platformId]?.status === "active";
}

/**
 * Build search URL for a platform
 */
export function buildSearchUrl(platformId: Platform, query: string): string {
    const config = PLATFORMS_CONFIG[platformId];
    if (!config) return "";

    const encodedQuery = encodeURIComponent(query);
    return `${config.baseUrl}${config.searchPath.replace("{query}", encodedQuery)}`;
}

/**
 * Get platform display info for UI
 */
export function getPlatformDisplayInfo(platformId: Platform) {
    const config = PLATFORMS_CONFIG[platformId];
    if (!config) return null;

    return {
        id: config.id,
        name: config.displayName,
        logo: config.logo,
        color: config.primaryColor,
        status: config.status,
        description: config.description,
    };
}

/**
 * Check if response indicates a ban/block
 */
export function detectBan(
    platformId: Platform,
    statusCode: number,
    responseBody: string
): { isBanned: boolean; reason: string | null } {
    const config = PLATFORMS_CONFIG[platformId];
    if (!config) return { isBanned: false, reason: null };

    // Check status codes
    if (config.banPatterns.statusCodes.includes(statusCode)) {
        return {
            isBanned: true,
            reason: `HTTP ${statusCode} - Blocked by platform`,
        };
    }

    // Check body patterns (case-insensitive)
    const lowerBody = responseBody.toLowerCase();
    for (const pattern of config.banPatterns.bodyPatterns) {
        if (lowerBody.includes(pattern.toLowerCase())) {
            return {
                isBanned: true,
                reason: `Detected: ${pattern}`,
            };
        }
    }

    return { isBanned: false, reason: null };
}

export default PLATFORMS_CONFIG;
