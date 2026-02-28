'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SoundToggle from './SoundToggle';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-wide mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link href="/" className="text-[32px] font-serif block mb-6">
              SOCIALE
            </Link>
            <p className="text-[14px] text-white/60 leading-relaxed max-w-[320px]">
              Natural soy wax candles. Handcrafted in Connecticut.
              Scents inspired by the places and people that shaped us.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6">
              Navigate
            </h4>
            <nav className="flex flex-col gap-4">
              {['Shop', 'About', 'Contact', 'FAQ'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-[14px] text-white/80 hover:text-white transition-colors duration-300 link-underline inline-block"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6">
              Legal
            </h4>
            <nav className="flex flex-col gap-4">
              {[
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
              ].map((item) => (
                <Link 
                  key={item.label}
                  href={item.href}
                  className="text-[14px] text-white/80 hover:text-white transition-colors duration-300 link-underline inline-block"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6">
              Follow
            </h4>
            <nav className="flex flex-col gap-4">
              {['Instagram', 'TikTok'].map((item) => (
                <a 
                  key={item}
                  href="#"
                  className="text-[14px] text-white/80 hover:text-white transition-colors duration-300 link-underline inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-wide mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/40">
            © {currentYear} Sociale Fragrances. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <SoundToggle />
            <p className="text-[12px] text-white/40">
              Made with care in Connecticut
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
