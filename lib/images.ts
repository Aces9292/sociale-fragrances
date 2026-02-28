// Product image mapping
// Maps product slugs to actual image files in /public/images/products/

const productImages: Record<string, string> = {
  // Pride Collection - REAL Squarespace Photos
  'fire-island': '/images/products/squarespace/fire-island.jpg',
  'palm-springs': '/images/products/squarespace/palm-springs.jpg',
  'asbury-park': '/images/products/squarespace/asbury-park.jpg',
  'provincetown': '/images/products/squarespace/provincetown.jpg',
  'pride-collection-bundle': '/images/products/squarespace/pride-bundle.jpg',
  'pride-match-set': '/images/products/squarespace/fire-island.jpg',

  // Boyfriend Collection - REAL Squarespace Photos
  'hipster': '/images/products/squarespace/hipster.jpg',
  'bro': '/images/products/squarespace/bro.jpg',
  'ivy-leaguer': '/images/products/squarespace/ivy-leaguer.jpg',
  'boyfriend-bundle': '/images/products/squarespace/bro.jpg',

  // Special - Ma (Rose petals photo Alex sent)
  'ma': '/images/campaign/ma-hero-posh.jpg',

  // Other
  'gift-card': '/images/products/squarespace/fire-island.jpg',
  'candle-of-the-month': '/images/products/squarespace/pride-bundle.jpg',
};

// Alternate product images for hover/gallery
const productAltImages: Record<string, string[]> = {
  'bro': [
    '/images/products/google-photos/bro-lifestyle.jpg',
    '/images/products/google-photos/bro-neon-1.jpg',
    '/images/products/google-photos/bro-neon-2.jpg',
  ],
  'hipster': [
    '/images/products/google-photos/hipster-lifestyle.jpg',
    '/images/products/hipster+copy.jpg',
  ],
  'ivy-leaguer': [
    '/images/products/Ivy.jpg',
    '/images/products/ivy+2.jpg',
  ],
  'palm-springs': [
    '/images/products/google-photos/palm-springs-lit.jpg',
  ],
};

// Collection hero images (Real Squarespace Photos)
const collectionImages: Record<string, string> = {
  'pride': '/images/products/squarespace/fire-island.jpg',
  'boyfriend': '/images/products/squarespace/hipster.jpg',
};

// Lifestyle/brand images
const brandImages = {
  founders: '/images/products/google-photos/founders-photo.jpg',
  foundersLifestyle: '/images/products/google-photos/founders-lifestyle.jpg',
  giftBox: '/images/products/google-photos/gift-box-packaging.jpg',
  prideLifestyle: '/images/products/google-photos/pride-collection-lifestyle.jpg',
};

// Default fallback
const defaultImage = '/images/products/DSC_0235.jpg';

export function getProductImage(slug: string): string {
  return productImages[slug] || defaultImage;
}

export function getProductAltImages(slug: string): string[] {
  return productAltImages[slug] || [];
}

export function getCollectionImage(collection: string): string {
  return collectionImages[collection] || defaultImage;
}

export function getHeroImage(): string {
  return '/images/campaign/001-y2k-2000s-nostalgia-campaign-center-feat.png';
}

export function getBrandImage(key: keyof typeof brandImages): string {
  return brandImages[key];
}
