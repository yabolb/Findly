/**
 * ArticlePublisher.js
 * A reusable class to handle article generation and publishing logic.
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

class ArticlePublisher {
    constructor() {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Missing Supabase credentials in .env.local');
        }
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
    }

    /**
     * Checks if an image URL is valid (returns 200 OK)
     */
    async checkImage(url) {
        if (!url) return false;
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (e) {
            return false;
        }
    }

    /**
     * Finds products matching the given terms.
     * @param {string[]} productTerms - Array of search terms/titles.
     * @returns {Promise<Array>} - Array of found product objects.
     */
    async findProducts(productTerms) {
        const foundProducts = [];

        for (const term of productTerms) {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .ilike('title', `%${term}%`)
                .limit(1)
                .single();

            if (data) {
                console.log(`✅ Found product: ${data.title.substring(0, 40)}...`);
                foundProducts.push(data);
            } else {
                console.warn(`⚠️  Product not found for term: "${term}"`);
            }
        }
        return foundProducts;
    }

    /**
     * Selects a valid cover image from the list of products.
     */
    async selectCoverImage(products) {
        for (const p of products) {
            console.log(`🔍 Checking image for: ${p.title.substring(0, 30)}...`);
            if (await this.checkImage(p.image_url)) {
                console.log(`📸 Cover Image Selected: ${p.image_url}`);
                return p.image_url;
            }
        }
        console.warn("⚠️ No valid cover image found among products.");
        return null;
    }

    /**
     * Replaces [PRODUCT:Index] placeholders with actual product HTML.
     * In a real app, this might be a component reference, but here we keep it simple or strictly data.
     * For now, we will return the clean content ready for the frontend.
     */
    // The frontend currently expects [PRODUCT:ID] or just raw HTML. 
    // The previous scripts just used the placeholders strings like [PRODUCT:0].
    // We will keep that pattern as the frontend likely parses it.

    /**
     * Publishes the article to Supabase.
     */
    async publish({ title, slug, excerpt, category, content, productTerms }) {
        console.log(`🚀 Starting publication for: "${title}"`);

        // 1. Find Products
        const products = await this.findProducts(productTerms);

        if (products.length === 0) {
            throw new Error("No products found. Cannot publish article.");
        }

        const relatedIds = products.map(p => p.id);

        // 2. Select Cover Image
        const coverImage = await this.selectCoverImage(products);

        // 3. Construct Article Object
        const article = {
            title,
            slug,
            excerpt,
            category_tag: category,
            related_products: relatedIds,
            content,
            cover_image: coverImage,
            is_published: true,
            published_at: new Date().toISOString()
        };

        // 4. Insert into DB
        const { data, error } = await this.supabase
            .from('articles')
            .insert([article])
            .select()
            .single();

        if (error) {
            console.error('❌ Database Insert Error:', error.message);
            throw error;
        }

        console.log(`🎉 Article Published Successfully!`);
        console.log(`🔗 URL: http://localhost:3000/radar/${data.slug}`);
        return data;
    }
}

module.exports = ArticlePublisher;
