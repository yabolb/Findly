import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConsentManager from "@/components/layout/ConsentManager";
import Footer from "@/components/layout/Footer";

// Optimized font loading with next/font
const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-heading',
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-body',
    display: 'swap',
});

export const metadata: Metadata = {
    title: "Findly - Find everything. Second-hand.",
    description: "Discover amazing second-hand items near you. Buy and sell with ease.",
    metadataBase: new URL('https://findly.com'),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} ${inter.variable}`}>
            <body className={`${inter.className} bg-background min-h-screen flex flex-col`} suppressHydrationWarning>
                {/* GDPR Consent Management */}
                <ConsentManager />

                <Navbar />

                <main className="flex-1">
                    {children}
                </main>

                <Footer />
            </body>
        </html>
    );
}

