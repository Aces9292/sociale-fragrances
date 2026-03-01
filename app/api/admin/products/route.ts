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

// POST - Create new product or update existing
export async function POST(request: Request) {
  try {
    const { action, product } = await request.json();
    
    // Read current products
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const productsData = JSON.parse(data);
    
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
        scentNotes: product.scentNotes ? product.scentNotes.split(',').map((s: string) => s.trim()) : [],
        burnTime: product.burnTime || '50-70 hours',
        wax: product.wax || 'Vegan soy blend',
        sizes: product.sizes || [
          { name: 'Bedroom Size', size: '12 oz', price: parseFloat(product.price) || 30, stock: parseInt(product.stock) || 0 }
        ],
        featured: product.featured || false,
      };
      
      productsData.products.push(newProduct);
      
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
      
    } else if (action === 'delete') {
      // Delete product
      productsData.products = productsData.products.filter((p: any) => p.id !== product.id);
    }
    
    // Write back to file
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(productsData, null, 2));
    
    return NextResponse.json({ success: true, products: productsData.products });
  } catch (error) {
    console.error('Error saving product:', error);
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}