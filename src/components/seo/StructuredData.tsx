/**
 * STRUCTURED DATA COMPONENTS
 * PRD Section 8: SEO & AISO (AI Search Optimization)
 * 
 * Generates Schema.org JSON-LD for:
 * - Individual products (Product schema)
 * - Product listings (ItemList with AggregateOffer)
 * 
 * These help AI models (ChatGPT, Perplexity) and Google
 * better understand and recommend Findly content.
 */

"use client";

import { Product, Category, CATEGORY_LABELS } from "@/types";
import Script from "next/script";

// ========================================
// CONDITION MAPPING FOR SCHEMA.ORG
// ========================================

/**
 * Map Findly condition to Schema.org ItemCondition
 */
function getSchemaCondition(condition: string): string {
    const conditionMap: Record<string, string> = {
        "new": "https://schema.org/NewCondition",
        "like-new": "https://schema.org/UsedCondition",
        "good": "https://schema.org/UsedCondition",
        "fair": "https://schema.org/UsedCondition",
        "poor": "https://schema.org/DamagedCondition",
    };
    return conditionMap[condition] || "https://schema.org/UsedCondition";
}

/**
 * Get human-readable condition label
 */
function getConditionLabel(condition: string): string {
    const labels: Record<string, string> = {
        "new": "New",
        "like-new": "Like New - Second-hand",
        "good": "Good Condition - Second-hand",
        "fair": "Fair Condition - Second-hand",
        "poor": "For Parts - Second-hand",
    };
    return labels[condition] || "Second-hand";
}

// ========================================
// SINGLE PRODUCT JSON-LD
// ========================================

interface ProductJsonLdProps {
    product: Product;
}

/**
 * Generate JSON-LD for a single product
 * Schema: Product with Offer
 */
export function ProductJsonLd({ product }: ProductJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description || `${product.title} - Second-hand item available on ${product.platform}`,
        image: product.image_url,
        url: product.source_url,
        category: CATEGORY_LABELS[product.category] || "Other",
        itemCondition: getSchemaCondition(product.condition),
        offers: {
            "@type": "Offer",
            price: product.price.toFixed(2),
            priceCurrency: product.currency,
            availability: "https://schema.org/InStock",
            itemCondition: getSchemaCondition(product.condition),
            seller: {
                "@type": "Organization",
                name: product.platform.charAt(0).toUpperCase() + product.platform.slice(1),
            },
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
        },
        brand: {
            "@type": "Brand",
            name: "Second-hand",
        },
        aggregateRating: product.price_score === "bargain" ? {
            "@type": "AggregateRating",
            ratingValue: "4.5",
            reviewCount: "1",
            bestRating: "5",
            worstRating: "1",
        } : undefined,
    };

    return (
        <Script
            id={`product-jsonld-${product.id}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            strategy="afterInteractive"
        />
    );
}

// ========================================
// PRODUCT LIST (AGGREGATE OFFER) JSON-LD
// ========================================

interface ProductListJsonLdProps {
    products: Product[];
    query?: string;
    category?: Category;
    location?: string;
}

/**
 * Generate JSON-LD for a product listing page
 * Schema: ItemList with AggregateOffer
 */
export function ProductListJsonLd({ products, query, category, location }: ProductListJsonLdProps) {
    if (products.length === 0) return null;

    const prices = products.map(p => p.price);
    const lowPrice = Math.min(...prices);
    const highPrice = Math.max(...prices);

    // Build list name based on context
    let listName = "Second-hand Products";
    if (query) {
        listName = `${query} - Second-hand Deals`;
    } else if (category) {
        listName = `${CATEGORY_LABELS[category]} - Second-hand`;
    }
    if (location) {
        listName += ` in ${location}`;
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: listName,
        description: `Find the best second-hand ${query || (category ? CATEGORY_LABELS[category].toLowerCase() : "products")} deals. Compare prices from Wallapop, Vinted, eBay & more.`,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 20).map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "Product",
                name: product.title,
                image: product.image_url,
                url: product.source_url,
                description: `${getConditionLabel(product.condition)} - Available on ${product.platform}`,
                offers: {
                    "@type": "Offer",
                    price: product.price.toFixed(2),
                    priceCurrency: product.currency,
                    availability: "https://schema.org/InStock",
                    itemCondition: getSchemaCondition(product.condition),
                },
            },
        })),
    };

    // Add aggregate offer for the search results
    const aggregateOfferJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: listName,
        description: `Best ${query || (category ? CATEGORY_LABELS[category].toLowerCase() : "second-hand")} deals across multiple marketplaces`,
        offers: {
            "@type": "AggregateOffer",
            lowPrice: lowPrice.toFixed(2),
            highPrice: highPrice.toFixed(2),
            priceCurrency: products[0]?.currency || "EUR",
            offerCount: products.length,
            offers: products.slice(0, 10).map(product => ({
                "@type": "Offer",
                price: product.price.toFixed(2),
                priceCurrency: product.currency,
                availability: "https://schema.org/InStock",
                url: product.source_url,
                itemCondition: getSchemaCondition(product.condition),
            })),
        },
    };

    return (
        <>
            <Script
                id="product-list-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                strategy="afterInteractive"
            />
            <Script
                id="aggregate-offer-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateOfferJsonLd) }}
                strategy="afterInteractive"
            />
        </>
    );
}

// ========================================
// WEBSITE STRUCTURED DATA
// ========================================

interface WebsiteJsonLdProps {
    siteUrl?: string;
}

/**
 * Generate JSON-LD for the website itself
 * Helps with sitelinks search box in Google
 */
export function WebsiteJsonLd({ siteUrl = "https://getfindly.com" }: WebsiteJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Findly",
        alternateName: "Findly - Second-hand Product Aggregator",
        url: siteUrl,
        description: "The smartest way to find second-hand deals. Search across Wallapop, Vinted, eBay & Milanuncios.",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <Script
            id="website-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            strategy="afterInteractive"
        />
    );
}

// ========================================
// ORGANIZATION STRUCTURED DATA
// ========================================

/**
 * Generate JSON-LD for the organization
 */
export function OrganizationJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Findly",
        url: "https://getfindly.com",
        logo: "https://getfindly.com/logo.png",
        description: "A meta-search engine for second-hand products across multiple marketplaces.",
        sameAs: [
            // Add social media URLs when available
        ],
    };

    return (
        <Script
            id="organization-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            strategy="afterInteractive"
        />
    );
}

// ========================================
// BREADCRUMB STRUCTURED DATA
// ========================================

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbJsonLdProps {
    items: BreadcrumbItem[];
}

/**
 * Generate JSON-LD for breadcrumb navigation
 */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <Script
            id="breadcrumb-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            strategy="afterInteractive"
        />
    );
}

// ========================================
// COMBINED STRUCTURED DATA COMPONENT
// ========================================

interface StructuredDataProps {
    products?: Product[];
    product?: Product;
    query?: string;
    category?: Category;
    location?: string;
    includeWebsite?: boolean;
    includeOrganization?: boolean;
    breadcrumbs?: BreadcrumbItem[];
}

/**
 * Main StructuredData component
 * Combines all necessary JSON-LD schemas based on page context
 */
export default function StructuredData({
    products,
    product,
    query,
    category,
    location,
    includeWebsite = false,
    includeOrganization = false,
    breadcrumbs,
}: StructuredDataProps) {
    return (
        <>
            {/* Website schema (for homepage) */}
            {includeWebsite && <WebsiteJsonLd />}

            {/* Organization schema */}
            {includeOrganization && <OrganizationJsonLd />}

            {/* Single product schema */}
            {product && <ProductJsonLd product={product} />}

            {/* Product list schema (for search results / grids) */}
            {products && products.length > 0 && (
                <ProductListJsonLd
                    products={products}
                    query={query}
                    category={category}
                    location={location}
                />
            )}

            {/* Breadcrumb schema */}
            {breadcrumbs && breadcrumbs.length > 0 && <BreadcrumbJsonLd items={breadcrumbs} />}
        </>
    );
}
