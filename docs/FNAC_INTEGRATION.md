# FNAC ES Integration - Awin Advertiser

## Overview
Fnac ES (Advertiser ID: **77630**) has been integrated into the Findly platform.
Unlike other advertisers, Fnac splits its product catalog into multiple feeds based on category (Books, Tech, Music, etc.) and type (Direct vs Marketplace). 

To ensure full coverage, we have implemented a **Multi-Feed Sync** strategy.

## Integration Details

### 1. Platform Identity
- **Platform Key**: `fnaces` (auto-generated from "Fnac ES")
- **Display Name**: "Fnac"
- **Logo**: 📚 (Book emoji)

### 2. Multi-Feed Strategy
The system now detects Fnac (ID 77630) and automatically fetches **multiple feeds** instead of just one.
We prioritize feeds matching the following keywords:
- **MARKETPLACE_LIBROS** (Books)
- **MARKETPLACE_HARDWARE** (Tech/Electronics)
- **MARKETPLACE_MUSICA** (Music)
- **MARKETPLACE_JUGUETES** (Toys)
- **MARKETPLACE_HOGAR** (Home)
- **DIRECTO_*** (Fnac First-Party sales)

Total Feeds Monitored: ~16 feeds

### 3. Category Mapping
Products from these feeds are categorized by the standard `mapCategory` logic in `src/lib/awin-service.ts`.
- **Books** -> `books`
- **Hardware/Tech** -> `tech-electronics`
- **Music** -> `music`
- **Toys** -> `baby-kids` (or `collectibles-art` depending on keywords)
- **Hogar** -> `home-garden`

### 4. Technical Changes
- **Updated `getFeedIds`**: Now returns an array of Feed IDs instead of a single ID.
- **Updated `syncProducts`**: Iterates through all returned Feed IDs for a single partner.
- **Logs**: Each feed creates its own entry in `sync_logs` table (e.g., one for Libros, one for Hardware, etc.).

## How to Sync
Run the standard sync command:
```bash
npx tsx scripts/run-awin-sync.ts
```
The system will:
1. Detect Fnac ES.
2. Fetch the list of all available feeds.
3. Filter for the relevant 16+ feeds.
4. Download and ingest them sequentially.

## Validation
You can verify the feed selection logic with:
```bash
npx tsx scripts/debug-fnac.ts
```
