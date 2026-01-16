import Link from "next/link";
import { CATEGORY_LABELS, Category } from "@/types";

/**
 * Footer - SEO Power-Footer with Internal Linking Hub
 * 
 * A comprehensive footer designed for pSEO (programmatic SEO) optimization.
 * Includes 4 columns: Categories, Popular Deals, Platforms, and Legal/Support.
 * 
 * SEO Benefits:
 * - Internal linking to boost crawlability
 * - Keyword-rich anchor text for popular searches
 * - Platform discovery links
 * - Legal compliance disclosures
 */
export default function Footer() {
    // All 13 categories from PRD
    const categories: Array<{ label: string; href: string }> = Object.entries(CATEGORY_LABELS).map(
        ([id, label]) => ({
            label,
            href: `/search?category=${id}`,
        })
    );

    // High-volume pSEO search terms
    const popularDeals = [
        { label: "iPhone second-hand", href: "/search?q=iphone" },
        { label: "Gravel Bikes", href: "/search?q=gravel+bikes&category=sports-leisure" },
        { label: "PS5 deals", href: "/search?q=ps5&category=tech-electronics" },
        { label: "Vintage Cameras", href: "/search?q=vintage+cameras&category=tech-electronics" },
        { label: "Designer Bags", href: "/search?q=designer+bags&category=fashion" },
        { label: "Mountain Bikes", href: "/search?q=mountain+bikes&category=sports-leisure" },
        { label: "Gaming PCs", href: "/search?q=gaming+pc&category=tech-electronics" },
        { label: "Vinyl Records", href: "/search?q=vinyl+records&category=movies-books-music" },
    ];

    // Platform browsing links
    const platforms = [
        { label: "Browse Wallapop", href: "/search?platform=wallapop" },
        { label: "Browse Vinted", href: "/search?platform=vinted" },
        { label: "Browse eBay", href: "/search?platform=ebay" },
        { label: "Browse Milanuncios", href: "/search?platform=milanuncios" },
    ];

    // Legal & Support links
    const legal = [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Notice and Takedown", href: "/takedown" },
        { label: "Contact Us", href: "/contact" },
        { label: "About Findly", href: "/about" },
    ];

    return (
        <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                {/* 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Column 1: Top Categories */}
                    <div>
                        <h3 className="font-heading font-bold text-text-main text-sm mb-4 uppercase tracking-wide">
                            Top Categories
                        </h3>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.href}>
                                    <Link
                                        href={category.href}
                                        className="text-sm text-slate-600 hover:text-primary transition-colors duration-150"
                                    >
                                        {category.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Popular Deals (pSEO) */}
                    <div>
                        <h3 className="font-heading font-bold text-text-main text-sm mb-4 uppercase tracking-wide">
                            Popular Deals
                        </h3>
                        <ul className="space-y-2">
                            {popularDeals.map((deal) => (
                                <li key={deal.href}>
                                    <Link
                                        href={deal.href}
                                        className="text-sm text-slate-600 hover:text-primary transition-colors duration-150"
                                    >
                                        {deal.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Platforms */}
                    <div>
                        <h3 className="font-heading font-bold text-text-main text-sm mb-4 uppercase tracking-wide">
                            Platforms
                        </h3>
                        <ul className="space-y-2">
                            {platforms.map((platform) => (
                                <li key={platform.href}>
                                    <Link
                                        href={platform.href}
                                        className="text-sm text-slate-600 hover:text-primary transition-colors duration-150"
                                    >
                                        {platform.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Legal & Support */}
                    <div>
                        <h3 className="font-heading font-bold text-text-main text-sm mb-4 uppercase tracking-wide">
                            Legal & Support
                        </h3>
                        <ul className="space-y-2">
                            {legal.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-slate-600 hover:text-primary transition-colors duration-150"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Compliance Disclosures */}
                <div className="border-t border-slate-200 pt-6 space-y-3">
                    {/* Source Attribution */}
                    <p className="text-xs text-slate-500 text-center">
                        <strong>Findly</strong> is an independent search engine. All listings belong to
                        their respective owners.
                    </p>

                    {/* Affiliate Disclosure */}
                    <p className="text-xs text-slate-500 text-center">
                        We may earn a commission from links on this site.
                    </p>

                    {/* Copyright */}
                    <p className="text-xs text-slate-400 text-center">
                        © {new Date().getFullYear()} Findly. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
