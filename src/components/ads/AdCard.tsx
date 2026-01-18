/**
 * ADCARD COMPONENT
 * PRD Section 7: Monetization (Google AdSense)
 * 
 * A wrapper that displays a Google AdSense Native/Display unit.
 * If ads are disabled or failed to load, it can fallback to a placeholder (optional).
 */

"use client";

import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import AdSenseUnit from "./AdSenseUnit";

interface AdCardProps {
    /** Google AdSense Slot ID for this specific position/variant */
    slotId?: string;
    /** Google AdSense Layout Key (for In-Feed ads) */
    layoutKey?: string;
    /** Position in the grid for tracking/analytics */
    position?: number;
    /** Variant: 'standard' for normal in-feed, 'featured' for promoted content */
    /** Variant: 'standard' for normal in-feed, 'featured' for promoted content */
    variant?: "standard" | "featured";
    /** Ad Format (default: 'fluid' for In-Feed) */
    format?: "auto" | "fluid" | "rectangle";
}

export default function AdCard({
    slotId = process.env.NEXT_PUBLIC_ADSENSE_PRODUCT_SLOT_ID,
    layoutKey = process.env.NEXT_PUBLIC_ADSENSE_PRODUCT_LAYOUT_KEY,
    format = "fluid",
    position = 0,
    variant = "standard"
}: AdCardProps) {
    const isAdsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

    // If Ads are enabled and we have a Slot ID (or we want to show a generic one for testing)
    // Note: In production, you MUST provide a valid slotId from your AdSense dashboard.
    // For now, if no slotId is provided, we show the placeholder.
    if (isAdsEnabled && slotId) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center"
            >
                <div className="w-full h-full p-2">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider text-center mb-1">Advertisement</div>
                    <AdSenseUnit
                        slotId={slotId}
                        layoutKey={layoutKey}
                        format="fluid" // "fluid" is best for In-Feed
                        className="w-full h-full"
                    />
                </div>
            </motion.div>
        );
    }

    // FALLBACK / PLACEHOLDER (For Dev/Preview or when Ads disabled)
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="group cursor-pointer h-full"
        >
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative h-full flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-square bg-gradient-to-br from-slate-50 via-violet-50/30 to-orange-50/20 overflow-hidden shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="text-center">
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

                            <p className="font-heading font-bold text-slate-800 text-lg mb-1">
                                Discover More
                            </p>
                            <p className="text-sm text-slate-500 max-w-[180px] mx-auto">
                                Curated deals from trusted sellers
                            </p>
                        </div>
                    </div>

                    <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/70 border border-white/40 shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                        <span className="text-xs font-medium text-slate-700">
                            Featured
                        </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                        <div className="flex items-center gap-2 text-white text-sm font-medium bg-violet-600/80 backdrop-blur-sm px-4 py-2 rounded-full">
                            <span>Learn More</span>
                            <ExternalLink className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-1">
                    <div className="mb-3">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Sponsored
                        </span>
                    </div>

                    <h3 className="font-heading text-text-main text-base font-semibold mb-2 line-clamp-2 leading-snug">
                        Premium Partner Offers
                    </h3>

                    <p className="text-sm text-slate-500 mb-3 flex items-center gap-1 mt-auto">
                        <span>🎯</span>
                        Personalized for you
                    </p>

                    <div className="flex items-baseline justify-between mt-auto">
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
