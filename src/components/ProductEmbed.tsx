"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

interface ProductEmbedProps {
    ids: string[];
}

/**
 * ProductEmbed Component
 * Embeds product cards inside article content
 * Allows users to click "Ver Regalo" (Amazon link) directly from blog posts
 */
export default function ProductEmbed({ ids }: ProductEmbedProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            if (!ids || ids.length === 0) {
                setLoading(false);
                return;
            }

            // Use the already imported supabase client
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .in('id', ids);

            if (error) {
                console.error('Error fetching embedded products:', error);
            } else {
                setProducts(data as Product[]);
            }

            setLoading(false);
        }

        fetchProducts();
    }, [ids]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
}
