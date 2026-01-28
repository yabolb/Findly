import { sendGAEvent } from '@next/third-parties/google';

declare global {
    interface Window {
        Cookiebot?: {
            consent: {
                statistics: boolean;
                marketing: boolean;
                preferences: boolean;
                necessary: boolean;
            };
        };
    }
}

export const sendEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window === 'undefined') return;

    // Check for Cookiebot consent (statistics or marketing usually required for GA)
    // We strictly check 'statistics' as per common compliance for analytics.
    const hasConsent = window.Cookiebot?.consent?.statistics;

    if (hasConsent) {
        sendGAEvent('event', eventName, params || {});
    } else {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Analytics] Event '${eventName}' skipped due to missing consent.`);
        }
    }
};
