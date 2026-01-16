/**
 * PAGINATION COMPONENT
 * PRD Section 3: Classical Pagination (1, 2, 3... Next)
 * 
 * Apple-style minimalist pagination with smooth scroll-to-top
 * and premium hover effects matching Casual-Tech identity.
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface PaginationProps {
    /** Current active page (1-indexed) */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Callback when page changes */
    onPageChange: (page: number) => void;
    /** Element ID to scroll to on page change (optional) */
    scrollToId?: string;
    /** Show page size selector (optional) */
    showPageSize?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    scrollToId,
}: PaginationProps) {
    // Don't render if only one page
    if (totalPages <= 1) return null;

    /**
     * Generate page numbers to display
     * Shows: 1, 2, 3, ..., current-1, current, current+1, ..., totalPages-1, totalPages
     */
    const getPageNumbers = (): (number | "ellipsis")[] => {
        const pages: (number | "ellipsis")[] = [];
        const delta = 1; // Pages to show around current page

        // Always show first page
        pages.push(1);

        // Calculate range around current page
        const rangeStart = Math.max(2, currentPage - delta);
        const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

        // Add ellipsis before range if needed
        if (rangeStart > 2) {
            pages.push("ellipsis");
        }

        // Add pages in range
        for (let i = rangeStart; i <= rangeEnd; i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        // Add ellipsis after range if needed
        if (rangeEnd < totalPages - 1) {
            pages.push("ellipsis");
        }

        // Always show last page
        if (totalPages > 1 && !pages.includes(totalPages)) {
            pages.push(totalPages);
        }

        return pages;
    };

    /**
     * Handle page change with smooth scroll
     */
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;

        onPageChange(page);

        // Smooth scroll to top of grid
        setTimeout(() => {
            if (scrollToId) {
                const element = document.getElementById(scrollToId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }, 100);
    };

    const pageNumbers = getPageNumbers();

    return (
        <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center justify-center gap-1 sm:gap-2 mt-12 mb-8"
            aria-label="Pagination"
        >
            {/* Previous Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all duration-200 shadow-sm"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === "ellipsis") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 py-2 text-slate-400 select-none"
                            >
                                ···
                            </span>
                        );
                    }

                    const isActive = page === currentPage;

                    return (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            disabled={isActive}
                            className={`
                                min-w-[40px] h-10 px-3 text-sm font-semibold rounded-xl transition-all duration-200
                                ${isActive
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 cursor-default"
                                    : "bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 shadow-sm"
                                }
                            `}
                            aria-label={`Page ${page}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all duration-200 shadow-sm"
                aria-label="Next page"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </motion.nav>
    );
}
