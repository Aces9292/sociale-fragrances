'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  charDelay?: number;
  duration?: number;
  once?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export default function SplitText({
  text,
  className = '',
  charDelay = 0.04,
  duration = 0.5,
  once = true,
  as = 'h1',
}: SplitTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const Tag = as;

  const characters = text.split('');

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: charDelay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 100,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <Tag ref={ref} className={`${className} overflow-hidden`}>
      <motion.span
        className="inline-flex flex-wrap"
        variants={container}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{ perspective: 500 }}
      >
        {characters.map((char, index) => (
          <motion.span
            key={index}
            variants={child}
            className="inline-block origin-bottom"
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

// Word-by-word variant for subtitles
interface SplitWordsProps {
  text: string;
  className?: string;
  wordDelay?: number;
  duration?: number;
  once?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  startDelay?: number;
}

export function SplitWords({
  text,
  className = '',
  wordDelay = 0.08,
  duration = 0.6,
  once = true,
  as = 'p',
  startDelay = 0,
}: SplitWordsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const Tag = as;

  const words = text.split(' ');

  const container = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: startDelay,
        staggerChildren: wordDelay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <Tag ref={ref} className={`${className} overflow-hidden`}>
      <motion.span
        className="inline-flex flex-wrap"
        variants={container}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={child}
            className="inline-block mr-[0.3em]"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
