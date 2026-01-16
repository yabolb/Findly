import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Get admin password from environment variable
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json(
                { success: false, message: "Admin password not configured" },
                { status: 500 }
            );
        }

        // Validate password
        if (password === adminPassword) {
            // Create response with success
            const response = NextResponse.json({
                success: true,
                message: "Authentication successful",
            });

            // Set authentication cookie (expires in 7 days)
            response.cookies.set("admin-auth", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: "/",
            });

            return response;
        } else {
            return NextResponse.json(
                { success: false, message: "Invalid password" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, message: "An error occurred" },
            { status: 500 }
        );
    }
}
