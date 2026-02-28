'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product, SizeOption } from '@/lib/types';
import { getProductImage } from '@/lib/images';
import { useCart } from '@/lib/cart-context';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import MagneticButton from '@/components/MagneticButton';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const imageSrc = getProductImage(product.slug);
  const { addItem } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Size selection state
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const hasSizes = product.sizes && product.sizes.length > 0;
  const selectedSize: SizeOption | null = hasSizes ? product.sizes![selectedSizeIndex] : null;
  
  // Price and stock based on selection
  const displayPrice = selectedSize ? selectedSize.price : product.price;
  const displayStock = selectedSize ? selectedSize.stock : product.stock;
  
  const isLowStock = displayStock > 0 && displayStock < 3;
  const isSoldOut = displayStock === 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.slug,
      name: product.name,
      size: selectedSize?.name || 'Standard',
      price: displayPrice,
      quantity: 1,
      image: imageSrc,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

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
                <p className="text-large font-serif mb-6">${displayPrice}</p>
              </StaggerItem>

              {/* Size Selector */}
              {hasSizes && product.sizes!.length > 1 && (
                <StaggerItem>
                  <div className="mb-8">
                    <span className="text-tiny uppercase tracking-[0.2em] text-black/40 block mb-4">
                      Select Size
                    </span>
                    <div className="flex flex-col gap-3">
                      {product.sizes!.map((sizeOption, index) => {
                        const isSelected = index === selectedSizeIndex;
                        const sizeIsSoldOut = sizeOption.stock === 0;
                        
                        return (
                          <button
                            key={sizeOption.name}
                            onClick={() => !sizeIsSoldOut && setSelectedSizeIndex(index)}
                            disabled={sizeIsSoldOut}
                            className={`
                              relative flex items-center justify-between
                              px-5 py-4 border-2 transition-all duration-300
                              ${isSelected 
                                ? 'border-black bg-black text-white' 
                                : sizeIsSoldOut
                                  ? 'border-black/10 bg-black/5 text-black/30 cursor-not-allowed'
                                  : 'border-black/20 hover:border-black text-black'
                              }
                            `}
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-[14px] font-medium">
                                {sizeOption.name}
                              </span>
                              <span className={`text-[12px] ${isSelected ? 'text-white/70' : 'text-black/50'}`}>
                                {sizeOption.size}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[16px] font-serif">
                                ${sizeOption.price}
                              </span>
                              {sizeIsSoldOut && (
                                <span className="text-[10px] uppercase tracking-wider">
                                  Sold Out
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </StaggerItem>
              )}

              {/* Stock Indicator */}
              {isLowStock && !isSoldOut && (
                <StaggerItem>
                  <p className="text-tiny uppercase tracking-[0.2em] text-black/60 mb-6">
                    Only {displayStock} left in stock
                  </p>
                </StaggerItem>
              )}

              {/* Description */}
              <StaggerItem>
                <p className="text-body leading-relaxed text-black/70 mb-8 whitespace-pre-line">
                  {product.description}
                </p>
              </StaggerItem>

              {/* Scent Notes */}
              {product.scentNotes.length > 0 && product.scentNotes[0] !== '' && product.scentNotes[0] !== 'Variety Pack' && (
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

              {/* Bundle Contents */}
              {product.isBundle && product.bundleIncludes && (
                <StaggerItem>
                  <div className="mb-8 pb-8 border-b border-black/10">
                    <span className="text-tiny uppercase tracking-[0.2em] text-black/40 block mb-3">
                      Includes
                    </span>
                    <p className="text-[13px] text-black/70">
                      {product.bundleIncludes.join(' • ')}
                    </p>
                  </div>
                </StaggerItem>
              )}

              {/* Product Details */}
              <StaggerItem>
                <div className="mb-10 space-y-2 text-[13px] text-black/50">
                  {selectedSize && (
                    <p>{selectedSize.size}</p>
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
                {isSoldOut ? (
                  <button
                    className="w-full py-5 px-8 bg-black/20 text-black/40 text-[13px] uppercase tracking-[0.15em] cursor-not-allowed"
                    disabled
                  >
                    Sold Out
                  </button>
                ) : (
                  <MagneticButton
                    variant="primary"
                    size="large"
                    className="w-full justify-center"
                    onClick={handleAddToCart}
                  >
                    {addedToCart ? '✓ Added to Cart!' : product.preOrder ? 'Pre-Order Now' : 'Add to Cart'}
                  </MagneticButton>
                )}
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
