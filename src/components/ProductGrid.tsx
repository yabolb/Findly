"use client";

import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import React from "react";

interface ProductGridProps {
    products: Product[];
}

// Sponsored Card Component - Mimics ProductCard Design
function SponsoredCard({ position }: { position: number }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="group cursor-pointer"
        >
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                {/* Image Container with Promoted Content */}
                <div className="relative aspect-square bg-gradient-to-br from-violet-50 to-orange-50 overflow-hidden flex items-center justify-center">
                    {/* Promoted Brand/Offer Placeholder */}
                    <div className="text-center p-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <span className="text-4xl">💎</span>
                        </div>
                        <p className="font-heading font-semibold text-slate-700 text-lg mb-1">
                            Premium Offer
                        </p>
                        <p className="text-sm text-slate-500">
                            Featured Brand
                        </p>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                    {/* Placeholder Title */}
                    <h3 className="font-heading text-text-main text-base font-semibold mb-2 line-clamp-2 leading-snug mt-3">
                        Discover Amazing Deals
                    </h3>

                    {/* Placeholder Location */}
                    <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                        <span>📍</span>
                        Your Location
                    </p>

                    {/* Placeholder Price */}
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-primary">
                            --
                        </span>
                        <span className="text-xs text-slate-400">
                            Position #{position}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}



export default function ProductGrid({ products }: ProductGridProps) {
    // Calculate positions for AdSense placements
    // Position #5, then every 10 products (15, 25, 35...)
    const shouldShowAd = (index: number): boolean => {
        const position = index + 1;
        return position === 5 || (position > 5 && (position - 5) % 10 === 0);
    };

    // Build grid items including ads
    const gridItems: React.ReactElement[] = [];
    let adCounter = 1;

    products.forEach((product, index) => {
        // Check if we should insert an ad BEFORE this product
        if (shouldShowAd(index)) {
            gridItems.push(
                <SponsoredCard key={`ad-${adCounter}`} position={index + 1} />
            );
            adCounter++;
        }

        // Add the product
        gridItems.push(<ProductCard key={product.id} product={product} />);
    });

    // Animation variants for staggered fade-in
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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
                ease: [0.4, 0, 0.2, 1] as any, // easeOut bezier curve
            },
        },
    };

    return (
        <div className="w-full">
            {/* Results Count */}
            <div className="mb-6">
                <p className="text-slate-600">
                    <span className="font-semibold text-text-main">{products.length}</span> results
                    found
                </p>
            </div>

            {/* Responsive Grid with Staggered Animation */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {gridItems.map((item, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        {item}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
