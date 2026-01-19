"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye } from 'lucide-react';
import { CATEGORY_LABELS, Category } from '@/types';
import ProductPicker from '@/components/admin/ProductPicker';

export default function NewArticlePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [categoryTag, setCategoryTag] = useState<Category | ''>('');
    const [relatedProducts, setRelatedProducts] = useState<string[]>([]);
    const [isPublished, setIsPublished] = useState(false);

    // Auto-generate slug from title
    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!slug) {
            const generatedSlug = value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setSlug(generatedSlug);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/admin/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    slug,
                    excerpt,
                    content,
                    cover_image: coverImage || null,
                    category_tag: categoryTag || null,
                    related_products: relatedProducts,
                    is_published: isPublished,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Error al crear el artículo');
            }

            setSuccess(true);

            // Redirect to the created article after a short delay
            setTimeout(() => {
                if (isPublished) {
                    router.push(`/radar/${slug}`);
                } else {
                    router.push('/radar');
                }
            }, 1500);

        } catch (err: any) {
            setError(err.message || 'Error al crear el artículo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background pt-24 pb-12 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-heading text-4xl font-bold text-text-main">
                        Nuevo Artículo - El Radar
                    </h1>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl mb-6">
                        ✅ Artículo creado correctamente. Redirigiendo...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            Título *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="10 Ideas para el Café..."
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            Slug (URL) *
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                            placeholder="regalos-para-amantes-del-cafe"
                        />
                        <p className="text-xs text-text-main/50 mt-1">
                            URL: /radar/{slug || 'tu-slug-aqui'}
                        </p>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            Extracto (Meta Description) *
                        </label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            required
                            rows={2}
                            maxLength={160}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            placeholder="Breve descripción para SEO (max 160 caracteres)"
                        />
                        <p className="text-xs text-text-main/50 mt-1">
                            {excerpt.length}/160 caracteres
                        </p>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            URL de Imagen de Portada
                        </label>
                        <input
                            type="url"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="https://..."
                        />
                    </div>

                    {/* Category Tag */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            Categoría
                        </label>
                        <select
                            value={categoryTag}
                            onChange={(e) => setCategoryTag(e.target.value as Category)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Sin categoría</option>
                            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            Contenido (HTML/Markdown) *
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={20}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm resize-none"
                            placeholder="<p>Contenido del artículo...</p>"
                        />
                        <p className="text-xs text-text-main/50 mt-1">
                            Usa HTML o Markdown. Para embeber productos usa: &lt;ProductEmbed ids=&#123;['uuid1', 'uuid2']&#125; /&gt;
                        </p>
                    </div>

                    {/* Product Picker */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            Productos Relacionados
                        </label>
                        <ProductPicker
                            selectedIds={relatedProducts}
                            onSelectionChange={setRelatedProducts}
                        />
                    </div>

                    {/* Publish Status */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is-published"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="is-published" className="text-sm font-medium text-text-main">
                            Publicar inmediatamente
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-full transition-all disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Guardando...' : 'Guardar Artículo'}
                        </button>

                        {slug && (
                            <a
                                href={`/radar/${slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-text-main font-semibold px-6 py-3 rounded-full transition-all"
                            >
                                <Eye className="w-5 h-5" />
                                Vista Previa
                            </a>
                        )}
                    </div>
                </form>
            </div>
        </main>
    );
}
