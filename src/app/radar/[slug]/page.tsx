import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getArticleBySlug } from '@/services/article-service';
import QuizMagnet from '@/components/QuizMagnet';
import ArticleContent from '@/components/ArticleContent';
import { CATEGORY_LABELS } from '@/types';

interface ArticlePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export const revalidate = 3600; // Revalidate every hour

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return {
            title: 'Artículo no encontrado | Findly',
        };
    }

    const publishedTime = article.published_at ? new Date(article.published_at).toISOString() : undefined;

    return {
        title: `${article.title} | El Radar Findly`,
        description: article.excerpt,
        keywords: article.category_tag ? [CATEGORY_LABELS[article.category_tag], 'regalos', 'ideas'] : ['regalos'],
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            publishedTime,
            images: article.cover_image ? [article.cover_image] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: article.cover_image ? [article.cover_image] : [],
        },
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    const publishedDate = article.published_at ? new Date(article.published_at) : new Date();
    const updatedDate = article.updated_at ? new Date(article.updated_at) : new Date();

    // JSON-LD Schema for BlogPosting (Google Discover)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.excerpt,
        image: article.cover_image || '',
        datePublished: publishedDate.toISOString(),
        dateModified: updatedDate.toISOString(),
        author: {
            '@type': 'Organization',
            name: 'Findly',
            url: 'https://getfindly.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Findly',
            url: 'https://getfindly.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://getfindly.com/logo.png',
            },
        },
    };

    return (
        <>
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-background pb-24 lg:pb-12">
                {/* Draft Banner */}
                {!article.is_published && (
                    <div className="bg-yellow-50 border-b border-yellow-200 py-3 text-center">
                        <span className="text-yellow-800 font-medium text-sm">
                            ⚠️ Vista previa - Este artículo no está publicado
                        </span>
                    </div>
                )}

                {/* Back Button */}
                <div className="pt-24 px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <Link
                            href="/radar"
                            className="inline-flex items-center gap-2 text-text-main/60 hover:text-primary transition-colors mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Volver al Radar</span>
                        </Link>
                    </div>
                </div>

                {/* Article Header */}
                <article className="px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        {/* Category Tag */}
                        {article.category_tag && (
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                    {CATEGORY_LABELS[article.category_tag]}
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-main mb-6 leading-tight">
                            {article.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-text-main/50 mb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {publishedDate.toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{article.view_count} vistas</span>
                            </div>
                        </div>

                        {/* Cover Image */}
                        {article.cover_image && (
                            <div className="w-full h-96 rounded-3xl overflow-hidden mb-12 shadow-lg">
                                <img
                                    src={article.cover_image}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Article Content with Inline Products */}
                        <ArticleContent
                            content={article.content}
                            productIds={article.related_products || []}
                        />
                    </div>
                </article>

                {/* Quiz Magnet - Sticky Floating Banner */}
                <QuizMagnet />
            </main>
        </>
    );
}
