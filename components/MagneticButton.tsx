'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, ReactNode, MouseEvent } from 'react';
import Link from 'next/link';


interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'large';
  magnetStrength?: number;
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  type = 'button',
  variant = 'primary',
  size = 'default',
  magnetStrength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * magnetStrength;
    const deltaY = (e.clientY - centerY) * magnetStrength;
    
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    
    onClick?.();
  };

  const handleMouseEnter = () => {
    
  };

  const baseStyles = `
    relative inline-flex items-center justify-center
    font-serif tracking-[0.15em] uppercase
    transition-all duration-300 ease-out
    overflow-hidden group
  `;

  const variants = {
    primary: `
      bg-black text-white
      hover:bg-black/90
      border-2 border-black
    `,
    secondary: `
      bg-white text-black
      hover:bg-black/5
      border-2 border-black
    `,
    outline: `
      bg-transparent text-black
      hover:bg-black hover:text-white
      border-2 border-black
    `,
  };

  const sizes = {
    default: 'px-8 py-4 text-[13px]',
    large: 'px-12 py-5 text-[14px]',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const buttonContent = (
    <>
      {/* Background hover effect */}
      <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
      
      {/* Text with subtle lift on hover */}
      <span className="relative z-10 group-hover:translate-y-[-1px] transition-transform duration-300">
        {children}
      </span>
    </>
  );

  const MotionComponent = href ? motion(Link) : motion.button;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ x: xSpring, y: ySpring }}
      className="inline-block"
    >
      {href ? (
        <Link href={href} className={combinedClassName} >
          {buttonContent}
        </Link>
      ) : (
        <button type={type} onClick={handleClick} className={combinedClassName}>
          {buttonContent}
        </button>
      )}
    </motion.div>
  );
}

// Magnetic wrapper for any element
interface MagneticWrapperProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticWrapper({
  children,
  className = '',
  strength = 0.2,
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 200 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
