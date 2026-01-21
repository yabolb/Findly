
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { CATEGORY_LABELS, Category } from '@/types';
import CatalogView from './CatalogView';
import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://findly.gift';

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const { category, q } = params;

    let title = 'Explora Ideas de Regalo | Findly';
    let description = 'Descubre nuestra selección completa de regalos originales para cualquier ocasión, presupuesto y persona. Filtra por categoría y encuentra el detalle perfecto.';
    let canonical = `${baseUrl}/all-gifts`;

    if (category && CATEGORY_LABELS[category as Category]) {
        title = `Regalos de ${CATEGORY_LABELS[category as Category]} | Findly`;
        description = `Encuentra los mejores regalos de ${CATEGORY_LABELS[category as Category].toLowerCase()}. Selección curada de ideas originales al mejor precio.`;
        canonical += `?category=${category}`;
    } else if (q) {
        title = `Resultados para "${q}" | Findly`;
        description = `Resultados de búsqueda para ${q}. Encuentra la idea perfecta.`;
        canonical += `?q=${encodeURIComponent(q)}`;
    }

    return {
        title,
        description,
        alternates: {
            canonical: canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            type: 'website',
            images: [
                {
                    url: '/og-image.png', // Ensure this exists or use a default
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    };
}

export const revalidate = 0; // Dynamic page for real-time filtering

interface PageProps {
    searchParams: Promise<{
        page?: string;
        q?: string;
        category?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
    }>;
}

export default async function AllGiftsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const query = params.q || '';
    const category = params.category;
    const minPrice = params.min_price ? Number(params.min_price) : undefined;
    const maxPrice = params.max_price ? Number(params.max_price) : undefined;
    const sort = params.sort;

    const pageSize = 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // const supabase = await createClient(); // Removed


    let dbQuery = supabase
        .from('products')
        .select('*', { count: 'exact' });

    // Apply Filters
    if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (category) {
        dbQuery = dbQuery.eq('category', category);
    }

    if (minPrice !== undefined) {
        dbQuery = dbQuery.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
        // Special case for "over 100" where max is very high
        if (maxPrice < 999999) {
            dbQuery = dbQuery.lte('price', maxPrice);
        } else {
            // If it's the open ended upper range, we technically just want >= 100 which is handled by minPrice.
            // But if specific max is set (e.g. filter 20-50), we need lte.
            // BUDGET_LIMITS['over-100'] uses min 100 max 999999.
            // So if maxPrice is 999999 we can skip lte or include it, doesn't matter much.
            dbQuery = dbQuery.lte('price', maxPrice);
        }
    }

    // Sorting
    switch (sort) {
        case 'price_asc':
            dbQuery = dbQuery.order('price', { ascending: true });
            break;
        case 'price_desc':
            dbQuery = dbQuery.order('price', { ascending: false });
            break;
        default: // 'recientes'
            dbQuery = dbQuery.order('created_at', { ascending: false });
            break;
    }

    // Pagination
    dbQuery = dbQuery.range(from, to);

    const { data: products, count, error } = await dbQuery;

    if (error) {
        console.error("Error fetching catalog:", error);
        // Handle error gracefully?
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando catálogo...</div>}>
            <CatalogView
                initialProducts={products || []}
                totalCount={totalCount}
                currentPage={page}
                totalPages={totalPages}
            />
        </Suspense>
    );
}
