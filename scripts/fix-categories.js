
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function recategorize() {
    console.log('🔍 Searching for miscategorized media in baby-kids...');

    // 1. Find products in baby-kids that should be music
    const { data: musicMistakes, error: error1 } = await supabase
        .from('products')
        .select('id, title')
        .eq('category', 'baby-kids')
        .or('title.ilike.%CD%,title.ilike.%Vinyl%,title.ilike.%Vinilo%,title.ilike.%Música%,title.ilike.%Music%,title.ilike.%Album%,title.ilike.%LP%');

    if (error1) {
        console.error('Error fetching music mistakes:', error1);
        return;
    }

    console.log(`🎵 Found ${musicMistakes?.length || 0} music products in baby-kids.`);

    if (musicMistakes && musicMistakes.length > 0) {
        const ids = musicMistakes.map(p => p.id);
        await supabase.from('products').update({ category: 'music' }).in('id', ids);
        console.log('✅ Moved to "music".');
    }

    // 2. Find games/movies
    const { data: movieMistakes, error: errorM } = await supabase
        .from('products')
        .select('id, title')
        .eq('category', 'baby-kids')
        .or('title.ilike.%DVD%,title.ilike.%Película%,title.ilike.%Blu-ray%');

    if (movieMistakes && movieMistakes.length > 0) {
        const ids = movieMistakes.map(p => p.id);
        await supabase.from('products').update({ category: 'movies' }).in('id', ids);
        console.log(`🎬 Moved ${movieMistakes.length} products to "movies".`);
    }

    // 2. Find products in baby-kids that should be books
    const { data: bookMistakes, error: error2 } = await supabase
        .from('products')
        .select('id, title')
        .eq('category', 'baby-kids')
        .or('title.ilike.% Libro %,title.ilike.% (Libro)%,title.ilike.% Novel %');

    if (error2) {
        console.error('Error fetching book mistakes:', error2);
        return;
    }

    console.log(`📚 Found ${bookMistakes?.length || 0} book products in baby-kids.`);

    if (bookMistakes && bookMistakes.length > 0) {
        const ids = bookMistakes.map(p => p.id);
        const { error: updateError } = await supabase
            .from('products')
            .update({ category: 'books' })
            .in('id', ids);

        if (updateError) console.error('Error updating books:', updateError);
        else console.log('✅ Successfully moved book products to "books" category.');
    }
}

recategorize().catch(console.error);
