export type Collection = 'pride' | 'boyfriend' | 'special' | 'subscription' | 'gift';

export interface Product {
  id: string;
  name: string;
  slug: string;
  collection: Collection;
  price: number;
  stock: number;
  description: string;
  scentNotes: string[];
  burnTime: string;
  wax: string;
  size?: string;
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
