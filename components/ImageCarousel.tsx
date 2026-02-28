'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselImage {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  interval?: number; // ms between transitions
  className?: string;
}

export default function ImageCarousel({ 
  images, 
  interval = 6000,
  className = '' 
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-advance
  useEffect(() => {
    if (images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [images.length, interval]);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ 
            duration: 1.5, 
            ease: [0.25, 0.1, 0.25, 1] 
          }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            className="object-cover ken-burns"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
      
      {/* Carousel indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                idx === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Enhanced Ken Burns effect with multiple images
export function KenBurnsCarousel({ 
  images, 
  interval = 8000,
  className = '' 
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward (for Ken Burns variety)
  
  useEffect(() => {
    if (images.length <= 1) return;
    
    const timer = setInterval(() => {
      setDirection(Math.random() > 0.5 ? 1 : -1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [images.length, interval]);
  
  // Generate random Ken Burns params for variety
  const getKenBurnsStyle = useCallback((idx: number) => {
    const variations = [
      { startScale: 1, endScale: 1.1, translateX: '0%', translateY: '0%' },
      { startScale: 1.1, endScale: 1, translateX: '-2%', translateY: '-1%' },
      { startScale: 1, endScale: 1.08, translateX: '1%', translateY: '-2%' },
      { startScale: 1.05, endScale: 1, translateX: '-1%', translateY: '1%' },
    ];
    return variations[idx % variations.length];
  }, []);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ 
              scale: getKenBurnsStyle(currentIndex).startScale,
              x: '0%',
              y: '0%'
            }}
            animate={{ 
              scale: getKenBurnsStyle(currentIndex).endScale,
              x: getKenBurnsStyle(currentIndex).translateX,
              y: getKenBurnsStyle(currentIndex).translateY,
            }}
            transition={{ 
              duration: interval / 1000,
              ease: 'linear'
            }}
          >
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}
