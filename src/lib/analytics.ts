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

    // Check for Cookiebot consent if available.
    // If Cookiebot object is missing (loading delay, dev env, blockers), we default to sending
    // and let the underlying Google Tag (Consent Mode) handle the compliance/blocking logic.
    const cookiebot = window.Cookiebot;
    const hasConsent = cookiebot ? cookiebot.consent?.statistics : true;

    if (hasConsent) {
        sendGAEvent('event', eventName, params || {});
    } else {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`[Analytics] Event '${eventName}' skipped: User strictly denied analytics consent.`);
        }
    }
};
