'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorVariant = 'default' | 'hover' | 'button' | 'image' | 'hidden';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');
  const [isTouch, setIsTouch] = useState(true); // Default to true to prevent flash
  const [cursorText, setCursorText] = useState('');
  
  // Spring config for smooth, premium follow
  const springConfig = { damping: 28, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Trailing dot springs (slower follow)
  const trailXSpring = useSpring(cursorX, { damping: 50, stiffness: 200 });
  const trailYSpring = useSpring(cursorY, { damping: 50, stiffness: 200 });
  
  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };
    
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);
  
  // Mouse movement handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);
  
  // Element hover detection
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check for data-cursor attribute first
    const cursorType = target.closest('[data-cursor]')?.getAttribute('data-cursor');
    if (cursorType) {
      setCursorVariant(cursorType as CursorVariant);
      const text = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
      setCursorText(text || '');
      return;
    }
    
    // Image detection
    if (target.tagName === 'IMG' || target.closest('.img-zoom') || target.closest('[data-cursor="image"]')) {
      setCursorVariant('image');
      setCursorText('VIEW');
      return;
    }
    
    // Button detection
    if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('[role="button"]')) {
      setCursorVariant('button');
      setCursorText('');
      return;
    }
    
    // Link detection
    if (target.tagName === 'A' || target.closest('a')) {
      setCursorVariant('hover');
      setCursorText('');
      return;
    }
    
    // Default
    setCursorVariant('default');
    setCursorText('');
  }, []);
  
  // Hide cursor when leaving window
  const handleMouseLeave = useCallback(() => {
    setCursorVariant('hidden');
  }, []);
  
  const handleMouseEnter = useCallback(() => {
    setCursorVariant('default');
  }, []);
  
  useEffect(() => {
    if (isTouch) return;
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    
    // Add custom cursor class to body
    document.body.classList.add('cursor-custom');
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('cursor-custom');
    };
  }, [isTouch, handleMouseMove, handleMouseOver, handleMouseLeave, handleMouseEnter]);
  
  // Don't render on touch devices
  if (isTouch) return null;
  
  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      mixBlendMode: 'difference' as const,
    },
    hover: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
      mixBlendMode: 'normal' as const,
    },
    button: {
      width: 64,
      height: 64,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      mixBlendMode: 'normal' as const,
    },
    image: {
      width: 80,
      height: 80,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      mixBlendMode: 'normal' as const,
    },
    hidden: {
      width: 0,
      height: 0,
      opacity: 0,
    },
  };
  
  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }}
      >
        {/* Cursor text for image hover */}
        {cursorText && cursorVariant === 'image' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-white"
          >
            {cursorText}
          </motion.span>
        )}
        
        {/* Arrow for button hover */}
        {cursorVariant === 'button' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-lg text-black/50"
          >
            →
          </motion.span>
        )}
      </motion.div>
      
      {/* Trailing dot for extra smoothness */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] w-1 h-1 rounded-full bg-black/30"
        style={{
          x: trailXSpring,
          y: trailYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: cursorVariant === 'hidden' ? 0 : 0.5,
        }}
      />
    </>
  );
}
