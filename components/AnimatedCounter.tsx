'use client';

import { motion, useInView, useSpring, useMotionValue, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  once?: boolean;
}

export default function AnimatedCounter({
  from,
  to,
  duration = 2,
  className = '',
  prefix = '',
  suffix = '',
  once = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: (value) => setDisplayValue(Math.round(value)),
      });

      return () => controls.stop();
    }
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

// Year transition counter (2004 → 2024)
interface YearTransitionProps {
  fromYear: number;
  toYear: number;
  className?: string;
  duration?: number;
}

export function YearTransition({
  fromYear,
  toYear,
  className = '',
  duration = 3,
}: YearTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayYear, setDisplayYear] = useState(fromYear);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    if (isInView) {
      // Show arrow first
      const arrowTimer = setTimeout(() => setShowArrow(true), 500);
      
      // Then animate the year
      const yearTimer = setTimeout(() => {
        const controls = animate(fromYear, toYear, {
          duration: duration - 1,
          ease: [0.25, 0.1, 0.25, 1],
          onUpdate: (value) => setDisplayYear(Math.round(value)),
        });

        return () => controls.stop();
      }, 1000);

      return () => {
        clearTimeout(arrowTimer);
        clearTimeout(yearTimer);
      };
    }
  }, [isInView, fromYear, toYear, duration]);

  return (
    <div ref={ref} className={`flex items-center justify-center gap-6 ${className}`}>
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {fromYear}
      </motion.span>
      
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={showArrow ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.3 }}
        className="text-[0.5em]"
      >
        →
      </motion.span>
      
      <motion.span
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {displayYear}
      </motion.span>
    </div>
  );
}
