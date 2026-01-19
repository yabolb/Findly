/**
 * Fix Article Cover Image
 * Rule: Ensure cover image is not broken checking HTTP status.
 * If broken, rotate to next available product image.
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

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

async function fixArticleCover() {
    const slug = 'regalos-esenciales-estrenar-casa-2026';

    console.log(`🔍 Checking article: ${slug}`);

    // 1. Get Article and its related products
    const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !article) {
        console.error('❌ Article not found');
        return;
    }

    console.log(`   Current Cover: ${article.cover_image}`);

    // Check if current cover is broken
    const isCurrentValid = await checkImage(article.cover_image);
    if (isCurrentValid) {
        console.log('✅ Current cover image is VALID. No change needed.');
        return;
    }

    console.log('❌ Current cover image is BROKEN. Searching for alternative...');

    // 2. Fetch related products
    // The article stores related_products as an array of IDs (UUIDs)
    if (!article.related_products || article.related_products.length === 0) {
        console.log('⚠️ No related products found to pick image from.');
        return;
    }

    const { data: products } = await supabase
        .from('products')
        .select('id, title, image_url')
        .in('id', article.related_products);

    // 3. Find first valid image
    let newCoverImage = null;
    let newCoverSource = '';

    for (const product of products) {
        console.log(`   Checking product: ${product.title.substring(0, 30)}...`);
        const isValid = await checkImage(product.image_url);

        if (isValid) {
            console.log('   ✅ Valid image found!');
            newCoverImage = product.image_url;
            newCoverSource = product.title;
            break;
        } else {
            console.log('   ❌ Broken image.');
        }
    }

    // 4. Update Article
    if (newCoverImage) {
        const { error: updateError } = await supabase
            .from('articles')
            .update({ cover_image: newCoverImage })
            .eq('id', article.id);

        if (updateError) {
            console.error('Error updating article:', updateError);
        } else {
            console.log('🎉 Article updated successfully!');
            console.log(`   New Cover Source: ${newCoverSource}`);
            console.log(`   New URL: ${newCoverImage}`);
        }
    } else {
        console.log('⚠️ Could not find ANY valid image among related products.');
    }
}

fixArticleCover();
