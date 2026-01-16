import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Takedown API Route
 * 
 * Handles DMCA/legal takedown requests for Safe Harbor protection.
 * Validates, logs, and stores removal requests in the database.
 * 
 * POST /api/takedown
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { listingUrl, reporterName, reporterEmail, reason } = body;

        // Validation
        if (!listingUrl || !reporterName || !reporterEmail || !reason) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(reporterEmail)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // URL validation
        try {
            new URL(listingUrl);
        } catch {
            return NextResponse.json(
                { error: "Invalid listing URL" },
                { status: 400 }
            );
        }

        // Reason length validation
        if (reason.length < 50) {
            return NextResponse.json(
                { error: "Reason must be at least 50 characters" },
                { status: 400 }
            );
        }

        // Capture metadata
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";

        // Create Supabase client
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        // Insert takedown request into database
        const { data, error } = await supabase
            .from("takedown_requests")
            .insert({
                listing_url: listingUrl,
                reporter_name: reporterName,
                reporter_email: reporterEmail,
                reason: reason,
                ip_address: ipAddress,
                user_agent: userAgent,
                status: "pending",
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json(
                { error: "Failed to submit takedown request. Please try again." },
                { status: 500 }
            );
        }

        // TODO: Send email notification to admin (optional enhancement)
        // await sendTakedownNotificationEmail({ ...data });

        console.log("✅ Takedown request submitted:", data.id);

        return NextResponse.json(
            {
                success: true,
                message: "Takedown request submitted successfully",
                requestId: data.id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Takedown API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Reject other HTTP methods
export async function GET() {
    return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
    );
}
