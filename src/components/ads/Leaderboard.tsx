/**
 * LEADERBOARD AD COMPONENT
 * PRD Section 7: Monetization (Google AdSense)
 * 
 * A responsive horizontal ad container placed below the header
 * and above the search results. "Above-the-fold" premium placement.
 * Displays Google AdSense when enabled, or a placeholder for dev/preview.
 */

"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import AdSenseUnit from "./AdSenseUnit";

interface LeaderboardProps {
    /** Google AdSense Slot ID for this leaderboard */
    slotId?: string;
    /** Show on mobile or hide */
    showOnMobile?: boolean;
    /** Custom class names */
    className?: string;
}

export default function Leaderboard({
    slotId = process.env.NEXT_PUBLIC_ADSENSE_LEADERBOARD_SLOT_ID,
    showOnMobile = true,
    className = ""
}: LeaderboardProps) {
    const isAdsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

    // If Ads are enabled AND we have a slot ID, showing the real AdSense unit
    if (isAdsEnabled && slotId) {
        return (
            <div className={`w-full ${showOnMobile ? "" : "hidden md:block"} ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                    <div className="min-h-[90px] md:min-h-[120px] bg-gray-50 rounded-2xl md:rounded-3xl border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
                        <div className="w-full text-center">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Advertisement</div>
                            <AdSenseUnit
                                slotId={slotId}
                                format="horizontal"
                                className="w-full flex justify-center"
                                style={{ display: 'block', minHeight: '90px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // FALLBACK / PLACEHOLDER BANNER
    return (
        <div className={`w-full ${showOnMobile ? "" : "hidden md:block"} ${className}`}>
            {/* Outer Container with vertical padding as per PRD */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                {/* Leaderboard Ad Container */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative overflow-hidden"
                >
                    {/* Main Ad Container */}
                    <div className="relative bg-gradient-to-r from-violet-50 via-white to-orange-50 rounded-2xl md:rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                        {/* Desktop Layout - Horizontal (max-height: 90px) */}
                        <div className="hidden md:flex items-center justify-between px-8 py-4 max-h-[90px]">
                            {/* Left: Brand/Offer */}
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center border border-slate-100">
                                    <Sparkles className="w-7 h-7 text-violet-500" />
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-slate-800 text-lg">
                                        Find Better Deals Faster
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Exclusive partner offers curated for you
                                    </p>
                                </div>
                            </div>

                            {/* Center: Value Proposition */}
                            <div className="hidden lg:flex items-center gap-6">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-sm font-medium">Verified Sellers</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span className="text-sm font-medium">Best Prices</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                                    <span className="text-sm font-medium">Fast Shipping</span>
                                </div>
                            </div>

                            {/* Right: CTA */}
                            <div className="flex items-center gap-3">
                                <button className="group flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-600/20 transition-all duration-200">
                                    <span>Explore</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                                <span className="text-xs text-slate-400 font-medium">
                                    Sponsored
                                </span>
                            </div>
                        </div>

                        {/* Mobile Layout - Compact (max-height: 100px) */}
                        <div className="md:hidden flex items-center gap-4 px-4 py-4 max-h-[100px]">
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center border border-slate-100 flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-violet-500" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-heading font-bold text-slate-800 text-base truncate">
                                    Better Deals, Faster
                                </h3>
                                <p className="text-xs text-slate-500 truncate">
                                    Partner offers curated for you
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <button className="flex items-center gap-1 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg shadow-md">
                                    <span>View</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-[10px] text-slate-400">
                                    Sponsored
                                </span>
                            </div>
                        </div>

                        {/* Subtle Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />
                    </div>

                    {/* Ad Label - Minimal & Accessible */}
                    <div className="absolute top-2 right-3 md:hidden">
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Ad
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
