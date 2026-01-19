/**
 * REUSABLE ARTICLE PUBLISHER
 * Usage: node scripts/publish-draft.js "path/to/draft.json"
 * 
 * This script takes a JSON file containing:
 * {
 *   "title": "...",
 *   "slug": "...",
 *   "excerpt": "...",
 *   "content": "...",
 *   "category_tag": "...",
 *   "related_product_ids": ["uuid1", "uuid2", ...]
 * }
 * 
 * It automatically:
 * 1. Validates all product images
 * 2. Selects the first valid image as the Cover Image
 * 3. Publishes to Supabase
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkImage(url) {
    if (!url) return false;
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (e) {
        return false;
    }
}

async function publishDraft() {
    const draftPath = process.argv[2];
    if (!draftPath) {
        console.error('❌ Please provide a draft JSON path');
        process.exit(1);
    }

    const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
    console.log(`🚀 Publishing: ${draft.title}`);

    // 1. Fetch related products to get images
    const { data: products } = await supabase
        .from('products')
        .select('id, title, image_url')
        .in('id', draft.related_product_ids);

    if (!products || products.length === 0) {
        console.error('❌ No related products found in DB');
        process.exit(1);
    }

    // 2. Select Cover Image (Find first working image)
    let coverImage = null;
    console.log('🔍 Validating images for cover...');

    for (const p of products) {
        const isValid = await checkImage(p.image_url);
        if (isValid) {
            console.log(`   ✅ Selected cover: ${p.title} (${p.image_url.substring(0, 30)}...)`);
            coverImage = p.image_url;
            break;
        } else {
            console.log(`   ❌ Broken image: ${p.title}`);
        }
    }

    if (!coverImage) {
        console.warn('⚠️ No valid images found. Publishing without cover.');
    }

    // 3. Insert Article
    const { data, error } = await supabase
        .from('articles')
        .insert([{
            title: draft.title,
            slug: draft.slug,
            excerpt: draft.excerpt,
            content: draft.content,
            category_tag: draft.category_tag,
            related_products: draft.related_product_ids,
            cover_image: coverImage,
            is_published: true,
            published_at: new Date().toISOString()
        }])
        .select()
        .single();

    if (error) {
        console.error('❌ Error publishing:', error.message);
    } else {
        console.log('🎉 Published Successfully!');
        console.log(`🔗 http://localhost:3000/radar/${draft.slug}`);
    }
}

publishDraft();
