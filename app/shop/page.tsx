'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/products';
import ScrollReveal from '@/components/ScrollReveal';

type FilterTab = 'all' | 'pride' | 'boyfriend' | 'special';

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const allProducts = getAllProducts();

  const filteredProducts = activeTab === 'all'
    ? allProducts
    : allProducts.filter(p => p.collection === activeTab);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pride', label: 'Pride' },
    { key: 'boyfriend', label: 'Boyfriend' },
    { key: 'special', label: 'Special' },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="py-20 md:py-32 bg-cream">
        <div className="max-w-content mx-auto px-6 text-center">
          <ScrollReveal>
            <span className="text-tiny uppercase-label block mb-4 tracking-[0.3em] text-black/50">
              Handcrafted in Connecticut
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="text-display font-serif">Shop</h1>
          </ScrollReveal>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-[80px] md:top-[100px] z-20 bg-white border-b border-black/10">
        <div className="max-w-content mx-auto px-6">
          <div className="flex items-center justify-center gap-8 md:gap-12 py-5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative text-[13px] uppercase tracking-[0.15em] py-2 transition-colors duration-300 ${
                  activeTab === tab.key
                    ? 'text-black'
                    : 'text-black/40 hover:text-black/70'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-16 md:py-24">
        <div className="max-w-wide mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-medium text-black/50">No products in this collection yet.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
