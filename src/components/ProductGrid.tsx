/**
 * PRODUCT GRID COMPONENT
 * PRD v12.0 Section 7: Monetization with In-feed Ads
 * 
 * Responsive grid layout for gift recommendations
 * with dynamic AdCard injection.
 */

"use client";

import { Product } from "@/types";
import ProductCard from "./ProductCard";
import AdCard from "./ads/AdCard";
import { motion } from "framer-motion";
import React from "react";

interface ProductGridProps {
    products: Product[];
    /** Whether to show in-feed ads */
    showAds?: boolean;
    /** Hide the results count header */
    hideResultsCount?: boolean;
    /** Custom ID for scroll-to functionality */
    gridId?: string;
}

export default function ProductGrid({
    products,
    showAds = false,
    hideResultsCount = true,
    gridId = "product-grid"
}: ProductGridProps) {
    /**
     * Calculate positions for AdSense placements
     * Position #5, then every 10 products (15, 25, 35...)
     */
    const shouldShowAd = (index: number): boolean => {
        if (!showAds) return false;

        const position = index + 1;
        if (position === 5) return true;
        if (position > 5 && (position - 5) % 10 === 0) return true;

        return false;
    };

    /**
     * Build grid items including products and ads
     */
    const buildGridItems = (): React.ReactElement[] => {
        const items: React.ReactElement[] = [];
        let adCounter = 1;

        products.forEach((product, index) => {
            if (shouldShowAd(index)) {
                items.push(
                    <AdCard
                        key={`ad-${adCounter}`}
                        position={index + 1}
                    />
                );
                adCounter++;
            }

            items.push(
                <ProductCard key={product.id} product={product} />
            );
        });

        return items;
    };

    const gridItems = buildGridItems();

    // Animation variants for staggered fade-in
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1] as const,
            },
        },
    };

    return (
        <div id={gridId} className="w-full scroll-mt-24">
            {/* Results Count - Optional */}
            {!hideResultsCount && (
                <div className="mb-6">
                    <p className="text-slate-600">
                        <span className="font-semibold text-text-main">{products.length}</span> regalo{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

            {/* Responsive Grid with Staggered Animation */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {gridItems.map((item, index) => (
                    <motion.div key={item.key || index} variants={itemVariants}>
                        {item}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
