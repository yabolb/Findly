import { Metadata } from "next";
import { Suspense } from "react";
import SearchResultsPage from "@/components/SearchResults";
import { generatePageMetadata } from "@/lib/seo";
import { Category } from "@/types";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        category?: Category;
        location?: string;
    }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
    const params = await searchParams;
    const metadata = generatePageMetadata({
        query: params.q,
        category: params.category,
        location: params.location,
    });

    // Build canonical URL to prevent duplicate content
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://findly.com';
    const queryParts: string[] = [];
    if (params.q) queryParts.push(`q=${encodeURIComponent(params.q)}`);
    if (params.category) queryParts.push(`category=${params.category}`);
    if (params.location) queryParts.push(`location=${encodeURIComponent(params.location)}`);
    const canonical = `${baseUrl}/search${queryParts.length > 0 ? '?' + queryParts.join('&') : ''}`;

    return {
        title: metadata.title,
        description: metadata.description,
        keywords: metadata.keywords,
        alternates: {
            canonical,
        },
        openGraph: {
            title: metadata.ogTitle || metadata.title,
            description: metadata.ogDescription || metadata.description,
            type: "website",
            url: canonical,
        },
        twitter: {
            card: "summary_large_image",
            title: metadata.ogTitle || metadata.title,
            description: metadata.ogDescription || metadata.description,
        },
    };
}

function SearchPageFallback() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Loading search results...</p>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchPageFallback />}>
            <SearchResultsPage />
        </Suspense>
    );
}
