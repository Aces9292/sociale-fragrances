import { Product, CollectionInfo } from './types';

export const products: Product[] = [
  // Featured / Special - Y2K Rebrand
  {
    id: 'ma',
    name: 'Ma',
    slug: 'ma',
    collection: 'special',
    price: 30,
    stock: 2,
    description: 'The Mother\'s Day gift she didn\'t know she needed. One whiff and she\'s back in 2004—butterfly clips, flip phone, the works. Limited batch. Don\'t let her miss this.',
    scentNotes: ['Rose', 'Carnation', 'Lily of the Valley', 'Green Leaves', 'Ylang Ylang', 'Ozone', 'Powder', 'Peppercorn'],
    burnTime: '50 hours',
    wax: 'Vegan soy blend',
    size: '12 oz',
    badge: "Mother's Day 2026",
    featured: true,
  },

  // Pride Collection
  {
    id: 'fire-island',
    name: 'Fire Island',
    slug: 'fire-island',
    collection: 'pride',
    price: 45,
    stock: 4,
    description: 'Fire Island is a gay summer staple, and this blend of marine, ylang ylang, camphor, palm, jasmine, sandalwood, amber, and bamboo smells like a group of housemates walking to tea dance in the fresh ocean air.',
    scentNotes: ['Ylang Ylang', 'Marine', 'Camphor', 'Jasmine', 'Bamboo', 'Palm', 'Geranium', 'Lavender', 'Powder', 'Plumeria', 'Pineapple', 'Sandalwood', 'Dark Musk', 'Amber', 'Vetiver', 'Cedar'],
    burnTime: '60 hours',
    wax: 'Vegan soy blend',
    size: '16 oz',
  },
  {
    id: 'palm-springs',
    name: 'Palm Springs',
    slug: 'palm-springs',
    collection: 'pride',
    price: 45,
    stock: 3,
    description: 'This West Coast desert town has one of the best pride celebrations in the country, and our blend of citrus, agave, aloe, jasmine, violet, cedar, powder, and light musk burns great after spending a long day sunbathing by the pool.',
    scentNotes: ['Ozone', 'Citrus', 'Agave', 'Aloe', 'Sea Salt', 'Jasmine', 'Chrysanthemum', 'Green Floral', 'Green Leaves', 'Violet', 'Cedar', 'Powder', 'Light Musk', 'Patchouli'],
    burnTime: '70 hours',
    wax: 'Vegan soy blend',
    size: '20 oz',
  },
  {
    id: 'asbury-park',
    name: 'Asbury Park',
    slug: 'asbury-park',
    collection: 'pride',
    price: 45,
    stock: 1,
    description: 'This combination of lime, chili pepper, cucumber, honeydew, cantaloupe, mandarin, guava, aloe, bamboo, and peppercorn smells like a spicy marg from one of the many LGBT-owned bars and restaurants in town.',
    scentNotes: ['Lime', 'Ozone', 'Chili Pepper', 'Cucumber', 'Honeydew', 'Cantaloupe', 'Orange', 'Mandarin', 'Guava', 'Aloe', 'Bamboo', 'Powder', 'Peppercorn', 'Coconut'],
    burnTime: '70 hours',
    wax: 'Vegan soy blend',
    size: '20 oz',
  },
  {
    id: 'provincetown',
    name: 'Provincetown',
    slug: 'provincetown',
    collection: 'pride',
    price: 45,
    stock: 4,
    description: 'Provincetown summers at the tip of Cape Cod are something special, and this blend of pineapple, spearmint, saffron, incense, coconut, and patchouli smells like a bonfire on Race Point beach.',
    scentNotes: ['Pineapple', 'Spearmint', 'Saffron', 'Green Floral', 'Bamboo', 'Clove', 'Incense', 'Sandalwood', 'Coconut', 'Coconut Milk', 'Amber', 'Patchouli', 'Smoke'],
    burnTime: '70 hours',
    wax: 'Vegan soy blend',
    size: '20 oz',
  },
  {
    id: 'pride-collection-bundle',
    name: 'Pride Collection Bundle',
    slug: 'pride-collection-bundle',
    collection: 'pride',
    price: 110,
    stock: 6,
    description: 'All four Pride Collection candles in one beautifully packaged set. Fire Island, Palm Springs, Asbury Park, and Provincetown. A journey through the places that shaped a community. Includes rainbow match set.',
    scentNotes: ['Variety Pack'],
    burnTime: '270 hours total',
    wax: 'Vegan soy blend',
    isBundle: true,
    bundleIncludes: ['Fire Island', 'Palm Springs', 'Asbury Park', 'Provincetown'],
  },
  {
    id: 'pride-match-set',
    name: 'Pride Match Set',
    slug: 'pride-match-set',
    collection: 'pride',
    price: 18,
    stock: 0,
    description: 'Custom-designed matchboxes featuring rainbow SOCIALE branding. The perfect companion to any Pride Collection candle.',
    scentNotes: [],
    burnTime: 'N/A',
    wax: 'N/A',
  },

  // Boyfriend Collection
  {
    id: 'hipster',
    name: 'Hipster',
    slug: 'hipster',
    collection: 'boyfriend',
    price: 30,
    stock: 1,
    description: 'Maybe you\'ve converted a vintage Volkswagen van into a mobile artisanal coffee shop. Maybe you\'re just in line at that coffee shop every morning swooning over the guy in the window. Either way, this blend of honey, teakwood, amber, coriander, tobacco leaves, sandalwood, and bergamot will burn great with your morning latte.',
    scentNotes: ['Honey', 'Teakwood', 'Amber', 'Coriander', 'Tobacco Leaves', 'Peppercorn', 'Ginger', 'Spice', 'Sandalwood', 'Dark Musk', 'Bergamot'],
    burnTime: '50 hours',
    wax: 'Vegan soy blend',
    size: '12 oz',
  },
  {
    id: 'bro',
    name: 'Bro',
    slug: 'bro',
    collection: 'boyfriend',
    price: 30,
    stock: 1,
    description: '\'Sup, Bro? If you have a lacrosse stick and bottle of cologne nearby at all times, or can\'t resist a free shot from someone who does, the Bro will be your go-to. This bad boy is a combination of linen, eucalyptus, saffron, black pepper, leather, basil, and sea salt, and will burn great while you\'re getting ready for a night out.',
    scentNotes: ['Linen', 'Eucalyptus', 'Saffron', 'Black Pepper', 'Leather', 'Basil', 'Sea Salt', 'Cucumber', 'Vetiver', 'Clove', 'Ozone', 'Freesia', 'Moss', 'Powder'],
    burnTime: '50 hours',
    wax: 'Vegan soy blend',
    size: '12 oz',
  },
  {
    id: 'ivy-leaguer',
    name: 'Ivy Leaguer',
    slug: 'ivy-leaguer',
    collection: 'boyfriend',
    price: 30,
    stock: 1,
    description: 'Does your ideal man have a collection of books that are just as impressive as his looks? Do you spend more time at the library than at the bar? For brainiacs and those that love them, this candle is a blend of cedar, sandalwood, amyris, patchouli, saffron, plum, amber, and cardamom.',
    scentNotes: ['Cedar', 'Sandalwood', 'Amyris', 'Patchouli', 'Saffron', 'Plum', 'Cardamom', 'Amber'],
    burnTime: '50 hours',
    wax: 'Vegan soy blend',
    size: '12 oz',
  },
  {
    id: 'boyfriend-bundle',
    name: 'Boyfriend Bundle',
    slug: 'boyfriend-bundle',
    collection: 'boyfriend',
    price: 75,
    stock: 12,
    description: 'Try all 3 at a discounted rate!',
    scentNotes: ['Variety Pack'],
    burnTime: '150 hours total',
    wax: 'Vegan soy blend',
    isBundle: true,
    bundleIncludes: ['Hipster', 'Bro', 'Ivy Leaguer'],
  },

  // Gift & Subscription
  {
    id: 'gift-card',
    name: 'Gift Card',
    slug: 'gift-card',
    collection: 'gift',
    price: 25,
    stock: 999,
    description: 'Let them choose. Available in $25, $50, $75, and $100 denominations. Delivered via email, never expires.',
    scentNotes: [],
    burnTime: 'N/A',
    wax: 'N/A',
  },
  {
    id: 'candle-of-the-month',
    name: 'Candle of the Month',
    slug: 'candle-of-the-month',
    collection: 'subscription',
    price: 25,
    stock: 999,
    description: 'A new surprise every month. Subscribers get exclusive scents, early access to new releases, and 20% off all purchases. Cancel anytime.',
    scentNotes: ['Monthly Surprise'],
    burnTime: '50 hours',
    wax: 'Vegan soy blend',
    size: '12 oz',
  },
];

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
