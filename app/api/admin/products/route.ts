import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

// GET - Read all products
export async function GET() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error reading products:', error);
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

// POST - Update a product
export async function POST(request: Request) {
  try {
    const { productId, sizes } = await request.json();
    
    // Read current products
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const productsData = JSON.parse(data);
    
    // Find and update product
    const productIndex = productsData.products.findIndex((p: any) => p.id === productId);
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Update sizes and recalculate total stock
    productsData.products[productIndex].sizes = sizes;
    const totalStock = sizes.reduce((sum: number, size: any) => sum + size.stock, 0);
    productsData.products[productIndex].stock = totalStock;
    
    // Write back to file
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(productsData, null, 2));
    
    return NextResponse.json({ success: true, product: productsData.products[productIndex] });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}