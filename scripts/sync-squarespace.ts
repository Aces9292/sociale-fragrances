/**
 * Squarespace Product Sync Script
 * 
 * Syncs product data and images from Squarespace to the Next.js site.
 * Run: npx ts-node scripts/sync-squarespace.ts
 * Or via API: POST /api/sync
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

const SQUARESPACE_API_KEY = process.env.SQUARESPACE_API_KEY || '2226ae01-f7b6-44e0-a6f7-2013bd7c0803';
const SQUARESPACE_API_URL = 'https://api.squarespace.com/1.0/commerce';

interface SquarespaceProduct {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string; altText: string }>;
  variants: Array<{
    id: string;
    sku: string;
    pricing: { basePrice: { value: string } };
    stock: { quantity: number };
    attributes: Record<string, string>;
  }>;
  tags: string[];
  isVisible: boolean;
}

// Candle product names to sync (exclude apparel)
const CANDLE_PRODUCTS = [
  'Ma', 'Fire Island', 'Palm Springs', 'Asbury Park', 'Provincetown',
  'Hipster', 'Bro', 'Ivy Leaguer',
  'Pride Collection Bundle', 'Bundle and Save - Boyfriend Collection',
  'Candle of the Month', 'Pride Match Set'
];

async function fetchProducts(): Promise<SquarespaceProduct[]> {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SQUARESPACE_API_URL}/products`);
    
    https.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${SQUARESPACE_API_KEY}`,
        'Content-Type': 'application/json',
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.products || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCollection(product: SquarespaceProduct): string {
  const name = product.name.toLowerCase();
  const tags = product.tags?.map(t => t.toLowerCase()) || [];
  
  if (['fire island', 'palm springs', 'asbury park', 'provincetown'].some(n => name.includes(n)) ||
      tags.some(t => t.includes('pride'))) {
    return 'pride';
  }
  if (['hipster', 'bro', 'ivy leaguer'].some(n => name.includes(n)) ||
      tags.some(t => t.includes('boyfriend'))) {
    return 'boyfriend';
  }
  if (name.includes('subscription') || name.includes('month')) {
    return 'subscription';
  }
  if (name.includes('gift')) {
    return 'gift';
  }
  return 'special';
}

async function syncProducts() {
  console.log('🔄 Starting Squarespace sync...\n');
  
  // Create directories
  const imagesDir = path.join(process.cwd(), 'public/images/products/squarespace');
  const dataDir = path.join(process.cwd(), 'data');
  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Fetch products
  console.log('📥 Fetching products from Squarespace...');
  const allProducts = await fetchProducts();
  console.log(`   Found ${allProducts.length} total products\n`);
  
  // Filter to candles only
  const candleProducts = allProducts.filter(p => 
    CANDLE_PRODUCTS.some(name => p.name.toLowerCase().includes(name.toLowerCase()))
  );
  console.log(`🕯️  Filtering to ${candleProducts.length} candle products\n`);
  
  const syncedProducts: any[] = [];
  const imageMapping: Record<string, string> = {};
  
  for (const product of candleProducts) {
    const slug = generateSlug(product.name);
    console.log(`📦 Processing: ${product.name} (${slug})`);
    
    // Download first image
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0].url;
      const ext = imageUrl.includes('.png') ? 'png' : 'jpg';
      const imagePath = path.join(imagesDir, `${slug}.${ext}`);
      const webPath = `/images/products/squarespace/${slug}.${ext}`;
      
      try {
        console.log(`   📷 Downloading image...`);
        await downloadImage(imageUrl, imagePath);
        imageMapping[slug] = webPath;
        console.log(`   ✅ Saved to ${webPath}`);
      } catch (err) {
        console.log(`   ⚠️  Failed to download image: ${err}`);
      }
    }
    
    // Transform product data
    const sizes = product.variants.map(v => ({
      id: v.id,
      name: v.attributes?.Size || 'Standard',
      price: parseFloat(v.pricing.basePrice.value),
      stock: v.stock.quantity,
      sku: v.sku,
    }));
    
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug,
      collection: getCollection(product),
      price: Math.min(...sizes.map(s => s.price)),
      stock: sizes.reduce((sum, s) => sum + s.stock, 0),
      description: stripHtml(product.description),
      sizes,
      squarespaceImages: product.images.map(img => img.url),
      isVisible: product.isVisible,
      lastSynced: new Date().toISOString(),
    };
    
    syncedProducts.push(transformedProduct);
    console.log(`   💰 Prices: ${sizes.map(s => `$${s.price}`).join(' / ')}`);
    console.log(`   📊 Stock: ${transformedProduct.stock} total\n`);
  }
  
  // Save synced data
  const outputPath = path.join(dataDir, 'squarespace-products.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    lastSync: new Date().toISOString(),
    productCount: syncedProducts.length,
    products: syncedProducts,
  }, null, 2));
  console.log(`\n💾 Saved product data to ${outputPath}`);
  
  // Save image mapping
  const mappingPath = path.join(dataDir, 'squarespace-images.json');
  fs.writeFileSync(mappingPath, JSON.stringify(imageMapping, null, 2));
  console.log(`💾 Saved image mapping to ${mappingPath}`);
  
  // Generate TypeScript mapping file
  const tsMapping = `// Auto-generated by sync-squarespace.ts
// Last sync: ${new Date().toISOString()}

export const squarespaceImages: Record<string, string> = ${JSON.stringify(imageMapping, null, 2)};

export const squarespaceProducts = ${JSON.stringify(syncedProducts, null, 2)};
`;
  
  const tsMappingPath = path.join(process.cwd(), 'lib/squarespace-data.ts');
  fs.writeFileSync(tsMappingPath, tsMapping);
  console.log(`💾 Saved TypeScript data to ${tsMappingPath}`);
  
  console.log('\n✅ Sync complete!');
  console.log(`   ${syncedProducts.length} products synced`);
  console.log(`   ${Object.keys(imageMapping).length} images downloaded`);
  
  return { products: syncedProducts, images: imageMapping };
}

// Run if called directly
if (require.main === module) {
  syncProducts().catch(console.error);
}

export { syncProducts, fetchProducts };
