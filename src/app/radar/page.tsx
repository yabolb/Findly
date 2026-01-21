import { Metadata } from 'next';
import { Compass, TrendingUp } from 'lucide-react';
import { getPublishedArticles } from '@/services/article-service';
import ArticleGrid from '@/components/ArticleGrid';

export const metadata: Metadata = {
    title: 'El Radar del Regalo Perfecto | Findly',
    description: 'Inspiración diaria, tendencias y hallazgos para acertar siempre. Descubre ideas originales y consejos para regalar como un experto.',
    keywords: ['blog de regalos', 'ideas de regalo', 'tendencias', 'inspiración', 'guías de regalo'],
    alternates: {
        canonical: '/radar',
    },
    openGraph: {
        title: 'El Radar del Regalo Perfecto | Findly',
        description: 'Tendencias, guías y consejos para regalar.',
        url: '/radar',
        type: 'website',
    },
};

// export const revalidate = 0; // Disable ISR for now to force updates
export const dynamic = 'force-dynamic'; // Force dynamic rendering

export default async function RadarPage() {
    const articles = await getPublishedArticles();

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="pt-32 pb-12 px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-transparent">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                        <Compass className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            Contenido actualizado
                        </span>
                    </div>

                    <h1 className="font-heading text-5xl md:text-6xl font-bold text-text-main mb-6">
                        El Radar del Regalo Perfecto
                    </h1>

                    <p className="text-xl md:text-2xl text-text-main/60 max-w-3xl mx-auto mb-8 font-light">
                        Inspiración diaria, tendencias y hallazgos para acertar siempre.
                    </p>

                    <div className="flex items-center justify-center gap-2 text-text-main/50">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-sm">
                            {articles.length} artículos disponibles
                        </span>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-12 px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {articles.length > 0 ? (
                        <ArticleGrid articles={articles} />
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-text-main/50 text-lg">
                                Próximamente: artículos inspiradores sobre regalos y tendencias.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
