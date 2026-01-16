/**
 * ADCARD COMPONENT
 * PRD Section 7: Monetization (Google AdSense)
 * 
 * A "mimetized" ad card that looks identical to ProductCard
 * for seamless in-feed native advertising.
 */

"use client";

import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";

interface AdCardProps {
    /** Position in the grid for tracking/analytics */
    position?: number;
    /** Variant: 'standard' for normal in-feed, 'featured' for promoted content */
    variant?: "standard" | "featured";
}

export default function AdCard({ position = 0, variant = "standard" }: AdCardProps) {
    const handleClick = () => {
        // AdSense will handle the actual click tracking
        // This is a placeholder for the native ad slot
        console.log(`Ad clicked at position ${position}`);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="group cursor-pointer"
            onClick={handleClick}
        >
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
                {/* Image Container - Matches ProductCard exactly */}
                <div className="relative aspect-square bg-gradient-to-br from-slate-50 via-violet-50/30 to-orange-50/20 overflow-hidden">
                    {/* Premium Promotional Visual */}
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="text-center">
                            {/* Animated Icon Container */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    rotate: [0, 2, -2, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center border border-white/50"
                            >
                                <Sparkles className="w-10 h-10 text-violet-500" />
                            </motion.div>

                            {/* Promotional Text */}
                            <p className="font-heading font-bold text-slate-800 text-lg mb-1">
                                Discover More
                            </p>
                            <p className="text-sm text-slate-500 max-w-[180px] mx-auto">
                                Curated deals from trusted sellers
                            </p>
                        </div>
                    </div>

                    {/* Glassmorphism Badge - Top Right (matches ProductCard) */}
                    <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/70 border border-white/40 shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                        <span className="text-xs font-medium text-slate-700">
                            Featured
                        </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                        <div className="flex items-center gap-2 text-white text-sm font-medium bg-violet-600/80 backdrop-blur-sm px-4 py-2 rounded-full">
                            <span>Learn More</span>
                            <ExternalLink className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Card Content - Matches ProductCard exactly */}
                <div className="p-4">
                    {/* Sponsored Label - Replaces Price Score badge */}
                    <div className="mb-3">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Sponsored
                        </span>
                    </div>

                    {/* Title - Same typography as ProductCard */}
                    <h3 className="font-heading text-text-main text-base font-semibold mb-2 line-clamp-2 leading-snug">
                        Premium Partner Offers
                    </h3>

                    {/* Location Placeholder - Same style as ProductCard */}
                    <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                        <span>🎯</span>
                        Personalized for you
                    </p>

                    {/* CTA - Same layout as price in ProductCard */}
                    <div className="flex items-baseline justify-between">
                        <span className="text-base font-semibold text-violet-600">
                            Explore Deals →
                        </span>
                        <span className="text-xs text-slate-400">
                            Ad
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
