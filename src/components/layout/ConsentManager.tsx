"use client";

import Script from "next/script";

/**
 * ConsentManager - Professional GDPR Compliance via Cookiebot
 * 
 * This component injects the Cookiebot CMP (Consent Management Platform) script
 * to handle GDPR/CCPA compliance, cookie scanning, and consent banners.
 * 
 * Uses Next.js Script component with 'afterInteractive' strategy to ensure
 * the script loads after the page is interactive, preventing LCP degradation.
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_CMP_ID: Your Cookiebot domain group ID
 * 
 * Get your Cookiebot ID at: https://www.cookiebot.com
 */
export default function ConsentManager() {
    const cmpId = process.env.NEXT_PUBLIC_CMP_ID;

    // In development, show a notice if CMP ID is missing
    if (!cmpId && process.env.NODE_ENV === 'development') {
        console.warn(
            '⚠️  NEXT_PUBLIC_CMP_ID not set. Cookiebot consent banner will not appear.\n' +
            'Add NEXT_PUBLIC_CMP_ID to your .env.local file to enable GDPR compliance.'
        );
        return null;
    }

    // In production, fail silently if not configured
    if (!cmpId) {
        return null;
    }

    return (
        <>
            {/* Cookiebot CMP Script */}
            <Script
                id="cookiebot"
                src="https://consent.cookiebot.com/uc.js"
                data-cbid={cmpId}
                data-blockingmode="auto"
                strategy="afterInteractive"
                type="text/javascript"
            />

            {/* Cookiebot Declaration Script (optional - for cookie declaration page) */}
            <Script
                id="cookiebot-declaration"
                src="https://consent.cookiebot.com/uc.js"
                data-cbid={cmpId}
                data-culture="EN"
                strategy="lazyOnload"
                type="text/javascript"
            />
        </>
    );
}
