import { ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  href,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    px-xl py-[20px]
    text-small uppercase-label
    font-serif
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      bg-black text-white
      hover:bg-white hover:text-black
      border-2 border-black
    `,
    secondary: `
      bg-white text-black
      hover:bg-black hover:text-white
      border-2 border-black
    `,
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
}
