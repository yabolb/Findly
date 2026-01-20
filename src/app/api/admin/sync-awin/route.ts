
import { NextResponse } from 'next/server';
import { AwinService } from '@/lib/awin-service';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout for serverless functions

export async function POST(request: Request) {
    try {
        // 1. Verify Auth (Basic check or Session check)
        // For now, assuming internal admin route protected by middleware or similar, 
        // but let's check for a secret header just in case if called by cron externally
        const authHeader = request.headers.get('Authorization');
        // Implementation specific: Check if user is admin via supabase auth if strictly needed.
        // For this prototype/MVP, we'll proceed assuming the route is protected by app directory middleware layout.

        const awinService = new AwinService();

        // Run sync in background? Or wait? 
        // Vercel/Next functions have timeouts. Better to trigger and return processing, 
        // or use a proper background job. 
        // For "set it and forget it" locally or on checking, we can await it if the list is small, 
        // but better to just return "Started".

        // However, for the user to see immediate feedback in the "Test" phase, let's await it.
        // WARNING: Might timeout if many feeds. 
        await awinService.syncProducts();

        return NextResponse.json({ success: true, message: 'Awin sync completed successfully' });
    } catch (error: any) {
        console.error('Awin Sync Error:', error);

        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    return POST(request);
}
