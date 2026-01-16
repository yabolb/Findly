"use client";

import React from "react";
import { ArrowUpDown, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { SortOption } from "@/types";

interface SortDropdownProps {
    value: SortOption;
    onChange: (option: SortOption) => void;
}

const sortOptions: Array<{ value: SortOption; label: string; icon: React.ReactNode }> = [
    {
        value: "relevance",
        label: "Relevance",
        icon: <ArrowUpDown className="w-4 h-4" />,
    },
    {
        value: "price_asc",
        label: "Price: Low to High",
        icon: <TrendingUp className="w-4 h-4" />,
    },
    {
        value: "price_desc",
        label: "Price: High to Low",
        icon: <TrendingDown className="w-4 h-4" />,
    },
    {
        value: "date_desc",
        label: "Newest First",
        icon: <Clock className="w-4 h-4" />,
    },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
    const currentOption = sortOptions.find((opt) => opt.value === value) || sortOptions[0];

    return (
        <div className="relative group">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                className="
                    appearance-none
                    px-4 py-2.5
                    pr-10
                    bg-white
                    border border-slate-200
                    rounded-xl
                    font-medium
                    text-sm
                    text-slate-700
                    cursor-pointer
                    hover:border-violet-600
                    focus:ring-2
                    focus:ring-violet-600
                    focus:border-transparent
                    outline-none
                    transition-all
                    shadow-sm
                    hover:shadow-md
                "
            >
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                {currentOption.icon}
            </div>
        </div>
    );
}
