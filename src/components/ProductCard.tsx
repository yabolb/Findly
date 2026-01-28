"use client";

import { Product } from "@/types";
import { PLATFORM_LOGOS, PLATFORM_NAMES } from "@/lib/mock-data";
import { ExternalLink, Sparkles, ShoppingBag } from "lucide-react";
import { sendEvent } from "@/lib/analytics";
import { useState } from "react";
import { motion } from "framer-motion";

interface ProductCardProps {
    product: Product;
    isTopMatch?: boolean;
}

export default function ProductCard({ product, isTopMatch }: ProductCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const trackAffiliate = () => {
        sendEvent('affiliate_click', {
            product_name: product.title,
            product_price: product.price,
            merchant: PLATFORM_NAMES[product.platform] || product.platform,
            product_category: product.category,
        });
    };

    const handleClick = () => {
        trackAffiliate();
        window.open(product.source_url, "_blank", "noopener,noreferrer");
    };

    const handleBuyClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        trackAffiliate();
        window.open(product.source_url, "_blank", "noopener,noreferrer");
    };

    // Handle image load error with fallback
    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true); // Mark as loaded to hide skeleton
    };

    // Callback ref that checks if image is already loaded (cached)
    const imgRefCallback = (img: HTMLImageElement | null) => {
        if (img && img.complete) {
            if (img.naturalWidth > 0) {
                setImageLoaded(true);
            } else {
                // Image failed to load (0 dimensions means error)
                setImageError(true);
                setImageLoaded(true);
            }
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`group cursor-pointer h-full relative ${isTopMatch ? "sm:scale-[1.02]" : ""}`}
            onClick={handleClick}
        >
            <div className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border h-full flex flex-col ${isTopMatch ? "border-violet-200 ring-1 ring-violet-100" : "border-gray-100"
                }`}>
                {/* Image Container with Source Badge */}
                <div className="relative aspect-square bg-slate-50 overflow-hidden">
                    {/* Skeleton Loader */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
                    )}

                    {/* Product Image */}
                    {!imageError && product.image_url && (
                        <img
                            ref={imgRefCallback}
                            src={product.image_url}
                            alt={product.title}
                            className={`w-full h-full object-cover p-4 transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                            onLoad={() => setImageLoaded(true)}
                            onError={handleImageError}
                            loading="lazy"
                            decoding="async"
                        />
                    )}

                    {/* Fallback when image fails or is missing */}
                    {(imageError || !product.image_url) && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <div className="text-6xl">🎁</div>
                        </div>
                    )}

                    {/* Top Match Badge */}
                    {isTopMatch && (
                        <div className="absolute top-4 left-4 z-10">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
                            >
                                <span>⭐ Mejor Opción</span>
                            </motion.div>
                        </div>
                    )}

                    {/* Glassmorphism Source Badge - Top Right */}
                    <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full backdrop-blur-md bg-white/70 border border-white/40 shadow-sm flex items-center gap-1.5">
                        <span className="text-base sm:text-lg">{PLATFORM_LOGOS[product.platform]}</span>
                        <span className="text-[10px] sm:text-xs font-semibold text-slate-700">
                            {PLATFORM_NAMES[product.platform]}
                        </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                        <div className="flex items-center gap-2 text-violet-900 text-xs sm:text-sm font-semibold bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl">
                            <span>Ver en {PLATFORM_NAMES[product.platform]}</span>
                            <ExternalLink className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    {/* Product Title */}
                    <h3 className="font-heading text-text-main text-sm sm:text-base font-bold mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>

                    {/* Findly Reason - Refactored as Task 4 requested */}
                    {product.findly_reason && (
                        <div className="mb-4 p-3 bg-violet-50 rounded-2xl border border-violet-100/50">
                            <div className="flex items-start gap-2.5">
                                <Sparkles className="w-3.5 h-3.5 text-violet-600 flex-shrink-0 mt-0.5" />
                                <p className="text-[11px] sm:text-xs text-violet-900 font-medium leading-relaxed">
                                    {product.findly_reason}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Spacer to push content to bottom */}
                    <div className="flex-1" />

                    {/* Price and Buy Button */}
                    <div className="space-y-4 pt-3 border-t border-slate-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline">
                                <span className="text-xl sm:text-2xl font-black text-violet-600">
                                    {product.price.toLocaleString('es-ES', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}€
                                </span>
                            </div>
                        </div>

                        {/* Buy Now Button */}
                        <button
                            onClick={handleBuyClick}
                            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-violet-700 text-white font-bold py-3.5 px-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-violet-200/50 active:scale-[0.98] text-sm"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Comprar Ahora</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
