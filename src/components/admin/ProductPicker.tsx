"use client";

import { useState, useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

interface ProductPickerProps {
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
}

const PRODUCTS_PER_PAGE = 12;

/**
 * ProductPicker Component
 * Paginated list of all products with selection capability
 */
export default function ProductPicker({ selectedIds, onSelectionChange }: ProductPickerProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

    // Fetch products on mount and page change
    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    const fetchProducts = async () => {
        setLoading(true);

        const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const to = from + PRODUCTS_PER_PAGE - 1;

        // Get total count
        const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        setTotalCount(count || 0);

        // Get paginated products
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error('Error fetching products:', error);
        } else {
            setProducts(data as Product[]);
        }

        setLoading(false);
    };

    const toggleProduct = (productId: string) => {
        if (selectedIds.includes(productId)) {
            onSelectionChange(selectedIds.filter(id => id !== productId));
        } else {
            onSelectionChange([...selectedIds, productId]);
        }
    };

    const isSelected = (productId: string) => selectedIds.includes(productId);

    return (
        <div className="space-y-4">
            {/* Selected count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-text-main/60">
                    {selectedIds.length} producto{selectedIds.length !== 1 ? 's' : ''} seleccionado{selectedIds.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-text-main/60">
                    {totalCount} productos disponibles
                </p>
            </div>

            {/* Loading state */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-xl h-40 animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    {/* Products Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {products.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => toggleProduct(product.id)}
                                className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 text-left ${isSelected(product.id)
                                    ? 'border-primary ring-2 ring-primary/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {/* Selection indicator */}
                                {isSelected(product.id) && (
                                    <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                {/* Product Image */}
                                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl">
                                            🎁
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-2">
                                    <p className="text-xs font-medium text-text-main line-clamp-2 leading-tight">
                                        {product.title}
                                    </p>
                                    <p className="text-xs text-primary font-semibold mt-1">
                                        {product.price.toFixed(2)}€
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-1">
                                {/* First page */}
                                {currentPage > 3 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(1)}
                                            className="w-8 h-8 rounded-lg text-sm hover:bg-gray-100"
                                        >
                                            1
                                        </button>
                                        {currentPage > 4 && <span className="px-1">...</span>}
                                    </>
                                )}

                                {/* Page numbers around current */}
                                {[...Array(5)].map((_, i) => {
                                    const page = currentPage - 2 + i;
                                    if (page < 1 || page > totalPages) return null;
                                    return (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-lg text-sm ${page === currentPage
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                {/* Last page */}
                                {currentPage < totalPages - 2 && (
                                    <>
                                        {currentPage < totalPages - 3 && <span className="px-1">...</span>}
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(totalPages)}
                                            className="w-8 h-8 rounded-lg text-sm hover:bg-gray-100"
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Selected Products Summary with Placeholder Codes */}
            {selectedIds.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-text-main">
                            📝 Productos seleccionados (en orden):
                        </p>
                        <p className="text-xs text-text-main/50">
                            Usa estos códigos en el contenido
                        </p>
                    </div>

                    <div className="space-y-2">
                        {selectedIds.map((id, index) => {
                            const product = products.find(p => p.id === id);
                            const placeholder = `[PRODUCT:${index}]`;

                            return (
                                <div
                                    key={id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                                >
                                    {/* Order number */}
                                    <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                                        {index}
                                    </div>

                                    {/* Product image */}
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                        {product?.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product?.title || ''}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl">🎁</div>
                                        )}
                                    </div>

                                    {/* Product info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text-main truncate">
                                            {product?.title || 'Producto no encontrado'}
                                        </p>
                                        <p className="text-xs text-primary font-medium">
                                            {product?.price?.toFixed(2)}€
                                        </p>
                                    </div>

                                    {/* Placeholder code */}
                                    <code
                                        className="px-3 py-1.5 bg-slate-800 text-green-400 text-xs font-mono rounded-lg cursor-pointer hover:bg-slate-700 transition-colors flex-shrink-0"
                                        onClick={() => {
                                            navigator.clipboard.writeText(placeholder);
                                            alert('¡Código copiado!');
                                        }}
                                        title="Clic para copiar"
                                    >
                                        {placeholder}
                                    </code>

                                    {/* Remove button */}
                                    <button
                                        type="button"
                                        onClick={() => toggleProduct(id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                        title="Eliminar"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <p className="text-xs text-text-main/50 mt-3">
                        💡 Copia el código y pégalo en el contenido donde quieras mostrar el producto
                    </p>
                </div>
            )}
        </div>
    );
}
