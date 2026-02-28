export type Collection = 'pride' | 'boyfriend' | 'special' | 'subscription' | 'gift';

export interface SizeOption {
  name: string;        // "Bedroom Size" or "Living Room Size"
  size: string;        // "12 oz" or "20 oz"
  price: number;       // 30 or 45
  stock: number;       // available stock for this size
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  collection: Collection;
  price: number;       // Starting price (smallest size)
  stock: number;       // Total stock
  description: string;
  scentNotes: string[];
  burnTime: string;
  wax: string;
  size?: string;
  sizes?: SizeOption[];  // Size variants with different prices
  badge?: string;
  preOrder?: boolean;
  shipsBy?: string;
  isBundle?: boolean;
  bundleIncludes?: string[];
  featured?: boolean;
}

export interface CollectionInfo {
  id: Collection;
  name: string;
  description: string;
  slug: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
