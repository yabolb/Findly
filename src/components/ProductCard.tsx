"use client";

import { Product } from "@/types";
import { PLATFORM_LOGOS, PLATFORM_NAMES } from "@/lib/mock-data";
import { ExternalLink, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleClick = () => {
        window.open(product.source_url, "_blank", "noopener,noreferrer");
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="group cursor-pointer h-full"
            onClick={handleClick}
        >
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
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
                        onError={(e) => {
                            console.error('Image failed to load:', product.image_url);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                        loading="lazy"
                    />

                    {/* Fallback gradient if image hasn't loaded */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center transition-opacity ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
                        <div className="text-6xl opacity-20">🎁</div>
                    </div>

                    {/* Glassmorphism Source Badge - Top Right */}
                    <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/70 border border-white/40 shadow-lg flex items-center gap-1.5">
                        <span className="text-lg">{PLATFORM_LOGOS[product.platform]}</span>
                        <span className="text-xs font-medium text-slate-700">
                            {PLATFORM_NAMES[product.platform]}
                        </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                        <div className="flex items-center gap-2 text-white text-sm font-medium">
                            <span>Ver en {PLATFORM_NAMES[product.platform]}</span>
                            <ExternalLink className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Product Title */}
                    <h3 className="font-heading text-text-main text-base font-semibold mb-2 line-clamp-2 leading-snug">
                        {product.title}
                    </h3>

                    {/* Findly Reason - The key differentiator */}
                    {product.findly_reason && (
                        <div className="mb-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                            <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-text-main/70 leading-relaxed">
                                    {product.findly_reason}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Spacer to push price to bottom */}
                    <div className="flex-1" />

                    {/* Price */}
                    <div className="flex items-baseline justify-between pt-2 border-t border-gray-50">
                        <span className="text-2xl font-bold text-primary">
                            {product.price.toLocaleString('es-ES', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })} €
                        </span>
                        <span className="text-xs text-slate-400 capitalize">
                            {PLATFORM_NAMES[product.platform]}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
