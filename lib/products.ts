import { Product, CollectionInfo } from './types';
import productsData from '../data/products.json';

// Load products from JSON file (allows inventory updates via admin dashboard)
export const products: Product[] = productsData.products as Product[];

export const collections: CollectionInfo[] = [
  {
    id: 'pride',
    name: 'Pride Collection',
    description: 'Scents inspired by the places that shaped LGBTQ+ history and community.',
    slug: 'pride',
  },
  {
    id: 'boyfriend',
    name: 'Boyfriend Collection',
    description: 'Three archetypes, three scent profiles, zero commitment required.',
    slug: 'boyfriend',
  },
  {
    id: 'special',
    name: 'Limited Edition',
    description: 'Seasonal and special release candles.',
    slug: 'special',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(collection: string): Product[] {
  return products.filter((p) => p.collection === collection);
}

export function getFeaturedProduct(): Product | undefined {
  return products.find((p) => p.featured);
}

export function getAllProducts(): Product[] {
  return products.filter((p) => p.collection !== 'gift' && p.collection !== 'subscription');
}