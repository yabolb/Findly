"use client";

import React, { useState } from "react";
import { X, SlidersHorizontal, MapPin, DollarSign, Calendar, Package, Tag } from "lucide-react";
import { SearchFilters, ProductCondition, Platform, PriceScore } from "@/types";

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    filters: SearchFilters;
    onFiltersChange: (filters: SearchFilters) => void;
    onApply: () => void;
}

export default function FilterSidebar({
    isOpen,
    onClose,
    filters,
    onFiltersChange,
    onApply,
}: FilterSidebarProps) {
    const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

    const updateFilter = (key: keyof SearchFilters, value: any) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        onFiltersChange(localFilters);
        onApply();
        onClose();
    };

    const handleClearAll = () => {
        const clearedFilters: SearchFilters = {
            query: localFilters.query,
            category: localFilters.category,
        };
        setLocalFilters(clearedFilters);
        onFiltersChange(clearedFilters);
    };

    const toggleCondition = (condition: ProductCondition) => {
        const current = localFilters.condition || [];
        const updated = current.includes(condition)
            ? current.filter((c) => c !== condition)
            : [...current, condition];
        updateFilter("condition", updated);
    };

    const togglePlatform = (platform: Platform) => {
        const current = localFilters.platform || [];
        const updated = current.includes(platform)
            ? current.filter((p) => p !== platform)
            : [...current, platform];
        updateFilter("platform", updated);
    };

    const togglePriceScore = (score: PriceScore) => {
        if (!score) return;
        const current = localFilters.priceScore || [];
        const updated = current.includes(score)
            ? current.filter((s) => s !== score)
            : [...current, score];
        updateFilter("priceScore", updated);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                onClick={onClose}
            />

            {/* Sidebar/Drawer */}
            <div
                className={`
                    fixed lg:sticky top-0 right-0 lg:right-auto
                    h-screen lg:h-auto
                    w-80 lg:w-72
                    bg-white
                    shadow-2xl lg:shadow-xl
                    rounded-l-3xl lg:rounded-3xl
                    z-50 lg:z-10
                    overflow-y-auto
                    transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
                `}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5 text-violet-600" />
                            <h2 className="text-lg font-bold text-slate-900">Filters</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                            <DollarSign className="w-4 h-4" />
                            Price Range
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Min €</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={localFilters.minPrice || ""}
                                    onChange={(e) =>
                                        updateFilter("minPrice", parseFloat(e.target.value) || undefined)
                                    }
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Max €</label>
                                <input
                                    type="number"
                                    placeholder="∞"
                                    value={localFilters.maxPrice || ""}
                                    onChange={(e) =>
                                        updateFilter("maxPrice", parseFloat(e.target.value) || undefined)
                                    }
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                            <MapPin className="w-4 h-4" />
                            Location
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Barcelona, Madrid..."
                            value={localFilters.location || ""}
                            onChange={(e) => updateFilter("location", e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Condition */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                            <Package className="w-4 h-4" />
                            Condition
                        </label>
                        <div className="space-y-2">
                            {(["new", "like-new", "good", "fair"] as ProductCondition[]).map((condition) => (
                                <label
                                    key={condition}
                                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={localFilters.condition?.includes(condition) || false}
                                        onChange={() => toggleCondition(condition)}
                                        className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500"
                                    />
                                    <span className="text-sm text-slate-700 capitalize">
                                        {condition === "like-new" ? "Like New" : condition}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Date Posted */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                            <Calendar className="w-4 h-4" />
                            Date Posted
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: "24h", label: "Last 24h" },
                                { value: "week", label: "Last Week" },
                                { value: "month", label: "Last Month" },
                                { value: "all", label: "All Time" },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => updateFilter("dateFilter", option.value)}
                                    className={`
                                        px-3 py-2 rounded-xl text-sm font-medium transition-all
                                        ${localFilters.dateFilter === option.value ||
                                            (!localFilters.dateFilter && option.value === "all")
                                            ? "bg-violet-600 text-white shadow-md"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }
                                    `}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Platform */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                            <Tag className="w-4 h-4" />
                            Platform
                        </label>
                        <div className="space-y-2">
                            {(["wallapop", "vinted", "ebay", "milanuncios"] as Platform[]).map((platform) => (
                                <label
                                    key={platform}
                                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={localFilters.platform?.includes(platform) || false}
                                        onChange={() => togglePlatform(platform)}
                                        className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500"
                                    />
                                    <span className="text-sm text-slate-700 capitalize">{platform}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Score */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                            💎 Price Score
                        </label>
                        <div className="space-y-2">
                            {(["bargain", "fair", "expensive"] as PriceScore[]).map((score) => (
                                <label
                                    key={score}
                                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={localFilters.priceScore?.includes(score) || false}
                                        onChange={() => togglePriceScore(score)}
                                        className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500"
                                    />
                                    <span className="text-sm text-slate-700 capitalize flex items-center gap-2">
                                        <span
                                            className={`w-2 h-2 rounded-full ${score === "bargain"
                                                    ? "bg-green-500"
                                                    : score === "fair"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                }`}
                                        />
                                        {score}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            onClick={handleClearAll}
                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/30"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
