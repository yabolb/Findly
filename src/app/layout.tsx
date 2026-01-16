import type { Metadata } from "next";
import "./globals.css";
import "./globals.css";

export const metadata: Metadata = {
    title: "Findly - Find everything. Second-hand.",
    description: "Discover amazing second-hand items near you. Buy and sell with ease.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-background min-h-screen">
                {children}
            </body>
        </html>
    );
}
