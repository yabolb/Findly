"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

interface ArticleContentProps {
    content: string;
    productIds: string[];
}

/**
 * ArticleContent Component
 * Renders article HTML with inline product embeds
 * 
 * Usage in article content:
 * - [PRODUCT:0] - First selected product
 * - [PRODUCT:1] - Second selected product
 * - [PRODUCT:2] - Third selected product
 * etc.
 */
export default function ArticleContent({ content, productIds }: ArticleContentProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [contentParts, setContentParts] = useState<Array<{ type: 'html' | 'product'; value: string | number }>>([]);

    useEffect(() => {
        async function fetchProducts() {
            if (!productIds || productIds.length === 0) {
                setLoading(false);
                parseContent([]);
                return;
            }

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .in('id', productIds);

            if (error) {
                console.error('Error fetching products:', error);
                parseContent([]);
            } else {
                // Sort products to match the order in productIds
                const sortedProducts = productIds.map(id =>
                    data.find(p => p.id === id)
                ).filter(Boolean) as Product[];

                setProducts(sortedProducts);
                parseContent(sortedProducts);
            }

            setLoading(false);
        }

        fetchProducts();
    }, [productIds, content]);

    const parseContent = (loadedProducts: Product[]) => {
        // Split content by product placeholders [PRODUCT:N]
        const regex = /\[PRODUCT:(\d+)\]/g;
        const parts: Array<{ type: 'html' | 'product'; value: string | number }> = [];

        let lastIndex = 0;
        let match;

        while ((match = regex.exec(content)) !== null) {
            // Add HTML before this match
            if (match.index > lastIndex) {
                parts.push({
                    type: 'html',
                    value: content.slice(lastIndex, match.index),
                });
            }

            // Add product reference
            const productIndex = parseInt(match[1], 10);
            parts.push({
                type: 'product',
                value: productIndex,
            });

            lastIndex = match.index + match[0].length;
        }

        // Add remaining HTML
        if (lastIndex < content.length) {
            parts.push({
                type: 'html',
                value: content.slice(lastIndex),
            });
        }

        setContentParts(parts);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="article-content">
            {contentParts.map((part, index) => {
                if (part.type === 'html') {
                    return (
                        <div
                            key={index}
                            className="prose prose-lg max-w-none
                                prose-headings:font-heading prose-headings:font-bold prose-headings:text-text-main
                                prose-p:text-text-main/80 prose-p:leading-relaxed prose-p:text-lg
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-text-main prose-strong:font-semibold
                                prose-ul:text-text-main/80 prose-ol:text-text-main/80
                                prose-li:text-lg prose-li:leading-relaxed
                                prose-img:rounded-2xl prose-img:shadow-md"
                            dangerouslySetInnerHTML={{ __html: part.value as string }}
                        />
                    );
                } else {
                    // Product embed
                    const productIndex = part.value as number;
                    const product = products[productIndex];

                    if (!product) {
                        return (
                            <div key={index} className="my-6 p-4 bg-gray-100 rounded-2xl text-center text-gray-500 text-sm">
                                Producto no disponible
                            </div>
                        );
                    }

                    return (
                        <div key={index} className="my-8 max-w-md mx-auto">
                            <ProductCard product={product} />
                        </div>
                    );
                }
            })}
        </div>
    );
}
