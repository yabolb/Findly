"use client";

import { useState, useEffect, Suspense, useTransition, Fragment } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, Category, BudgetRange, CATEGORY_LABELS, BUDGET_LABELS, BUDGET_LIMITS } from '@/types';
import ProductCard from '@/components/ProductCard';
import InlineQuizMagnet from '@/components/InlineQuizMagnet';
import { Search, Filter, X, ChevronLeft, ChevronRight, SlidersHorizontal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CatalogViewProps {
    initialProducts: Product[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

export default function CatalogView({ initialProducts, totalCount, currentPage, totalPages }: CatalogViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Local state for UI
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentQ = searchParams.get('q') || '';
            if (searchQuery !== currentQ) {
                updateFilters({ q: searchQuery, page: 1 });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Update URL with new filters
    const updateFilters = (updates: Record<string, string | number | null>, options: { scroll?: boolean } = {}) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '' || value === 0) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        // Reset to page 1 if not explicitly changing page
        if (!updates.page && updates.page !== 1) {
            params.set('page', '1');
        }

        const shouldScroll = options.scroll ?? false;

        startTransition(() => {
            router.push(`/all-gifts?${params.toString()}`, { scroll: shouldScroll });
        });
    };

    const currentCategory = searchParams.get('category') as Category | null;
    const currentMinPrice = searchParams.get('min_price');
    const currentMaxPrice = searchParams.get('max_price');

    // Helper to determine active budget range
    const getActiveBudget = () => {
        if (!currentMinPrice && !currentMaxPrice) return null;
        const min = Number(currentMinPrice || 0);
        const max = Number(currentMaxPrice || 999999);

        return Object.entries(BUDGET_LIMITS).find(([_, limit]) =>
            limit.min === min && limit.max === max
        )?.[0] as BudgetRange | undefined;
    };

    const activeBudget = getActiveBudget();

    const handleBudgetChange = (range: BudgetRange | null) => {
        if (!range) {
            updateFilters({ min_price: null, max_price: null });
            return;
        }
        const limit = BUDGET_LIMITS[range];
        updateFilters({ min_price: limit.min, max_price: limit.max });
    };

    const clearFilters = () => {
        setSearchQuery('');
        router.push('/all-gifts');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-20 md:pt-24">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-16 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="font-heading text-2xl font-bold text-gray-900">
                            Explora todos nuestros regalos
                        </h1>

                        <div className="flex items-center gap-3 flex-1 md:max-w-xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar regalos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <select
                                value={searchParams.get('sort') || 'recientes'}
                                onChange={(e) => updateFilters({ sort: e.target.value })}
                                className="hidden md:block px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                            >
                                <option value="recientes">Más recientes</option>
                                <option value="price_asc">Precio: Menor a Mayor</option>
                                <option value="price_desc">Precio: Mayor a Menor</option>
                            </select>

                            <button
                                onClick={() => setIsMobileFiltersOpen(true)}
                                className="md:hidden p-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200"
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Active Filters Row (Desktop) */}
                    <div className="hidden md:flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                        {currentCategory && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                                {CATEGORY_LABELS[currentCategory]}
                                <button onClick={() => updateFilters({ category: null })} className="hover:text-primary/70">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {activeBudget && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                {BUDGET_LABELS[activeBudget]}
                                <button onClick={() => updateFilters({ min_price: null, max_price: null })} className="hover:text-green-800">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {(currentCategory || activeBudget || searchQuery) && (
                            <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-900 underline">
                                Limpiar todo
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden md:block w-64 flex-shrink-0 space-y-8 h-fit sticky top-32">
                        {/* Categories */}
                        <div>
                            <h3 className="font-heading font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Categorías
                            </h3>
                            <div className="space-y-2">
                                {/* Sort categories alphabetically or logically if preferred. Using object keys order for now. */}
                                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => updateFilters({ category: currentCategory === key ? null : key })}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentCategory === key
                                            ? 'bg-primary text-white font-medium shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget */}
                        <div>
                            <h3 className="font-heading font-semibold text-gray-900 mb-4">Presupuesto</h3>
                            <div className="space-y-2">
                                {Object.entries(BUDGET_LABELS).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleBudgetChange(activeBudget === key ? null : key as BudgetRange)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeBudget === key
                                            ? 'bg-green-100 text-green-800 font-medium border border-green-200'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        {totalCount === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No encontramos resultados</h3>
                                <p className="text-gray-500 mb-6">Prueba a ajustar tus filtros o busca otra cosa.</p>
                                <button onClick={clearFilters} className="text-primary font-semibold hover:underline">
                                    Ver todos los regalos
                                </button>
                            </div>
                        ) : (
                            <div className={`transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                    {initialProducts.map((product, index) => {
                                        // Inject Magnet after the 6th item (index 5)
                                        // We use Fragment to key properly if needed, though map index is stable here for this view.
                                        const showMagnet = index === 5;

                                        return (
                                            <Fragment key={product.id}>
                                                <ProductCard product={product} />
                                                {showMagnet && <InlineQuizMagnet />}
                                            </Fragment>
                                        );
                                    })}

                                    {/* Fallback if less than 6 items but we still want to show it? 
                                        Maybe not, only show inline if there's enough content. 
                                        Or checking if it's the last item and total items < 6? 
                                        Let's stick to index === 5 for now as per plan. 
                                    */}
                                </div>

                                {/* If we have very few products (e.g. < 6), show magnet at the bottom of grid */}
                                {initialProducts.length <= 5 && (
                                    <div className="mb-10">
                                        <InlineQuizMagnet />
                                    </div>
                                )}

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex flex-col items-center justify-center gap-4 mt-12 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateFilters({ page: currentPage - 1 }, { scroll: true })}
                                                disabled={currentPage <= 1}
                                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                aria-label="Anterior"
                                            >
                                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                                            </button>

                                            <div className="flex items-center gap-1 mx-2">
                                                {/* Page Numbers Logic */}
                                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                    .filter(page => {
                                                        // Show first, last, current, and adjacent pages
                                                        return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                                                    })
                                                    .map((page, index, array) => {
                                                        const showEllipsis = index > 0 && page - array[index - 1] > 1;
                                                        return (
                                                            <div key={page} className="flex items-center">
                                                                {showEllipsis && <span className="mx-1 text-gray-400">...</span>}
                                                                <button
                                                                    onClick={() => updateFilters({ page }, { scroll: true })}
                                                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                                        ? 'bg-primary text-white'
                                                                        : 'text-gray-600 hover:bg-gray-100'
                                                                        }`}
                                                                >
                                                                    {page}
                                                                </button>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>

                                            <button
                                                onClick={() => updateFilters({ page: currentPage + 1 }, { scroll: true })}
                                                disabled={currentPage >= totalPages}
                                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                aria-label="Siguiente"
                                            >
                                                <ChevronRight className="w-5 h-5 text-gray-600" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Mostrando {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalCount)} de {totalCount} resultados
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-80 bg-white z-50 shadow-2xl p-6 overflow-y-auto md:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-heading font-bold text-gray-900">Filtros</h2>
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Categorías</h3>
                                    <div className="space-y-2">
                                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                            <label key={key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={currentCategory === key}
                                                    onChange={() => {
                                                        updateFilters({ category: currentCategory === key ? null : key });
                                                        setIsMobileFiltersOpen(false);
                                                    }}
                                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm text-gray-700">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Presupuesto</h3>
                                    <div className="space-y-2">
                                        {Object.entries(BUDGET_LABELS).map(([key, label]) => (
                                            <label key={key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="mobile-budget"
                                                    checked={activeBudget === key}
                                                    onChange={() => {
                                                        handleBudgetChange(key as BudgetRange);
                                                        setIsMobileFiltersOpen(false);
                                                    }}
                                                    className="w-5 h-5 border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                                <span className="text-sm text-gray-700">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Ordenar por</h3>
                                    <select
                                        value={searchParams.get('sort') || 'recientes'}
                                        onChange={(e) => {
                                            updateFilters({ sort: e.target.value });
                                            setIsMobileFiltersOpen(false);
                                        }}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none"
                                    >
                                        <option value="recientes">Más recientes</option>
                                        <option value="price_asc">Precio: Menor a Mayor</option>
                                        <option value="price_desc">Precio: Mayor a Menor</option>
                                    </select>
                                </div>

                                <button
                                    onClick={clearFilters}
                                    className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

