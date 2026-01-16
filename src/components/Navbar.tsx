"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import SearchBar from "./SearchBar";
import { useScrollPosition } from "@/hooks/useScrollPosition";

interface NavbarProps {
    onSearch?: (query: string, category: string, location: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
    const { scrollY, isScrolled: isSearchVisible } = useScrollPosition();
    const isNavBackgroundVisible = scrollY > 10;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isNavBackgroundVisible
                ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100/50"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-105 shadow-sm">
                            <Search className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading text-2xl font-bold text-text-main hidden sm:block">
                            Findly
                        </span>
                    </Link>

                    {/* Sticky Search Bar - Appears on Scroll */}
                    <div className={`hidden md:block flex-1 max-w-xl mx-8 transition-all duration-300 ${isSearchVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-4 pointer-events-none"
                        }`}>
                        <SearchBar onSearch={onSearch} compact />
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8 flex-shrink-0">
                        <Link
                            href="/categories"
                            className="text-text-main/70 hover:text-primary font-medium transition-colors duration-200 relative group"
                        >
                            Categories
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
                        </Link>
                        <Link
                            href="/about"
                            className="text-text-main/70 hover:text-primary font-medium transition-colors duration-200 relative group"
                        >
                            About
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 rounded-xl hover:bg-primary/10 transition-colors ml-auto">
                        <svg
                            className="w-6 h-6 text-text-main"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
