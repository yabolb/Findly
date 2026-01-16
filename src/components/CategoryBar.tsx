"use client";

import { Category, CATEGORY_LABELS } from "@/types";
import {
    Car,
    Shirt,
    Home as HomeIcon,
    Laptop,
    Dumbbell,
    Sofa,
    Film,
    Baby,
    Gem,
    Wrench,
    Tractor,
    Briefcase,
    MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";

interface CategoryBarProps {
    selectedCategory?: Category | "all";
    onCategorySelect: (category: Category | "all") => void;
}

// Icon mapping for each category
const CATEGORY_ICONS: Record<Category, any> = {
    "cars-motorcycles": Car,
    "fashion": Shirt,
    "real-estate": HomeIcon,
    "tech-electronics": Laptop,
    "sports-leisure": Dumbbell,
    "home-garden": Sofa,
    "movies-books-music": Film,
    "baby-kids": Baby,
    "collectibles-art": Gem,
    "diy": Wrench,
    "agriculture-industrial": Tractor,
    "services": Briefcase,
    "others": MoreHorizontal,
};

const ALL_CATEGORIES: Array<{ id: Category | "all"; label: string; Icon: any }> = [
    { id: "all", label: "All", Icon: MoreHorizontal },
    ...Object.entries(CATEGORY_LABELS).map(([id, label]) => ({
        id: id as Category,
        label,
        Icon: CATEGORY_ICONS[id as Category],
    })),
];

export default function CategoryBar({ selectedCategory = "all", onCategorySelect }: CategoryBarProps) {
    return (
        <div className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-20 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Horizontal Scrollable Container */}
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-2 py-4 min-w-max">
                        {ALL_CATEGORIES.map(({ id, label, Icon }) => {
                            const isSelected = selectedCategory === id;

                            return (
                                <motion.button
                                    key={id}
                                    onClick={() => onCategorySelect(id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                                        transition-all duration-200
                                        ${isSelected
                                            ? "bg-primary text-white shadow-md"
                                            : "bg-white text-slate-700 border border-gray-200 hover:border-primary hover:text-primary hover:shadow-md"
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="whitespace-nowrap">{label}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Custom CSS for hiding scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
