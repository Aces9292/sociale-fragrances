'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import ScrollProgress from '@/components/ScrollProgress';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Track scroll position for styling changes
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.98)']
  );

  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.1)']
  );

  return (
    <>
      {/* Scroll Progress Indicator */}
      <ScrollProgress height={2} color="#000" />
      
      <motion.header 
        className="fixed top-0 left-0 right-0 z-40 h-[80px] md:h-[100px]"
        style={{ 
          backgroundColor: headerBg,
          borderBottomWidth: 1,
          borderBottomColor: headerBorder,
        }}
      >
        <div className="max-w-wide mx-auto h-full px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-[24px] md:text-[32px] font-serif tracking-tight text-black"
          >
            SOCIALE
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {['Shop', 'About', 'Contact', 'Cart'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`} 
                className="text-[13px] uppercase tracking-[0.15em] link-underline text-black"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-4">
              <motion.span 
                className="absolute left-0 w-full h-[1.5px] bg-current"
                style={{ top: 0 }}
                animate={{ 
                  rotate: menuOpen ? 45 : 0,
                  y: menuOpen ? 7 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-current"
                animate={{ opacity: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span 
                className="absolute left-0 bottom-0 w-full h-[1.5px] bg-current"
                animate={{ 
                  rotate: menuOpen ? -45 : 0,
                  y: menuOpen ? -7 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="fixed inset-0 bg-white z-30 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center gap-8">
              {['Shop', 'About', 'Contact', 'Cart'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-title font-serif"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Spacer for fixed header */}
      <div className="h-[80px] md:h-[100px]" />
    </>
  );
}
