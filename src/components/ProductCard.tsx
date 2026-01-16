"use client";

import { Product, PriceScore } from "@/types";
import { PLATFORM_LOGOS } from "@/lib/mock-data";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface ProductCardProps {
    product: Product;
}

const PRICE_SCORE_CONFIG: Record<PriceScore & string, { label: string; color: string; dotColor: string; pulse?: boolean }> = {
    bargain: {
        label: "Bargain",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        dotColor: "bg-emerald-500",
        pulse: true, // Enable pulse effect for bargains
    },
    fair: {
        label: "Fair Price",
        color: "bg-slate-100 text-slate-600 border-slate-200",
        dotColor: "bg-slate-400",
    },
    expensive: {
        label: "Market Price",
        color: "bg-slate-100 text-slate-600 border-slate-200",
        dotColor: "bg-slate-400",
    },
};

export default function ProductCard({ product }: ProductCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const priceScoreConfig = product.price_score ? PRICE_SCORE_CONFIG[product.price_score] : null;

    const handleClick = () => {
        window.open(product.source_url, "_blank", "noopener,noreferrer");
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="group cursor-pointer"
            onClick={handleClick}
        >
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                {/* Image Container with Source Badge */}
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    {/* Skeleton Loader */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
                    )}

                    {/* Product Image */}
                    <img
                        src={product.image_url}
                        alt={product.title}
                        className={`w-full h-full object-cover rounded-2xl p-3 transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                            }`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />

                    {/* Glassmorphism Source Badge - Top Right */}
                    <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/70 border border-white/40 shadow-lg flex items-center gap-1.5">
                        <span className="text-lg">{PLATFORM_LOGOS[product.platform]}</span>
                        <span className="text-xs font-medium text-slate-700 capitalize">
                            {product.platform}
                        </span>
                    </div>

                    {/* Condition Badge - Top Left */}
                    <div className="absolute top-5 left-5 px-2 py-1 rounded-lg backdrop-blur-md bg-black/40 text-white text-xs font-medium capitalize">
                        {product.condition.replace("-", " ")}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                        <div className="flex items-center gap-2 text-white text-sm font-medium">
                            <span>View on {product.platform}</span>
                            <ExternalLink className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                    {/* Price Score Indicator */}
                    {priceScoreConfig && (
                        <div className="mb-3">
                            <div
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${priceScoreConfig.color}`}
                            >
                                <div className="relative">
                                    <div className={`w-2 h-2 rounded-full ${priceScoreConfig.dotColor}`} />
                                    {priceScoreConfig.pulse && (
                                        <div className={`absolute top-0 left-0 w-2 h-2 rounded-full ${priceScoreConfig.dotColor} animate-ping opacity-75`} />
                                    )}
                                </div>
                                {priceScoreConfig.label}
                            </div>
                        </div>
                    )}

                    {/* Product Title */}
                    <h3 className="font-heading text-text-main text-base font-semibold mb-2 line-clamp-2 leading-snug">
                        {product.title}
                    </h3>

                    {/* Location */}
                    <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                        <span>📍</span>
                        {product.location}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-primary">
                            {product.currency === "EUR"
                                ? `${product.price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
                                : `${product.price.toFixed(2)} ${product.currency}`
                            }
                        </span>
                        <span className="text-xs text-slate-400">
                            {new Date(product.created_at).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
