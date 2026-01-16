import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { normalizeProduct, normalizeProductBatch, isValidNormalizedProduct, RawProductData, generateProductId } from "@/lib/mappers";
import { hasWantedIntent, isNoise, getPriceScoreForProduct } from "@/services/trust-engine";
import { Product } from "@/types";

/**
 * SECURE INGESTION API
 * PRD Section 5.2: Data Ingestion (Resilient Scraping)
 * 
 * Endpoint: POST /api/ingest
 * Security: API Key authentication via INGEST_SECRET_KEY
 * 
 * Features:
 * - Batch product ingestion
 * - Deduplication by source_url
 * - Trust Engine filtering (noise/wanted ads)
 * - Price Score calculation
 */

// API Key from environment
const INGEST_SECRET_KEY = process.env.INGEST_SECRET_KEY;

/**
 * Validate API Key from request headers
 */
function validateApiKey(request: NextRequest): boolean {
    const authHeader = request.headers.get("Authorization");
    const apiKeyHeader = request.headers.get("X-API-Key");

    // Check Authorization: Bearer <token>
    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        if (token === INGEST_SECRET_KEY) return true;
    }

    // Check X-API-Key header
    if (apiKeyHeader === INGEST_SECRET_KEY) return true;

    return false;
}

/**
 * Ingestion statistics for response
 */
interface IngestionStats {
    received: number;
    inserted: number;
    updated: number;
    skipped_invalid: number;
    skipped_wanted: number;
    skipped_noise: number;
    errors: string[];
}

/**
 * POST /api/ingest
 * Ingest a batch of products
 */
export async function POST(request: NextRequest) {
    // Security: Validate API Key
    if (!INGEST_SECRET_KEY) {
        console.error("INGEST_SECRET_KEY not configured");
        return NextResponse.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    if (!validateApiKey(request)) {
        return NextResponse.json(
            { error: "Unauthorized - Invalid or missing API key" },
            { status: 401 }
        );
    }

    try {
        // Parse request body
        const body = await request.json();

        // Accept both single product and array of products
        const rawProducts: RawProductData[] = Array.isArray(body.products)
            ? body.products
            : body.product
                ? [body.product]
                : Array.isArray(body)
                    ? body
                    : [];

        if (rawProducts.length === 0) {
            return NextResponse.json(
                { error: "No products provided. Send { products: [...] } or { product: {...} }" },
                { status: 400 }
            );
        }

        // Initialize stats
        const stats: IngestionStats = {
            received: rawProducts.length,
            inserted: 0,
            updated: 0,
            skipped_invalid: 0,
            skipped_wanted: 0,
            skipped_noise: 0,
            errors: [],
        };

        // Normalize all products
        const normalizedProducts = normalizeProductBatch(rawProducts);

        // Process each product
        for (let i = 0; i < normalizedProducts.length; i++) {
            const normalizedProduct = normalizedProducts[i];

            try {
                // Validation check
                if (!isValidNormalizedProduct(normalizedProduct)) {
                    stats.skipped_invalid++;
                    continue;
                }

                // Create a full Product object for Trust Engine checks
                const fullProduct: Product = {
                    id: "",
                    ...normalizedProduct,
                    price_score: null,
                    created_at: new Date(),
                };

                // Trust Engine: Check for "Wanted" intent
                if (hasWantedIntent(fullProduct)) {
                    stats.skipped_wanted++;
                    continue;
                }

                // Trust Engine: Check for noise/spam
                if (isNoise(fullProduct)) {
                    stats.skipped_noise++;
                    continue;
                }

                // Check if product already exists (deduplication by source_url)
                const { data: existingProduct, error: selectError } = await supabaseAdmin
                    .from("products")
                    .select("id, price")
                    .eq("source_url", normalizedProduct.source_url)
                    .maybeSingle();

                if (selectError) {
                    stats.errors.push(`Select error for ${normalizedProduct.source_url}: ${selectError.message}`);
                    continue;
                }

                if (existingProduct) {
                    // Product exists - UPDATE price and updated_at
                    const { error: updateError } = await supabaseAdmin
                        .from("products")
                        .update({
                            price: normalizedProduct.price,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", existingProduct.id);

                    if (updateError) {
                        stats.errors.push(`Update error for ${normalizedProduct.source_url}: ${updateError.message}`);
                    } else {
                        stats.updated++;
                    }
                } else {
                    // New product - Calculate price score and INSERT
                    const priceScore = getPriceScoreForProduct(fullProduct);

                    const productToInsert = {
                        id: generateProductId(),
                        ...normalizedProduct,
                        price_score: priceScore,
                        created_at: new Date().toISOString(),
                    };

                    const { error: insertError } = await supabaseAdmin
                        .from("products")
                        .insert(productToInsert);

                    if (insertError) {
                        stats.errors.push(`Insert error for ${normalizedProduct.source_url}: ${insertError.message}`);
                    } else {
                        stats.inserted++;
                    }
                }
            } catch (productError) {
                stats.errors.push(`Processing error for product ${i}: ${productError}`);
            }
        }

        // Return success with stats
        return NextResponse.json({
            success: true,
            message: `Ingestion complete. ${stats.inserted} inserted, ${stats.updated} updated.`,
            stats,
        });

    } catch (error) {
        console.error("Ingestion error:", error);
        return NextResponse.json(
            { error: "Failed to process ingestion request", details: String(error) },
            { status: 500 }
        );
    }
}

/**
 * GET /api/ingest
 * Health check / documentation
 */
export async function GET(request: NextRequest) {
    // Simple health check (no auth required)
    return NextResponse.json({
        status: "ok",
        endpoint: "/api/ingest",
        method: "POST",
        description: "Batch product ingestion endpoint",
        authentication: "Bearer token or X-API-Key header required",
        example_payload: {
            products: [
                {
                    title: "iPhone 13 Pro",
                    price: 650,
                    currency: "EUR",
                    image_url: "https://example.com/image.jpg",
                    source_url: "https://wallapop.com/item/123",
                    category: "tech-electronics",
                    condition: "like-new",
                    location: "Madrid",
                },
            ],
        },
    });
}
