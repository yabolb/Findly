"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdSenseUnitProps {
    slotId: string;
    format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
    layoutKey?: string;
    responsive?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

export default function AdSenseUnit({
    slotId,
    format = "auto",
    layoutKey,
    responsive = true,
    style,
    className = "",
}: AdSenseUnitProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const adRef = useRef<HTMLModElement>(null);
    const client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
    const isEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

    useEffect(() => {
        // Safe check for browser environment and enabled ads
        if (isEnabled && client && !isAdLoaded && adRef.current) {
            try {
                // Determine if this exact slot is already filled to prevent duplicates
                if (adRef.current.innerHTML === "") {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    setIsAdLoaded(true);
                }
            } catch (err) {
                console.error("AdSense error:", err);
            }
        }
    }, [pathname, searchParams, isAdLoaded, client, isEnabled]);

    // Show nothing if ads are disabled or client ID is missing
    if (!isEnabled || !client) return null;

    return (
        <div className={`adsense-container ${className}`} style={{ minHeight: "250px", width: "100%" }}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "block", ...style }}
                data-ad-client={client}
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive={responsive}
                data-ad-layout-key={layoutKey}
            />
        </div>
    );
}
