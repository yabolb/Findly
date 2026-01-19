import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role for admin operations (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
    try {
        // Check for admin auth cookie
        const authCookie = request.cookies.get('admin-auth');
        if (!authCookie || authCookie.value !== 'authenticated') {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const article = await request.json();

        // Validate required fields
        if (!article.title || !article.slug || !article.excerpt || !article.content) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Insert article using admin client
        const { data, error } = await supabaseAdmin
            .from('articles')
            .insert([{
                title: article.title,
                slug: article.slug,
                excerpt: article.excerpt,
                content: article.content,
                cover_image: article.cover_image || null,
                category_tag: article.category_tag || null,
                related_products: article.related_products || [],
                is_published: article.is_published || false,
                published_at: article.is_published ? new Date().toISOString() : null,
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating article:', error);
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
            message: 'Article created successfully',
        });

    } catch (error: any) {
        console.error('Article creation error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        // Check for admin auth cookie
        const authCookie = request.cookies.get('admin-auth');
        if (!authCookie || authCookie.value !== 'authenticated') {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch all articles (including unpublished) for admin
        const { data, error } = await supabaseAdmin
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred' },
            { status: 500 }
        );
    }
}
