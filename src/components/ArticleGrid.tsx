"use client";

import { Article } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArticleGridProps {
    articles: Article[];
}

/**
 * ArticleGrid Component
 * Displays articles in a clean masonry/grid layout
 * Using casual-tech rounded style (rounded-3xl)
 */
export default function ArticleGrid({ articles }: ArticleGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
                <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Link href={`/radar/${article.slug}`}>
                        <article className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                            {/* Cover Image */}
                            {article.cover_image && (
                                <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                                    <Image
                                        src={article.cover_image}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                {/* Title */}
                                <h2 className="font-heading text-xl font-bold text-text-main mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                    {article.title}
                                </h2>

                                {/* Excerpt */}
                                <p className="text-text-main/60 text-sm mb-4 line-clamp-3 flex-1">
                                    {article.excerpt}
                                </p>

                                {/* Meta Information */}
                                <div className="flex items-center gap-4 text-xs text-text-main/40">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>
                                            {new Date(article.published_at).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    {article.view_count > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>{article.view_count} vistas</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
