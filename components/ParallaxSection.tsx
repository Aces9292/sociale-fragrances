'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import Image from 'next/image';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number; // 0.5 = slower, 1.5 = faster
  direction?: 'up' | 'down';
}

export default function ParallaxSection({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const multiplier = direction === 'up' ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);
  const smoothY = useSpring(y, { damping: 50, stiffness: 100 });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y: smoothY }}>
        {children}
      </motion.div>
    </div>
  );
}

// Parallax image with Ken Burns effect
interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  kenBurns?: boolean;
  kenBurnsDuration?: number;
  overlay?: boolean;
  overlayOpacity?: number;
}

export function ParallaxImage({
  src,
  alt,
  className = '',
  speed = 0.3,
  kenBurns = true,
  kenBurnsDuration = 20,
  overlay = false,
  overlayOpacity = 0.2,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 30}%`]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  
  const smoothY = useSpring(y, { damping: 50, stiffness: 100 });
  const smoothScale = useSpring(scale, { damping: 50, stiffness: 100 });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{ 
          y: smoothY,
          scale: kenBurns ? undefined : smoothScale,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${kenBurns ? 'ken-burns' : ''}`}
          style={kenBurns ? { 
            animationDuration: `${kenBurnsDuration}s`,
          } : undefined}
        />
      </motion.div>
      
      {overlay && (
        <div 
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}

// Full-screen parallax hero
interface ParallaxHeroProps {
  backgroundSrc: string;
  backgroundAlt?: string;
  children: ReactNode;
  className?: string;
  overlayOpacity?: number;
  kenBurns?: boolean;
}

export function ParallaxHero({
  backgroundSrc,
  backgroundAlt = '',
  children,
  className = '',
  overlayOpacity = 0,
  kenBurns = true,
}: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  const smoothY = useSpring(y, { damping: 50, stiffness: 100 });
  const smoothOpacity = useSpring(opacity, { damping: 50, stiffness: 100 });

  return (
    <section ref={ref} className={`relative h-screen overflow-hidden ${className}`}>
      {/* Background with parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: smoothY }}
      >
        <Image
          src={backgroundSrc}
          alt={backgroundAlt}
          fill
          className={`object-cover ${kenBurns ? 'ken-burns' : ''}`}
          priority
        />
        
        {overlayOpacity > 0 && (
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        )}
      </motion.div>
      
      {/* Content with fade-out on scroll */}
      <motion.div 
        className="relative z-10 h-full"
        style={{ opacity: smoothOpacity }}
      >
        {children}
      </motion.div>
    </section>
  );
}
