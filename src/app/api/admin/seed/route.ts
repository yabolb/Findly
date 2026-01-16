import { NextRequest, NextResponse } from 'next/server';
import { seedDemoProducts } from '@/scripts/seed-products';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * ADMIN SEED API
 * ==============
 * Protected endpoint to seed demo products into the database
 * Requires admin password authentication
 */

export async function POST(request: NextRequest) {
    try {
        // Get admin password from request
        const authHeader = request.headers.get('authorization');
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json(
                { success: false, error: 'Admin password not configured' },
                { status: 500 }
            );
        }

        // Verify authentication
        const providedPassword = authHeader?.replace('Bearer ', '');
        if (providedPassword !== adminPassword) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json().catch(() => ({}));
        const limit = body.limit || 150;
        const clearExisting = body.clear === true;

        // Clear existing demo products if requested
        if (clearExisting) {
            const { error } = await supabaseAdmin
                .from('products')
                .delete()
                .eq('is_demo', true);

            if (error) {
                return NextResponse.json(
                    { success: false, error: `Failed to clear demo products: ${error.message}` },
                    { status: 500 }
                );
            }
        }

        // Seed products
        const result = await seedDemoProducts(limit);

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${result.inserted} demo products`,
            inserted: result.inserted,
            total: result.total,
            clearedExisting: clearExisting,
        });

    } catch (error) {
        console.error('Seed API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed products' },
            { status: 500 }
        );
    }
}

// GET endpoint to check demo product stats
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json(
                { success: false, error: 'Admin password not configured' },
                { status: 500 }
            );
        }

        const providedPassword = authHeader?.replace('Bearer ', '');
        if (providedPassword !== adminPassword) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Count demo and real products
        const { count: demoCount } = await supabaseAdmin
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('is_demo', true);

        const { count: realCount } = await supabaseAdmin
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('is_demo', false);

        return NextResponse.json({
            success: true,
            demoProducts: demoCount || 0,
            realProducts: realCount || 0,
            totalProducts: (demoCount || 0) + (realCount || 0),
        });

    } catch (error) {
        console.error('Seed stats error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get stats' },
            { status: 500 }
        );
    }
}
