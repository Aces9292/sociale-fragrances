'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { getProductImage } from '@/lib/images';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = getProductImage(product.slug);
  const isLowStock = product.stock > 0 && product.stock < 3;
  const isSoldOut = product.stock === 0;

  return (
    <Link href={`/shop/${product.slug}`} className="block group">
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-cream overflow-hidden mb-6">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="text-[13px] uppercase tracking-[0.2em] bg-black text-white px-6 py-3">
              Sold Out
            </span>
          </div>
        )}

        {/* Pre-Order Badge */}
        {product.preOrder && !isSoldOut && (
          <div className="absolute top-4 left-4">
            <span className="text-[10px] uppercase tracking-[0.2em] bg-black text-white px-4 py-2">
              Pre-Order
            </span>
          </div>
        )}

        {/* Quick View on Hover */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="block w-full text-center text-[11px] uppercase tracking-[0.2em] bg-white/95 backdrop-blur-sm text-black py-3">
            View Details
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-medium font-serif group-hover:opacity-70 transition-opacity duration-300">
          {product.name}
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-body text-black/70">${product.price}</span>
          {isLowStock && (
            <span className="text-tiny uppercase tracking-[0.15em] text-black/50">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
