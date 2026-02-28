'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { getProductImage } from '@/lib/images';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import MagneticButton from '@/components/MagneticButton';
import { ParallaxImage } from '@/components/ParallaxSection';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const imageSrc = getProductImage(product.slug);
  const isLowStock = product.stock > 0 && product.stock < 3;
  const isSoldOut = product.stock === 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-100px)]">
        {/* Image Section - 8 columns */}
        <div className="lg:col-span-8 relative">
          <div className="lg:sticky lg:top-[100px] h-[70vh] lg:h-[calc(100vh-100px)]">
            <motion.div
              className="relative h-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-transparent lg:hidden" />

              {/* Sold Out Overlay */}
              {isSoldOut && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm">
                  <span className="text-[14px] uppercase tracking-[0.2em] bg-black text-white px-8 py-4">
                    Sold Out
                  </span>
                </div>
              )}

              {/* Pre-order Badge */}
              {product.preOrder && !isSoldOut && (
                <div className="absolute top-6 left-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] bg-black text-white px-4 py-2">
                    Pre-Order
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Details Section - 4 columns */}
        <div className="lg:col-span-4 flex items-start lg:items-center">
          <div className="w-full px-6 py-12 lg:px-12 lg:py-0">
            <StaggerContainer staggerDelay={0.1}>
              {/* Collection Tag */}
              {product.collection && (
                <StaggerItem>
                  <span className="text-tiny uppercase tracking-[0.25em] text-black/40 block mb-6">
                    {product.collection} Collection
                  </span>
                </StaggerItem>
              )}

              {/* Name */}
              <StaggerItem>
                <h1 className="text-title font-serif mb-4">{product.name}</h1>
              </StaggerItem>

              {/* Price */}
              <StaggerItem>
                <p className="text-large font-serif mb-6">${product.price}</p>
              </StaggerItem>

              {/* Stock Indicator */}
              {isLowStock && (
                <StaggerItem>
                  <p className="text-tiny uppercase tracking-[0.2em] text-black/60 mb-6">
                    Only {product.stock} left in stock
                  </p>
                </StaggerItem>
              )}

              {/* Description */}
              <StaggerItem>
                <p className="text-body leading-relaxed text-black/70 mb-8">
                  {product.description}
                </p>
              </StaggerItem>

              {/* Scent Notes */}
              {product.scentNotes.length > 0 && product.scentNotes[0] !== '' && (
                <StaggerItem>
                  <div className="mb-8 pb-8 border-b border-black/10">
                    <span className="text-tiny uppercase tracking-[0.2em] text-black/40 block mb-3">
                      Scent Notes
                    </span>
                    <p className="text-[13px] uppercase tracking-[0.1em] text-black/70">
                      {product.scentNotes.join(' · ')}
                    </p>
                  </div>
                </StaggerItem>
              )}

              {/* Product Details */}
              <StaggerItem>
                <div className="mb-10 space-y-2 text-[13px] text-black/50">
                  {product.size && (
                    <p>{product.size}</p>
                  )}
                  {product.burnTime && product.burnTime !== 'N/A' && (
                    <p>{product.burnTime} burn time</p>
                  )}
                  <p>Natural soy wax blend</p>
                  <p>Handcrafted in Connecticut</p>
                  {product.shipsBy && (
                    <p className="text-black/70 pt-2">Ships by {product.shipsBy}</p>
                  )}
                </div>
              </StaggerItem>

              {/* Add to Cart */}
              <StaggerItem>
                <MagneticButton
                  variant="primary"
                  size="large"
                  className="w-full justify-center"
                  onClick={() => {
                    // Add to cart logic
                    console.log('Add to cart:', product.id);
                  }}
                >
                  {isSoldOut 
                    ? 'Sold Out' 
                    : product.preOrder 
                      ? 'Pre-Order Now' 
                      : 'Add to Cart'
                  }
                </MagneticButton>
              </StaggerItem>

              {/* Additional Info */}
              <StaggerItem>
                <div className="mt-10 pt-8 border-t border-black/10">
                  <details className="group">
                    <summary className="text-tiny uppercase tracking-[0.2em] text-black/50 cursor-pointer hover:text-black/70 transition-colors">
                      Shipping & Returns
                    </summary>
                    <div className="mt-4 text-[13px] text-black/60 leading-relaxed">
                      <p className="mb-2">Free shipping on orders over $75.</p>
                      <p>30-day returns on unused items in original packaging.</p>
                    </div>
                  </details>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
