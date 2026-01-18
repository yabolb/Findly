/**
 * ADMIN API ROUTE: Populate Products from Amazon
 * 
 * POST /api/admin/populate-amazon
 * 
 * This route fetches products from Amazon PA-API and stores them in Supabase.
 * It requires Amazon PA-API credentials to be configured.
 * 
 * Request Body:
 * {
 *   "keywords": "wireless headphones", // Search query
 *   "maxResults": 10,                  // Number of products to fetch
 *   "category": "tech-electronics"     // Optional: Override automatic category mapping
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "productsAdded": 10,
 *   "products": [...]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchAmazonProducts, isAmazonAPIConfigured } from '@/lib/amazon-paapi';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        // Check if Amazon API is configured
        if (!isAmazonAPIConfigured()) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Amazon PA-API not configured',
                    message: 'Add AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, and AMAZON_ASSOCIATE_TAG to your .env.local file',
                },
                { status: 503 } // Service Unavailable
            );
        }

        // Parse request body
        const body = await request.json();
        const { keywords, maxResults = 10, category } = body;

        if (!keywords) {
            return NextResponse.json(
                { success: false, error: 'Missing required field: keywords' },
                { status: 400 }
            );
        }

        // Fetch products from Amazon
        console.log(`Fetching ${maxResults} products for: "${keywords}"`);
        const amazonProducts = await searchAmazonProducts(keywords, maxResults);

        if (amazonProducts.length === 0) {
            return NextResponse.json({
                success: true,
                productsAdded: 0,
                message: 'No products found for this search',
            });
        }

        // Transform and insert into Supabase
        const productsToInsert = amazonProducts.map((product) => ({
            title: product.title,
            description: product.description || `${product.title} disponible en Amazon`,
            price: product.price,
            currency: product.currency,
            image_url: product.imageUrl,
            source_url: product.affiliateUrl,
            platform: 'amazon',
            category: category || product.category, // Use override if provided
            location: 'España', // Default location
            condition: 'new',
            // Store ASIN in a JSON metadata field for future reference/updates
            // (Adjust based on your actual schema)
        }));

        const { data, error } = await supabase
            .from('products')
            .insert(productsToInsert)
            .select();

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Database error',
                    details: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            productsAdded: data?.length || 0,
            products: data,
            message: `Successfully added ${data?.length || 0} products from Amazon`,
        });
    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Internal server error',
            },
            { status: 500 }
        );
    }
}

// GET: Check if Amazon API is configured
export async function GET() {
    const configured = isAmazonAPIConfigured();

    return NextResponse.json({
        configured,
        message: configured
            ? 'Amazon PA-API is configured and ready'
            : 'Amazon PA-API credentials missing. Add them to .env.local to enable product imports.',
        requiredEnvVars: [
            'AMAZON_ACCESS_KEY',
            'AMAZON_SECRET_KEY',
            'AMAZON_ASSOCIATE_TAG',
        ],
    });
}
