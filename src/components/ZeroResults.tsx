"use client";

import { Category, CATEGORY_LABELS } from "@/types";
import { Search, Package } from "lucide-react";

interface ZeroResultsProps {
    query?: string;
}

const SUGGESTED_CATEGORIES: Category[] = [
    "tech-electronics",
    "fashion",
    "sports-leisure",
    "home-garden",
    "cars-motorcycles",
];

export default function ZeroResults({ query }: ZeroResultsProps) {
    const handleCategoryClick = (category: Category) => {
        // This will be connected to the search state later
        console.log("Suggested category clicked:", category);
        // TODO: Trigger search with this category
    };

    return (
        <div className="w-full max-w-2xl mx-auto text-center py-20">
            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-slate-400" />
            </div>

            {/* Heading */}
            <h2 className="font-heading text-3xl font-bold text-text-main mb-3">
                No results found
            </h2>

            {/* Message */}
            <p className="text-lg text-slate-600 mb-8">
                {query ? (
                    <>
                        We couldn't find any products matching{" "}
                        <span className="font-semibold text-text-main">"{query}"</span>
                    </>
                ) : (
                    "Try adjusting your search or browse our suggested categories below"
                )}
            </p>

            {/* Suggested Categories */}
            <div className="space-y-4">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    Suggested Categories
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {SUGGESTED_CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className="px-6 py-3 rounded-full bg-white border-2 border-gray-200 text-text-main font-medium hover:border-primary hover:text-primary hover:shadow-lg transition-all duration-200 hover:scale-105"
                        >
                            {CATEGORY_LABELS[category]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Tips */}
            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-start gap-3">
                    <Search className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="text-left">
                        <h3 className="font-semibold text-text-main mb-2">Search Tips</h3>
                        <ul className="text-sm text-slate-600 space-y-1">
                            <li>• Try using more general keywords</li>
                            <li>• Check your spelling</li>
                            <li>• Remove filters to see more results</li>
                            <li>• Browse different categories</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
