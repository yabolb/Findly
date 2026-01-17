"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import { useScrollPosition } from "@/hooks/useScrollPosition";

export default function Navbar() {
    const { scrollY } = useScrollPosition();
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
                            <Gift className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading text-2xl font-bold text-text-main">
                            Findly
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8 flex-shrink-0">
                        <Link
                            href="/quiz"
                            className="text-text-main/70 hover:text-primary font-medium transition-colors duration-200 relative group"
                        >
                            Empezar
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
                        </Link>
                        <Link
                            href="#como-funciona"
                            className="text-text-main/70 hover:text-primary font-medium transition-colors duration-200 relative group"
                        >
                            Cómo Funciona
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
                        </Link>
                    </div>

                    {/* CTA Button */}
                    <div className="flex items-center gap-4">
                        <Link href="/quiz" className="hidden sm:block">
                            <button className="bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg">
                                Empezar Cuestionario
                            </button>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 rounded-xl hover:bg-primary/10 transition-colors">
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
            </div>
        </nav>
    );
}
