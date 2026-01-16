/**
 * PROXY SERVICE - Scraping Proxy Integration
 * ==========================================
 * PRD Section 5.2: Data Ingestion - Resilient Scraping
 * 
 * Supports:
 * - WebScrapingAI (primary - best for JS rendering)
 * - ScraperAPI (backup - 5000 free credits)
 * - ScrapingBee (tertiary)
 * - Direct fetch (fallback for eBay)
 */

export interface ProxyConfig {
    provider: 'webscrapingai' | 'scraperapi' | 'scrapingbee' | 'direct';
    apiKey?: string;
    renderJs?: boolean;
    premiumProxy?: boolean;
    countryCode?: string;
}

export interface ProxyResponse {
    success: boolean;
    statusCode: number;
    body: string;
    headers: Record<string, string>;
    duration: number;
    proxyUsed: string;
}

/**
 * ScrapingBee Proxy - Primary residential proxy service
 */
export class ScrapingBeeProxy {
    private apiKey: string;
    private baseUrl = 'https://app.scrapingbee.com/api/v1/';

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.SCRAPINGBEE_API_KEY || '';
    }

    async fetch(url: string, options: {
        renderJs?: boolean;
        premiumProxy?: boolean;
        countryCode?: string;
        waitFor?: string;
        extractRules?: Record<string, any>;
    } = {}): Promise<ProxyResponse> {
        const startTime = Date.now();

        if (!this.apiKey) {
            return {
                success: false,
                statusCode: 500,
                body: 'ScrapingBee API key not configured',
                headers: {},
                duration: 0,
                proxyUsed: 'none',
            };
        }

        const params = new URLSearchParams({
            api_key: this.apiKey,
            url: url,
            render_js: options.renderJs ? 'true' : 'false',
            premium_proxy: options.premiumProxy ? 'true' : 'false',
        });

        if (options.countryCode) {
            params.append('country_code', options.countryCode);
        }

        if (options.waitFor) {
            params.append('wait_for', options.waitFor);
        }

        try {
            const response = await fetch(`${this.baseUrl}?${params.toString()}`);
            const body = await response.text();
            const duration = Date.now() - startTime;

            return {
                success: response.ok,
                statusCode: response.status,
                body,
                headers: Object.fromEntries(response.headers.entries()),
                duration,
                proxyUsed: 'scrapingbee',
            };
        } catch (error) {
            return {
                success: false,
                statusCode: 0,
                body: String(error),
                headers: {},
                duration: Date.now() - startTime,
                proxyUsed: 'scrapingbee',
            };
        }
    }
}

/**
 * WebScrapingAI Proxy - Primary AI-powered scraping service
 * https://webscraping.ai/docs
 * Features: JS rendering, residential proxies, AI extraction
 */
export class WebScrapingAIProxy {
    private apiKey: string;
    private baseUrl = 'https://api.webscraping.ai';

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.WEBSCRAPINGAI_API_KEY || '';
    }

    async fetch(url: string, options: {
        renderJs?: boolean;
        useResidential?: boolean;
        countryCode?: string;
        waitFor?: string;
        timeout?: number;
    } = {}): Promise<ProxyResponse> {
        const startTime = Date.now();

        if (!this.apiKey) {
            return {
                success: false,
                statusCode: 500,
                body: 'WebScrapingAI API key not configured',
                headers: {},
                duration: 0,
                proxyUsed: 'none',
            };
        }

        const params = new URLSearchParams({
            api_key: this.apiKey,
            url: url,
            js: options.renderJs !== false ? 'true' : 'false',
            timeout: (options.timeout || 15000).toString(),
        });

        // Use residential proxy for better success rates
        if (options.useResidential) {
            params.append('proxy', 'residential');
        }

        // Geo-targeting for Spain
        if (options.countryCode) {
            params.append('country', options.countryCode);
        }

        // Wait for specific element to load
        if (options.waitFor) {
            params.append('wait_for', options.waitFor);
        }

        try {
            const response = await fetch(`${this.baseUrl}/html?${params.toString()}`);
            const body = await response.text();
            const duration = Date.now() - startTime;

            return {
                success: response.ok,
                statusCode: response.status,
                body,
                headers: Object.fromEntries(response.headers.entries()),
                duration,
                proxyUsed: 'webscrapingai',
            };
        } catch (error) {
            return {
                success: false,
                statusCode: 0,
                body: String(error),
                headers: {},
                duration: Date.now() - startTime,
                proxyUsed: 'webscrapingai',
            };
        }
    }

    /**
     * Use AI to extract structured data from a page
     */
    async extractFields(url: string, fields: Record<string, { selector: string; type?: string }>): Promise<ProxyResponse> {
        const startTime = Date.now();

        if (!this.apiKey) {
            return {
                success: false,
                statusCode: 500,
                body: 'WebScrapingAI API key not configured',
                headers: {},
                duration: 0,
                proxyUsed: 'none',
            };
        }

        const params = new URLSearchParams({
            api_key: this.apiKey,
            url: url,
        });

        try {
            const response = await fetch(`${this.baseUrl}/ai/fields?${params.toString()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fields }),
            });

            const body = await response.text();
            const duration = Date.now() - startTime;

            return {
                success: response.ok,
                statusCode: response.status,
                body,
                headers: Object.fromEntries(response.headers.entries()),
                duration,
                proxyUsed: 'webscrapingai',
            };
        } catch (error) {
            return {
                success: false,
                statusCode: 0,
                body: String(error),
                headers: {},
                duration: Date.now() - startTime,
                proxyUsed: 'webscrapingai',
            };
        }
    }
}

/**
 * ScraperAPI Proxy - Backup residential proxy service
 * https://docs.scraperapi.com/
 * Features: Residential proxies, JS rendering, geo-targeting
 * Free tier: 5,000 API credits included!
 */
export class ScraperAPIProxy {
    private apiKey: string;
    private baseUrl = 'https://api.scraperapi.com';

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.SCRAPERAPI_API_KEY || '';
    }

    async fetch(url: string, options: {
        renderJs?: boolean;
        useResidential?: boolean;
        countryCode?: string;
        waitFor?: number;
    } = {}): Promise<ProxyResponse> {
        const startTime = Date.now();

        if (!this.apiKey) {
            return {
                success: false,
                statusCode: 500,
                body: 'ScraperAPI API key not configured',
                headers: {},
                duration: 0,
                proxyUsed: 'none',
            };
        }

        const params = new URLSearchParams({
            api_key: this.apiKey,
            url: url,
        });

        // Enable JavaScript rendering
        if (options.renderJs) {
            params.append('render', 'true');
        }

        // Use premium residential proxies
        if (options.useResidential) {
            params.append('premium', 'true');
        }

        // Geo-targeting (country code)
        if (options.countryCode) {
            params.append('country_code', options.countryCode);
        }

        // Wait time for JS rendering (milliseconds)
        if (options.waitFor) {
            params.append('wait', options.waitFor.toString());
        }

        try {
            const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
                signal: AbortSignal.timeout(70000), // ScraperAPI recommends 70s timeout
            });
            const body = await response.text();
            const duration = Date.now() - startTime;

            return {
                success: response.ok,
                statusCode: response.status,
                body,
                headers: Object.fromEntries(response.headers.entries()),
                duration,
                proxyUsed: 'scraperapi',
            };
        } catch (error) {
            return {
                success: false,
                statusCode: 0,
                body: String(error),
                headers: {},
                duration: Date.now() - startTime,
                proxyUsed: 'scraperapi',
            };
        }
    }
}

/**
 * Direct Fetch - For platforms that don't require proxy (e.g., eBay)
 */
export class DirectFetch {
    async fetch(url: string, options: {
        headers?: Record<string, string>;
        userAgent?: string;
    } = {}): Promise<ProxyResponse> {
        const startTime = Date.now();

        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        ];

        const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': options.userAgent || randomUA,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
                    'Cache-Control': 'no-cache',
                    ...options.headers,
                },
            });

            const body = await response.text();
            const duration = Date.now() - startTime;

            return {
                success: response.ok,
                statusCode: response.status,
                body,
                headers: Object.fromEntries(response.headers.entries()),
                duration,
                proxyUsed: 'direct',
            };
        } catch (error) {
            return {
                success: false,
                statusCode: 0,
                body: String(error),
                headers: {},
                duration: Date.now() - startTime,
                proxyUsed: 'direct',
            };
        }
    }
}

/**
 * Unified Proxy Manager - Handles proxy selection and failover
 */
export class ProxyManager {
    private webScrapingAI: WebScrapingAIProxy;
    private scraperAPI: ScraperAPIProxy;
    private scrapingBee: ScrapingBeeProxy;
    private directFetch: DirectFetch;

    constructor() {
        this.webScrapingAI = new WebScrapingAIProxy();
        this.scraperAPI = new ScraperAPIProxy();
        this.scrapingBee = new ScrapingBeeProxy();
        this.directFetch = new DirectFetch();
    }

    /**
     * Fetch URL with automatic proxy selection and failover
     */
    async fetch(url: string, options: {
        preferredProvider?: 'webscrapingai' | 'scraperapi' | 'scrapingbee' | 'direct';
        requiresResidential?: boolean;
        forceProxy?: boolean;
        renderJs?: boolean;
        countryCode?: string;
        waitFor?: string;
    } = {}): Promise<ProxyResponse> {
        const provider = options.preferredProvider || 'webscrapingai';

        // If residential proxy is required OR proxy is forced
        if (options.requiresResidential || options.forceProxy) {
            // Try WebScrapingAI first (best JS rendering + AI features)
            if (process.env.WEBSCRAPINGAI_API_KEY) {
                const result = await this.webScrapingAI.fetch(url, {
                    renderJs: options.renderJs,
                    useResidential: options.requiresResidential, // Only use residential if specifically requested
                    countryCode: options.countryCode || 'es',
                    waitFor: options.waitFor,
                });

                if (result.success) return result;
            }

            // Fallback to ScraperAPI (5000 free credits)
            if (process.env.SCRAPERAPI_API_KEY) {
                const result = await this.scraperAPI.fetch(url, {
                    renderJs: options.renderJs,
                    useResidential: options.requiresResidential,
                    countryCode: options.countryCode || 'es',
                });

                if (result.success) return result;
            }

            // Tertiary fallback to ScrapingBee
            if (process.env.SCRAPINGBEE_API_KEY) {
                const result = await this.scrapingBee.fetch(url, {
                    renderJs: options.renderJs,
                    premiumProxy: options.requiresResidential,
                    countryCode: options.countryCode || 'es',
                    waitFor: options.waitFor,
                });

                if (result.success) return result;
                return result; // Return failed result
            }
        }

        // Direct fetch for platforms that don't require proxy AND haven't forced it
        return this.directFetch.fetch(url);
    }

    /**
     * Check which proxies are configured
     */
    getAvailableProviders(): string[] {
        const providers: string[] = ['direct'];

        if (process.env.WEBSCRAPINGAI_API_KEY) {
            providers.unshift('webscrapingai');
        }

        if (process.env.SCRAPERAPI_API_KEY) {
            providers.push('scraperapi');
        }

        if (process.env.SCRAPINGBEE_API_KEY) {
            providers.push('scrapingbee');
        }

        return providers;
    }
}

export const proxyManager = new ProxyManager();
