import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConsentManager from "@/components/layout/ConsentManager";
import GoogleAnalytics from "@/components/GoogleAnalytics";
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
    title: "Findly - Tu Asesor de Regalos Inteligente",
    description: "Encuentra el regalo perfecto en 30 segundos. Recomendaciones personalizadas para cualquier ocasión. Sin listas genéricas, solo ideas pensadas para esa persona especial.",
    keywords: ["regalos personalizados", "ideas de regalo", "regalos España", "cuestionario de regalos", "regalos originales"],
    metadataBase: new URL('https://getfindly.com'),
    openGraph: {
        title: "Findly - Tu Asesor de Regalos Inteligente",
        description: "Encuentra el regalo perfecto en 30 segundos. Recomendaciones personalizadas para cualquier ocasión.",
        locale: "es_ES",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;

    return (
        <html lang="es" suppressHydrationWarning className={`${plusJakartaSans.variable} ${inter.variable}`}>
            <body className={`${inter.className} bg-background min-h-screen flex flex-col`} suppressHydrationWarning>
                {/* Google AdSense Script */}
                {adClient && (
                    <Script
                        id="adsbygoogle-init"
                        strategy="lazyOnload"
                        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
                        crossOrigin="anonymous"
                    />
                )}

                {/* GDPR Consent Management */}
                <ConsentManager />

                {/* Google Analytics */}
                <GoogleAnalytics />

                <Navbar />

                <main className="flex-1">
                    {children}
                </main>

                <Footer />
            </body>
        </html>
    );
}
