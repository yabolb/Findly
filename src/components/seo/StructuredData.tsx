/**
 * STRUCTURED DATA COMPONENTS
 * PRD v12.0 Section 8: SEO & AISO (AI Search Optimization)
 * 
 * Generates Schema.org JSON-LD for gift recommendations
 */

"use client";

import { Product, Category, CATEGORY_LABELS } from "@/types";
import { PLATFORM_NAMES } from "@/lib/mock-data";
import Script from "next/script";

// ========================================
// SINGLE PRODUCT JSON-LD
// ========================================

interface ProductJsonLdProps {
    product: Product;
}

/**
 * Generate JSON-LD for a single product
 */
export function ProductJsonLd({ product }: ProductJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description || product.findly_reason || `${product.title} - Regalo disponible en ${PLATFORM_NAMES[product.platform]}`,
        image: product.image_url,
        url: product.source_url,
        category: CATEGORY_LABELS[product.category] || "Otros",
        itemCondition: "https://schema.org/NewCondition",
        offers: {
            "@type": "Offer",
            price: product.price.toFixed(2),
            priceCurrency: product.currency,
            availability: "https://schema.org/InStock",
            seller: {
                "@type": "Organization",
                name: PLATFORM_NAMES[product.platform],
            },
        },
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
// PRODUCT LIST JSON-LD
// ========================================

interface ProductListJsonLdProps {
    products: Product[];
    query?: string;
    category?: Category;
}

/**
 * Generate JSON-LD for a product listing
 */
export function ProductListJsonLd({ products, query, category }: ProductListJsonLdProps) {
    if (products.length === 0) return null;

    const prices = products.map(p => p.price);
    const lowPrice = Math.min(...prices);
    const highPrice = Math.max(...prices);

    let listName = "Ideas de Regalo";
    if (query) {
        listName = `${query} - Ideas de Regalo`;
    } else if (category) {
        listName = `${CATEGORY_LABELS[category]} - Regalos Recomendados`;
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: listName,
        description: `Encuentra regalos personalizados de ${query || (category ? CATEGORY_LABELS[category].toLowerCase() : "todas las categorías")}. Recomendaciones de Amazon, Etsy, El Corte Inglés, Fnac y Decathlon.`,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 10).map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "Product",
                name: product.title,
                image: product.image_url,
                url: product.source_url,
                offers: {
                    "@type": "Offer",
                    price: product.price.toFixed(2),
                    priceCurrency: product.currency,
                    availability: "https://schema.org/InStock",
                },
            },
        })),
    };

    return (
        <Script
            id="product-list-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            strategy="afterInteractive"
        />
    );
}

// ========================================
// WEBSITE STRUCTURED DATA
// ========================================

interface WebsiteJsonLdProps {
    siteUrl?: string;
}

/**
 * Generate JSON-LD for the website
 */
export function WebsiteJsonLd({ siteUrl = "https://getfindly.com" }: WebsiteJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Findly",
        alternateName: "Findly - Tu Asesor de Regalos Inteligente",
        url: siteUrl,
        description: "Encuentra el regalo perfecto en 30 segundos. Recomendaciones personalizadas para cualquier ocasión.",
        inLanguage: "es-ES",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteUrl}/quiz`,
            },
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
        description: "Tu asesor de regalos inteligente. Encuentra el regalo perfecto en 30 segundos.",
        sameAs: [],
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
// COMBINED STRUCTURED DATA COMPONENT
// ========================================

interface StructuredDataProps {
    products?: Product[];
    product?: Product;
    query?: string;
    category?: Category;
    includeWebsite?: boolean;
    includeOrganization?: boolean;
}

/**
 * Main StructuredData component
 */
export default function StructuredData({
    products,
    product,
    query,
    category,
    includeWebsite = false,
    includeOrganization = false,
}: StructuredDataProps) {
    return (
        <>
            {includeWebsite && <WebsiteJsonLd />}
            {includeOrganization && <OrganizationJsonLd />}
            {product && <ProductJsonLd product={product} />}
            {products && products.length > 0 && (
                <ProductListJsonLd
                    products={products}
                    query={query}
                    category={category}
                />
            )}
        </>
    );
}
