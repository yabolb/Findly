/**
 * Article Service - "El Radar del Regalo Perfecto"
 * Handles fetching and managing content marketing articles
 */

import { supabase } from '@/lib/supabase';
import { Article } from '@/types';

/**
 * Fetch all published articles
 */
export async function getPublishedArticles(limit?: number): Promise<Article[]> {
    let query = supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching articles:', error);
        return [];
    }

    return data as Article[];
}

/**
 * Fetch a single article by slug (includes unpublished for preview)
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching article:', error);
        return null;
    }

    // Increment view count only for published articles
    if (data && data.is_published) {
        await incrementArticleViews(data.id);
    }

    return data as Article;
}

/**
 * Increment article view count
 */
async function incrementArticleViews(articleId: string): Promise<void> {
    await supabase.rpc('increment_article_views', { article_id: articleId });
}

/**
 * Fetch articles by category
 */
export async function getArticlesByCategory(category: string, limit?: number): Promise<Article[]> {
    let query = supabase
        .from('articles')
        .select('*')
        .eq('category_tag', category)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching articles by category:', error);
        return [];
    }

    return data as Article[];
}

/**
 * Create a new article (admin only)
 */
export async function createArticle(article: Partial<Article>): Promise<{ data: Article | null; error: any }> {
    const { data, error } = await supabase
        .from('articles')
        .insert([article])
        .select()
        .single();

    return { data: data as Article | null, error };
}

/**
 * Update an existing article (admin only)
 */
export async function updateArticle(id: string, updates: Partial<Article>): Promise<{ data: Article | null; error: any }> {
    const { data, error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    return { data: data as Article | null, error };
}

/**
 * Search articles by title or content
 */
export async function searchArticles(query: string): Promise<Article[]> {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order('published_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error searching articles:', error);
        return [];
    }

    return data as Article[];
}
