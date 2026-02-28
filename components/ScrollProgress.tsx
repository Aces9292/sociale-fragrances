'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

interface ScrollProgressProps {
  className?: string;
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
}

export default function ScrollProgress({
  className = '',
  color = '#000000',
  height = 3,
  position = 'top',
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed left-0 right-0 z-50 origin-left ${className}`}
      style={{
        [position]: 0,
        height,
        backgroundColor: color,
        scaleX,
      }}
    />
  );
}

// Scroll indicator (bouncing arrow)
interface ScrollIndicatorProps {
  className?: string;
  color?: string;
}

export function ScrollIndicator({ className = '', color = 'currentColor' }: ScrollIndicatorProps) {
  return (
    <motion.div
      className={`flex flex-col items-center ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <motion.span
        className="text-[11px] uppercase tracking-[0.3em] mb-3"
        style={{ color }}
      >
        Scroll
      </motion.span>
      <motion.svg
        width="20"
        height="30"
        viewBox="0 0 20 30"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <path d="M10 0 L10 25 M3 18 L10 25 L17 18" />
      </motion.svg>
    </motion.div>
  );
}
