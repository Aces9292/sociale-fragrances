import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'aces9292';
const GITHUB_REPO = 'sociale-fragrances';
const PRODUCTS_PATH = 'data/products.json';

// Helper to get file content from GitHub
async function getGitHubFile() {
  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${PRODUCTS_PATH}`,
    {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch from GitHub');
  }
  
  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { content: JSON.parse(content), sha: data.sha };
}

// Helper to update file on GitHub
async function updateGitHubFile(content: any, sha: string, message: string) {
  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${PRODUCTS_PATH}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
        sha,
      }),
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update GitHub');
  }
  
  return await response.json();
}

// GET - Read all products
export async function GET() {
  try {
    const { content } = await getGitHubFile();
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error reading products:', error);
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

// POST - Create new product or update existing
export async function POST(request: Request) {
  try {
    const { action, product } = await request.json();
    
    // Get current file from GitHub
    const { content: productsData, sha } = await getGitHubFile();
    
    if (action === 'create') {
      // Generate unique ID
      const newId = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Check if product already exists
      const existingIndex = productsData.products.findIndex((p: any) => p.id === newId);
      if (existingIndex !== -1) {
        return NextResponse.json({ error: 'Product with this name already exists' }, { status: 400 });
      }
      
      // Create new product
      const newProduct = {
        id: newId,
        name: product.name,
        slug: newId,
        collection: product.collection || 'special',
        price: parseFloat(product.price) || 30,
        stock: parseInt(product.stock) || 0,
        description: product.description || '',
        scentNotes: product.scentNotes || [],
        burnTime: product.burnTime || '50-70 hours',
        wax: product.wax || 'Vegan soy blend',
        sizes: product.sizes || [
          { name: 'Bedroom Size', size: '12 oz', price: parseFloat(product.price) || 30, stock: parseInt(product.stock) || 0 }
        ],
        featured: product.featured || false,
        onSale: product.onSale || false,
        badge: product.badge || '',
      };
      
      productsData.products.push(newProduct);
      
      // Update GitHub
      await updateGitHubFile(productsData, sha, `Add product: ${product.name}`);
      
    } else if (action === 'update') {
      // Find and update product
      const productIndex = productsData.products.findIndex((p: any) => p.id === product.id);
      if (productIndex === -1) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      productsData.products[productIndex] = {
        ...productsData.products[productIndex],
        ...product,
        sizes: product.sizes,
      };
      
      // Update GitHub
      await updateGitHubFile(productsData, sha, `Update product: ${product.name}`);
      
    } else if (action === 'update-stock') {
      // Just update sizes/stock for inventory management
      const productIndex = productsData.products.findIndex((p: any) => p.id === product.id);
      if (productIndex === -1) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      productsData.products[productIndex].sizes = product.sizes;
      productsData.products[productIndex].stock = product.sizes.reduce((sum: number, s: any) => sum + s.stock, 0);
      
      // Update GitHub
      await updateGitHubFile(productsData, sha, `Update inventory: ${product.id}`);
      
    } else if (action === 'delete') {
      // Delete product
      productsData.products = productsData.products.filter((p: any) => p.id !== product.id);
      
      // Update GitHub
      await updateGitHubFile(productsData, sha, `Delete product: ${product.id}`);
    }
    
    return NextResponse.json({ success: true, products: productsData.products });
  } catch (error: any) {
    console.error('Error saving product:', error);
    return NextResponse.json({ error: error.message || 'Failed to save product' }, { status: 500 });
  }
}