/**
 * MULTI-PLATFORM SCRAPER SERVICE
 * ===============================
 * PRD Section 5.2: Data Ingestion - Real-time scraping for 4 platforms
 * 
 * Platforms:
 * - Wallapop (via ScrapingBee residential proxy)
 * - Vinted (via ScrapingBee residential proxy)
 * - eBay.es (via eBay Browse API + fallback scraper)
 * - Milanuncios (via high-quality residential proxy)
 */

import { Product, Platform, Category, ProductCondition, PriceScore } from "@/types";
import { proxyManager, ProxyResponse } from "./proxy-service";
import { normalizeProduct, normalizeCategory, normalizeCondition, normalizePrice } from "@/lib/mappers";
import { PLATFORMS_CONFIG, getPlatformConfig, buildSearchUrl } from "@/config/platforms";
import { ScrapeResult, BanDetectionService, SyncLogService } from "./scraperService";
import { v4 as uuidv4 } from "uuid";

// ============================================
// PLATFORM-SPECIFIC SCRAPERS
// ============================================

/**
 * Wallapop Scraper - Uses API endpoint via residential proxy
 */
export class WallapopAdvancedScraper {
    private readonly platform: Platform = "wallapop";
    private readonly apiUrl = "https://api.wallapop.com/api/v3/general/search";

    async search(query: string, category?: Category): Promise<ScrapeResult> {
        const startTime = Date.now();
        const config = getPlatformConfig(this.platform)!;

        try {
            // Build API URL with parameters
            // Build Web URL (easier to scrape than API)
            const params = new URLSearchParams({
                keywords: query,
                latitude: "40.4168",
                longitude: "-3.7038",
                filters_source: "search_box"
            });

            // Switch to Web URL scraping which is often less protected than API v3
            const url = `https://es.wallapop.com/app/search?${params.toString()}`;

            // Fetch via residential proxy with JS rendering
            const response = await proxyManager.fetch(url, {
                requiresResidential: true,
                renderJs: true, // Wallapop web needs JS
                countryCode: "es",
                waitFor: ".ItemCardList__item", // Wait for items to load
            });

            const items: Product[] = [];
            let itemsFound = 0;

            if (response.success && response.statusCode === 200) {
                try {
                    // Try to extract from __NEXT_DATA__ or HTML structure
                    // For now, simpler HTML parsing assuming JS rendered checks
                    const products = this.parseWallapopHtml(response.body);
                    itemsFound = products.length;
                    items.push(...products);
                } catch (parseError) {
                    console.error("[Wallapop] Failed to parse response:", parseError);
                }
            }

            const analysis = BanDetectionService.analyzeResponse(
                this.platform,
                response.statusCode,
                response.body,
                itemsFound
            );

            return {
                platform: this.platform,
                success: analysis.status === "success",
                status: analysis.status,
                statusCode: response.statusCode,
                errorMessage: analysis.reason,
                banReason: analysis.status === "banned" ? analysis.reason : null,
                items,
                itemsFound,
                requestDurationMs: response.duration,
            };
        } catch (error) {
            return this.createErrorResult(error, startTime);
        }
    }

    private parseWallapopHtml(html: string): Product[] {
        const products: Product[] = [];
        // Regex for the new Wallapop web structure (ItemCard)
        const linkRegex = /href="(\/item\/[^"]+)"/g;
        // This is a simplified fallback. In production, we'd use a robust parser.
        // Wallapop web is complex SPA (Next.js). Best bet is extracting __NEXT_DATA__

        try {
            const nextDataRegex = /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/;
            const match = nextDataRegex.exec(html);
            if (match && match[1]) {
                const data = JSON.parse(match[1]);
                const stateItems = data.props?.pageProps?.searchObjects || [];

                for (const item of stateItems) {
                    // Map API-like object from Next.js state
                    const product = this.parseWallapopItem(item); // Reuse the item parser
                    if (product) products.push(product);
                }
            }
        } catch (e) {
            console.error("[Wallapop] HTML parsing failed", e);
        }

        return products;
    }

    private parseWallapopItem(item: any): Product | null {
        try {
            const id = item.id || uuidv4();
            const title = item.title || item.content?.title || "";
            const description = item.description || item.content?.description || "";
            const price = parseFloat(item.price || item.content?.price || "0");
            const imageUrl = item.images?.[0]?.urls?.big ||
                item.content?.images?.[0]?.urls?.big ||
                item.image || "";
            const sourceUrl = `https://es.wallapop.com/item/${item.web_slug || id}`;
            const location = item.location?.city || item.seller_id || "España";
            const condition = this.parseCondition(item.condition || item.content?.condition);

            if (!title || !sourceUrl) return null;

            return {
                id,
                title,
                description,
                price,
                currency: "EUR",
                image_url: imageUrl,
                source_url: sourceUrl,
                platform: "wallapop",
                category: normalizeCategory(item.category_id?.toString()),
                location,
                condition,
                phash: null,
                price_score: null,
                created_at: new Date(),
            };
        } catch (error) {
            console.error("[Wallapop] Failed to parse item:", error);
            return null;
        }
    }

    private parseCondition(condition: string | undefined): ProductCondition {
        const conditionMap: Record<string, ProductCondition> = {
            "new": "new",
            "as_good_as_new": "like-new",
            "good": "good",
            "fair": "fair",
            "has_given_it_all": "poor",
        };
        return conditionMap[condition || ""] || "good";
    }

    private createErrorResult(error: unknown, startTime: number): ScrapeResult {
        return {
            platform: this.platform,
            success: false,
            status: "error",
            statusCode: 0,
            errorMessage: String(error),
            banReason: null,
            items: [],
            itemsFound: 0,
            requestDurationMs: Date.now() - startTime,
        };
    }
}

/**
 * Vinted Scraper - Uses catalog search via residential proxy
 */
export class VintedAdvancedScraper {
    private readonly platform: Platform = "vinted";
    private readonly apiUrl = "https://www.vinted.es/api/v2/catalog/items";

    async search(query: string, category?: Category): Promise<ScrapeResult> {
        const startTime = Date.now();

        try {
            const params = new URLSearchParams({
                search_text: query,
                order: "newest_first",
            });

            // Use Web URL instead of API
            const url = `https://www.vinted.es/catalog?${params.toString()}`;

            // Vinted requires premium residential proxy & JS
            const response = await proxyManager.fetch(url, {
                requiresResidential: true,
                countryCode: "es",
                renderJs: true,
                waitFor: "[data-testid='grid-item']", // Wait for grid
            });

            const items: Product[] = [];
            let itemsFound = 0;

            if (response.success && response.statusCode === 200) {
                try {
                    const products = this.parseVintedHtml(response.body);
                    itemsFound = products.length;
                    items.push(...products);
                } catch (parseError) {
                    console.error("[Vinted] Failed to parse response:", parseError);
                }
            }

            const analysis = BanDetectionService.analyzeResponse(
                this.platform,
                response.statusCode,
                response.body,
                itemsFound
            );

            return {
                platform: this.platform,
                success: analysis.status === "success",
                status: analysis.status,
                statusCode: response.statusCode,
                errorMessage: analysis.reason,
                banReason: analysis.status === "banned" ? analysis.reason : null,
                items,
                itemsFound,
                requestDurationMs: response.duration,
            };
        } catch (error) {
            return this.createErrorResult(error, startTime);
        }
    }

    private parseVintedHtml(html: string): Product[] {
        const products: Product[] = [];
        const seenIds = new Set<string>();

        // Regex to find product links in Vinted feed
        // Matches: href="/items/12345678-title-of-item"
        const linkRegex = /href="(\/items\/(\d+)-[^"]+)"/g;

        let match;
        while ((match = linkRegex.exec(html)) !== null) {
            const relativeUrl = match[1];
            const id = match[2];

            if (seenIds.has(id)) continue;
            seenIds.add(id);

            // Extract title from URL (fallback)
            const slugTitle = relativeUrl.split("-").slice(1).join(" ").replace(/\//g, "");

            // Try to find price in a window around the link match
            const windowSize = 300;
            const context = html.substring(Math.max(0, match.index - windowSize), Math.min(html.length, match.index + windowSize));

            // Price regex: "10,00 €" or "10.00 €" or "€10.00"
            const priceRegex = /([0-9]+[.,][0-9]+)\s?€/i;
            const priceMatch = priceRegex.exec(context);

            let price = 0;
            if (priceMatch) {
                // Normalize price found
                price = parseFloat(priceMatch[1].replace(',', '.'));
            }

            // Only add if we have at least ID and Title
            if (id && slugTitle) {
                products.push({
                    id: id,
                    title: slugTitle || `Vinted Item ${id}`,
                    description: "",
                    price: price, // May be 0, trust engine will handle
                    currency: "EUR",
                    image_url: "", // Detailed scraping needed for image
                    source_url: `https://www.vinted.es${relativeUrl}`,
                    platform: "vinted",
                    category: "others",
                    location: "España",
                    condition: "good",
                    phash: null,
                    price_score: null,
                    created_at: new Date(),
                });
            }
        }

        return products.slice(0, 20);
    }

    private parseVintedItem(item: any): Product | null {
        try {
            const id = item.id?.toString() || uuidv4();
            const title = item.title || "";
            const description = item.description || "";
            const price = parseFloat(item.price?.amount || item.price || "0");
            const imageUrl = item.photo?.url || item.photos?.[0]?.url || "";
            const sourceUrl = item.url || `https://www.vinted.es/items/${id}`;
            const location = item.user?.city || "España";

            if (!title || !sourceUrl) return null;

            return {
                id,
                title,
                description,
                price,
                currency: "EUR",
                image_url: imageUrl,
                source_url: sourceUrl,
                platform: "vinted",
                category: normalizeCategory(item.catalog_id?.toString()),
                location,
                condition: normalizeCondition(item.status),
                phash: null,
                price_score: null,
                created_at: new Date(),
            };
        } catch (error) {
            console.error("[Vinted] Failed to parse item:", error);
            return null;
        }
    }

    private createErrorResult(error: unknown, startTime: number): ScrapeResult {
        return {
            platform: this.platform,
            success: false,
            status: "error",
            statusCode: 0,
            errorMessage: String(error),
            banReason: null,
            items: [],
            itemsFound: 0,
            requestDurationMs: Date.now() - startTime,
        };
    }
}

/**
 * eBay Scraper - Dual approach: Browse API + HTML fallback
 */
export class EbayAdvancedScraper {
    private readonly platform: Platform = "ebay";
    private readonly browseApiUrl = "https://api.ebay.com/buy/browse/v1/item_summary/search";
    private readonly webUrl = "https://www.ebay.es";

    async search(query: string, category?: Category): Promise<ScrapeResult> {
        const startTime = Date.now();

        // Try Browse API first if API key is available
        if (process.env.EBAY_APP_ID) {
            const apiResult = await this.searchViaApi(query, startTime);
            if (apiResult.success && apiResult.itemsFound > 0) {
                return apiResult;
            }
        }

        // Fallback to web scraping
        return this.searchViaWeb(query, startTime);
    }

    private async searchViaApi(query: string, startTime: number): Promise<ScrapeResult> {
        try {
            // Get OAuth token
            const token = await this.getEbayToken();
            if (!token) {
                return this.createErrorResult("Failed to get eBay API token", startTime);
            }

            const params = new URLSearchParams({
                q: query,
                limit: "50",
                filter: "deliveryCountry:ES",
            });

            const response = await fetch(`${this.browseApiUrl}?${params.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-EBAY-C-MARKETPLACE-ID": "EBAY_ES",
                    "Content-Type": "application/json",
                },
            });

            const items: Product[] = [];
            let itemsFound = 0;

            if (response.ok) {
                const data = await response.json();
                const products = data.itemSummaries || [];
                itemsFound = products.length;

                for (const item of products) {
                    const product = this.parseEbayApiItem(item);
                    if (product) {
                        items.push(product);
                    }
                }
            }

            return {
                platform: this.platform,
                success: response.ok && itemsFound > 0,
                status: response.ok && itemsFound > 0 ? "success" : "error",
                statusCode: response.status,
                errorMessage: response.ok ? null : "eBay API request failed",
                banReason: null,
                items,
                itemsFound,
                requestDurationMs: Date.now() - startTime,
            };
        } catch (error) {
            return this.createErrorResult(error, startTime);
        }
    }

    private async getEbayToken(): Promise<string | null> {
        const appId = process.env.EBAY_APP_ID;
        const certId = process.env.EBAY_CERT_ID;

        if (!appId || !certId) return null;

        try {
            const credentials = Buffer.from(`${appId}:${certId}`).toString("base64");
            const response = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${credentials}`,
                },
                body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
            });

            if (response.ok) {
                const data = await response.json();
                return data.access_token;
            }
        } catch (error) {
            console.error("[eBay] Failed to get token:", error);
        }

        return null;
    }

    private async searchViaWeb(query: string, startTime: number): Promise<ScrapeResult> {
        try {
            const url = buildSearchUrl("ebay", query);

            // eBay usually doesn't require proxy, BUT Vercel/Cloud IPs are blocked.
            // Force ScraperAPI which is often cleaner for eBay
            const response = await proxyManager.fetch(url, {
                requiresResidential: false,
                forceProxy: true,
                preferredProvider: "scraperapi",
                countryCode: "es",
            });

            const items: Product[] = [];
            let itemsFound = 0;

            if (response.success && response.statusCode === 200) {
                const products = this.parseEbayHtml(response.body);
                items.push(...products);
                itemsFound = products.length;
            }

            const analysis = BanDetectionService.analyzeResponse(
                this.platform,
                response.statusCode,
                response.body,
                itemsFound
            );

            return {
                platform: this.platform,
                success: analysis.status === "success",
                status: analysis.status,
                statusCode: response.statusCode,
                errorMessage: analysis.reason,
                banReason: analysis.status === "banned" ? analysis.reason : null,
                items,
                itemsFound,
                requestDurationMs: response.duration,
            };
        } catch (error) {
            return this.createErrorResult(error, startTime);
        }
    }

    private parseEbayApiItem(item: any): Product | null {
        try {
            return {
                id: item.itemId || uuidv4(),
                title: item.title || "",
                description: item.shortDescription || "",
                price: parseFloat(item.price?.value || "0"),
                currency: item.price?.currency || "EUR",
                image_url: item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl || "",
                source_url: item.itemWebUrl || "",
                platform: "ebay",
                category: normalizeCategory(item.categories?.[0]?.categoryName),
                location: item.itemLocation?.postalCode || "España",
                condition: normalizeCondition(item.condition),
                phash: null,
                price_score: null,
                created_at: new Date(),
            };
        } catch (error) {
            return null;
        }
    }

    private parseEbayHtml(html: string): Product[] {
        const products: Product[] = [];

        // Simple regex-based parsing for eBay HTML
        // In production, consider using a proper HTML parser like cheerio
        const itemRegex = /<div[^>]*class="[^"]*s-item[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
        const titleRegex = /<span[^>]*class="[^"]*s-item__title[^"]*"[^>]*>([^<]+)<\/span>/i;
        const priceRegex = /<span[^>]*class="[^"]*s-item__price[^"]*"[^>]*>([^<]+)<\/span>/i;
        const linkRegex = /<a[^>]*class="[^"]*s-item__link[^"]*"[^>]*href="([^"]+)"/i;
        const imgRegex = /<img[^>]*class="[^"]*s-item__image[^"]*"[^>]*src="([^"]+)"/i;

        let match;
        while ((match = itemRegex.exec(html)) !== null) {
            const itemHtml = match[1];
            const titleMatch = titleRegex.exec(itemHtml);
            const priceMatch = priceRegex.exec(itemHtml);
            const linkMatch = linkRegex.exec(itemHtml);
            const imgMatch = imgRegex.exec(itemHtml);

            if (titleMatch && priceMatch && linkMatch) {
                const title = titleMatch[1].trim();
                if (title.toLowerCase().includes("shop on ebay")) continue;

                products.push({
                    id: uuidv4(),
                    title,
                    description: "",
                    price: normalizePrice(priceMatch[1]),
                    currency: "EUR",
                    image_url: imgMatch?.[1] || "",
                    source_url: linkMatch[1],
                    platform: "ebay",
                    category: "others",
                    location: "España",
                    condition: "good",
                    phash: null,
                    price_score: null,
                    created_at: new Date(),
                });
            }
        }

        return products.slice(0, 50);
    }

    private createErrorResult(error: unknown, startTime: number): ScrapeResult {
        return {
            platform: this.platform,
            success: false,
            status: "error",
            statusCode: 0,
            errorMessage: String(error),
            banReason: null,
            items: [],
            itemsFound: 0,
            requestDurationMs: Date.now() - startTime,
        };
    }
}

/**
 * Milanuncios Scraper - Requires high-quality residential proxy
 */
export class MilanunciosAdvancedScraper {
    private readonly platform: Platform = "milanuncios";
    private readonly baseUrl = "https://www.milanuncios.com";

    async search(query: string, category?: Category): Promise<ScrapeResult> {
        const startTime = Date.now();

        try {
            // Milanuncios URL format
            const searchQuery = query.replace(/\s+/g, "-").toLowerCase();
            const url = `${this.baseUrl}/anuncios/${searchQuery}.htm`;

            // Milanuncios requires premium residential proxy
            const response = await proxyManager.fetch(url, {
                requiresResidential: true,
                countryCode: "es",
                renderJs: true,
            });

            const items: Product[] = [];
            let itemsFound = 0;

            if (response.success && response.statusCode === 200) {
                const products = this.parseMilanunciosHtml(response.body);
                items.push(...products);
                itemsFound = products.length;
            }

            const analysis = BanDetectionService.analyzeResponse(
                this.platform,
                response.statusCode,
                response.body,
                itemsFound
            );

            return {
                platform: this.platform,
                success: analysis.status === "success",
                status: analysis.status,
                statusCode: response.statusCode,
                errorMessage: analysis.reason,
                banReason: analysis.status === "banned" ? analysis.reason : null,
                items,
                itemsFound,
                requestDurationMs: response.duration,
            };
        } catch (error) {
            return this.createErrorResult(error, startTime);
        }
    }

    private parseMilanunciosHtml(html: string): Product[] {
        const products: Product[] = [];

        // Milanuncios uses ma-AdCardV2 class for listings
        const cardRegex = /<article[^>]*class="[^"]*ma-AdCardV2[^"]*"[^>]*data-adid="([^"]*)"[^>]*>([\s\S]*?)<\/article>/gi;
        const titleRegex = /<a[^>]*class="[^"]*ma-AdCardV2-titleLink[^"]*"[^>]*>([^<]+)<\/a>/i;
        const priceRegex = /<span[^>]*class="[^"]*ma-AdPrice-value[^"]*"[^>]*>([^<]+)<\/span>/i;
        const imgRegex = /<img[^>]*class="[^"]*ma-AdCardV2-photo[^"]*"[^>]*src="([^"]+)"/i;
        const locationRegex = /<span[^>]*class="[^"]*ma-AdCardV2-location[^"]*"[^>]*>([^<]+)<\/span>/i;

        let match;
        while ((match = cardRegex.exec(html)) !== null) {
            const adId = match[1];
            const cardHtml = match[2];

            const titleMatch = titleRegex.exec(cardHtml);
            const priceMatch = priceRegex.exec(cardHtml);
            const imgMatch = imgRegex.exec(cardHtml);
            const locationMatch = locationRegex.exec(cardHtml);

            if (titleMatch && priceMatch) {
                products.push({
                    id: adId || uuidv4(),
                    title: titleMatch[1].trim(),
                    description: "",
                    price: normalizePrice(priceMatch[1]),
                    currency: "EUR",
                    image_url: imgMatch?.[1] || "",
                    source_url: `${this.baseUrl}/anuncios/${adId}.htm`,
                    platform: "milanuncios",
                    category: "others",
                    location: locationMatch?.[1]?.trim() || "España",
                    condition: "good",
                    phash: null,
                    price_score: null,
                    created_at: new Date(),
                });
            }
        }

        return products.slice(0, 50);
    }

    private createErrorResult(error: unknown, startTime: number): ScrapeResult {
        return {
            platform: this.platform,
            success: false,
            status: "error",
            statusCode: 0,
            errorMessage: String(error),
            banReason: null,
            items: [],
            itemsFound: 0,
            requestDurationMs: Date.now() - startTime,
        };
    }
}

// ============================================
// UNIFIED SCRAPER MANAGER
// ============================================

export class MultiPlatformScraperManager {
    private wallapop: WallapopAdvancedScraper;
    private vinted: VintedAdvancedScraper;
    private ebay: EbayAdvancedScraper;
    private milanuncios: MilanunciosAdvancedScraper;

    constructor() {
        this.wallapop = new WallapopAdvancedScraper();
        this.vinted = new VintedAdvancedScraper();
        this.ebay = new EbayAdvancedScraper();
        this.milanuncios = new MilanunciosAdvancedScraper();
    }

    /**
     * Search a specific platform
     */
    async searchPlatform(platform: Platform, query: string, category?: Category): Promise<ScrapeResult> {
        switch (platform) {
            case "wallapop":
                return this.wallapop.search(query, category);
            case "vinted":
                return this.vinted.search(query, category);
            case "ebay":
                return this.ebay.search(query, category);
            case "milanuncios":
                return this.milanuncios.search(query, category);
            default:
                return {
                    platform,
                    success: false,
                    status: "error",
                    statusCode: 0,
                    errorMessage: "Unknown platform",
                    banReason: null,
                    items: [],
                    itemsFound: 0,
                    requestDurationMs: 0,
                };
        }
    }

    /**
     * Search all active platforms concurrently
     */
    async searchAll(query: string, category?: Category): Promise<ScrapeResult[]> {
        const platforms: Platform[] = ["wallapop", "vinted", "ebay", "milanuncios"];

        // Check which platforms are active
        const activePlatforms = platforms.filter(p => {
            const config = getPlatformConfig(p);
            return config?.status === "active";
        });

        const results = await Promise.allSettled(
            activePlatforms.map(platform => this.searchPlatform(platform, query, category))
        );

        return results.map((result, index) => {
            if (result.status === "fulfilled") {
                return result.value;
            }
            return {
                platform: activePlatforms[index],
                success: false,
                status: "error" as const,
                statusCode: 0,
                errorMessage: String(result.reason),
                banReason: null,
                items: [],
                itemsFound: 0,
                requestDurationMs: 0,
            };
        });
    }
}

export const multiPlatformScraper = new MultiPlatformScraperManager();
