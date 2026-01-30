# BIKILA ES Integration - Awin Advertiser

## Overview
BIKILA ES (Advertiser ID: **75838**) has been integrated into the Findly platform for automatic product ingestion.

**About BIKILA:**
- Founded in 1986 by Isidro López
- Spanish sports retailer specializing in running, trail, and athletic footwear
- Region: España (Spain)
- Status: Active in Awin network

## Integration Details

### 1. Platform Configuration
- **Platform Key**: `bikilaes` (auto-generated from "BIKILA ES")
- **Display Name**: "BIKILA"
- **Logo/Icon**: 👟 (running shoe emoji)

### 2. Category Mapping
BIKILA products will be automatically categorized as `sports-outdoors` based on:

**Merchant Category Keywords:**
- running, trail, atletismo, maratón, triatlon
- zapatillas, correr
- sports, fitness, deportes, gimnasio

**Product Name Fallback Keywords:**
- running, trail, zapatillas, maratón
- bike, gym, fitness, yoga, sports, deporte

### 3. Files Modified
1. `src/types/index.ts` - Added `bikilaes` to Platform type
2. `src/lib/mock-data.ts` - Added BIKILA logo and display name
3. `src/lib/awin-service.ts` - Enhanced category mapping for running/sports products

## Next Sync Behavior
When you run the next Awin sync (`npx tsx scripts/run-awin-sync.ts`):
1. The service will auto-discover BIKILA ES (ID: 75838) from your joined programs
2. Fetch their product feed ID dynamically
3. Download and process their product catalog
4. Map all products to `sports-outdoors` category
5. Generate platform key as `bikilaes`
6. Store products with BIKILA branding

## Testing Before Production
To verify the integration without committing to DB:
```bash
# 1. Check if BIKILA is detected
node -e "const { AwinService } = require('./src/lib/awin-service'); new AwinService().fetchJoinedProgrammes().then(p => console.log(p.filter(x => x.name.includes('BIKILA'))))"

# 2. Test category mapping
node -e "const { AwinService } = require('./src/lib/awin-service'); const s = new AwinService(); console.log('Zapatillas Trail:', s.mapCategory('Calzado', 'Zapatillas Trail Running'));"
```

## Notes
- No products have been ingested yet (as requested)
- The system is ready for immediate sync
- All BIKILA products will appear with the 👟 icon on product cards
