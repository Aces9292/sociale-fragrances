'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import SplitText, { SplitWords } from '@/components/SplitText';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import MagneticButton from '@/components/MagneticButton';
import { ParallaxImage, ParallaxHero } from '@/components/ParallaxSection';
import { YearTransition } from '@/components/AnimatedCounter';
import { KenBurnsCarousel } from '@/components/ImageCarousel';
import { LottieScrollIndicator } from '@/components/LottieAnimation';
import { SuccessAnimation } from '@/components/LoadingScreen';


// Hero images for carousel rotation - Premium campaign shots
const heroImages = [
  {
    src: '/images/campaign/001-then-and-now-mom-nostalgia-flat-lay-blac.png',
    alt: 'Then & Now - Y2K Girl to Mom',
  },
  {
    src: '/images/campaign/sociale-ma-real-y2k.jpg',
    alt: 'SOCIALE Ma Candle - Y2K Nostalgia with Furbys',
  },
  {
    src: '/images/campaign/001-millennial-mom-nightstand-product-photog.png',
    alt: 'Millennial Mom Nightstand - Baby Monitor & Memories',
  },
  {
    src: '/images/campaign/001-grown-up-girl-aesthetic-flat-lay-matte-b.png',
    alt: 'Grown Up - Friendship Bracelet to Tennis Bracelet',
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      
      setNewsletterSubmitted(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setNewsletterSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <section ref={heroRef} className="relative h-screen -mt-[80px] md:-mt-[100px] flex items-center justify-center overflow-hidden">
        {/* Background Image Carousel with Ken Burns */}
        <motion.div 
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <KenBurnsCarousel 
            images={heroImages} 
            interval={8000}
            className="h-full w-full"
          />
        </motion.div>

        {/* Hero Content - Massive Typography */}
        <motion.div 
          className="relative z-10 text-center px-6"
          style={{ opacity: heroOpacity }}
        >
          {/* Small label above */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="block text-white uppercase-label mb-8 text-shadow"
          >
            Mother's Day 2026
          </motion.span>

          {/* MASSIVE headline with split text animation */}
          <SplitText
            text="MA"
            as="h1"
            className="text-hero text-white font-serif text-shadow-strong"
            charDelay={0.1}
            duration={0.8}
          />

          {/* Subtitle with word-by-word reveal */}
          <div className="mt-8 space-y-2">
            <SplitWords
              text="that iconic body spray, all grown up."
              as="p"
              className="text-medium text-white/90 font-serif text-shadow"
              startDelay={0.6}
              wordDelay={0.1}
            />
            <SplitWords
              text="For the moms who survived Y2K."
              as="p"
              className="text-body-large text-white/80 font-serif text-shadow"
              startDelay={1.0}
              wordDelay={0.08}
            />
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-12"
          >
            <MagneticButton 
              href="/shop/ma" 
              variant="secondary"
              size="large"
              className="bg-white/95 backdrop-blur-sm"
            >
              Pre-Order Now
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Animated Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <LottieScrollIndicator color="white" />
        </motion.div>
      </section>

      {/* ==================== FEATURED PRODUCT - ASYMMETRIC ==================== */}
      <section className="relative">
        <div className="grid-asymmetric min-h-screen">
          {/* Left - Large Image with Parallax (60%) */}
          <div className="relative h-[70vh] md:h-screen">
            <ParallaxImage
              src="/images/campaign/ma-hero-posh.jpg"
              alt="Millennial Ma Candle"
              className="h-full"
              speed={0.2}
              kenBurns={false}
            />
            {/* Floating label */}
            <ScrollReveal
              className="absolute bottom-10 left-10"
              direction="up"
              delay={0.3}
            >
              <span className="text-tiny uppercase tracking-[0.3em] text-white bg-black px-4 py-2">
                New Arrival
              </span>
            </ScrollReveal>
          </div>

          {/* Right - Content Block (40%) */}
          <div className="flex items-center bg-cream">
            <div className="p-10 md:p-16 lg:p-20 max-w-[540px]">
              <StaggerContainer staggerDelay={0.15}>
                <StaggerItem>
                  <span className="text-tiny uppercase-label block mb-6 tracking-[0.25em] text-black/60">
                    Limited Edition
                  </span>
                </StaggerItem>

                <StaggerItem>
                  <h2 className="text-title font-serif mb-8">Millennial Ma</h2>
                </StaggerItem>

                <StaggerItem>
                  <p className="text-body-large leading-relaxed mb-6 text-black/80">
                    OMG. Remember that iconic body spray?
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <p className="text-body leading-relaxed mb-6 text-black/70">
                    That Bath & Body Works scent you wore every. single. day.
                    You'd spray it before school. Your mom would complain about the smell.
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <p className="text-body leading-relaxed mb-8 text-black/70">
                    Fast forward 20 years. Plot twist: <em>You're the mom now.</em>
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <div className="space-y-1 mb-8 text-small text-black/50 uppercase tracking-widest">
                    <p>That scent from 2004 · You know the one</p>
                    <p>Vanilla · Warm, cozy, grown-up</p>
                    <p>60 hours of pure nostalgia</p>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <p className="text-large font-serif mb-2">$42</p>
                  <p className="text-tiny uppercase tracking-[0.2em] text-black/50 mb-8">
                    Pre-Order for Mother's Day
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <MagneticButton href="/shop/ma" variant="primary" size="large">
                    Pre-Order Now
                  </MagneticButton>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MANIFESTO - YEAR TRANSITION ==================== */}
      <section className="bg-black text-white py-32 md:py-48">
        <div className="max-w-content mx-auto px-6 text-center">
          {/* Animated Year Counter */}
          <ScrollReveal direction="none">
            <YearTransition
              fromYear={2004}
              toYear={2026}
              className="text-display font-serif mb-16"
              duration={4}
            />
          </ScrollReveal>

          {/* Manifesto Text */}
          <div className="max-w-text mx-auto space-y-8">
            <ScrollReveal delay={0.3}>
              <p className="text-medium font-serif leading-[1.8] text-white/90">
                Butterfly clips. Low-rise jeans. Chunky highlights. 
                A cloud of that iconic body spray that announced your presence three hallways away.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <p className="text-medium font-serif leading-[1.8] text-white/90">
                Your mom? Total eye-roll material.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.7}>
              <p className="text-large font-serif leading-[1.6] text-white mt-12">
                Plot twist: You ARE the mom now.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.9}>
              <p className="text-body text-white/60 mt-8 uppercase tracking-[0.2em]">
                "Because I said so" is now your catchphrase.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ==================== COLLECTIONS - SOPHISTICATED GRID ==================== */}
      <section className="py-24 md:py-40">
        <div className="max-w-wide mx-auto px-6">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-16 md:mb-24">
            <span className="text-tiny uppercase-label block mb-4 tracking-[0.3em] text-black/50">
              Explore
            </span>
            <h2 className="text-title font-serif">Collections</h2>
          </ScrollReveal>

          {/* Asymmetric Grid */}
          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-6">
            {/* Pride - Full Width Top */}
            <ScrollReveal className="md:col-span-12 relative group" delay={0.1}>
              <Link href="/shop?collection=pride" className="block">
                <div className="relative h-[50vh] md:h-[70vh] overflow-hidden img-zoom">
                  <Image
                    src="/images/products/google-photos/pride-collection-lifestyle.jpg"
                    alt="Pride Collection"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
                  
                  {/* Floating Title - Bottom Left */}
                  <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                    <span className="text-tiny uppercase tracking-[0.3em] text-white/70 block mb-2">
                      Collection
                    </span>
                    <h3 className="text-large md:text-title font-serif text-white text-shadow">
                      Pride
                    </h3>
                  </div>

                  {/* Arrow - Bottom Right */}
                  <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
                    <span className="text-white text-2xl group-hover:translate-x-2 transition-transform duration-300 inline-block">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Boyfriend - 7 columns */}
            <ScrollReveal className="md:col-span-7 relative group" delay={0.2}>
              <Link href="/shop?collection=boyfriend" className="block">
                <div className="relative h-[60vh] md:h-[80vh] overflow-hidden img-zoom">
                  <Image
                    src="/images/products/the+bro+1.jpg"
                    alt="Boyfriend Collection"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
                  
                  <div className="absolute bottom-8 left-8">
                    <span className="text-tiny uppercase tracking-[0.3em] text-white/70 block mb-2">
                      Collection
                    </span>
                    <h3 className="text-large font-serif text-white text-shadow">
                      Boyfriend
                    </h3>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Limited Edition - 5 columns, offset */}
            <ScrollReveal className="md:col-span-5 md:mt-24 relative group" delay={0.3}>
              <Link href="/shop?collection=limited" className="block">
                <div className="relative h-[50vh] md:h-[60vh] overflow-hidden img-zoom">
                  <Image
                    src="/images/products/DSC_0307.jpg"
                    alt="Limited Edition"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
                  
                  <div className="absolute bottom-8 left-8">
                    <span className="text-tiny uppercase tracking-[0.3em] text-white/70 block mb-2">
                      Collection
                    </span>
                    <h3 className="text-large font-serif text-white text-shadow">
                      Limited Edition
                    </h3>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ==================== BRAND STATEMENT ==================== */}
      <section className="py-32 md:py-48 bg-cream">
        <div className="max-w-text mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="text-large md:text-title font-serif leading-[1.4]">
              Natural soy wax.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-large md:text-title font-serif leading-[1.4]">
              Essential oils.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="text-large md:text-title font-serif leading-[1.4]">
              Handcrafted in Connecticut.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <p className="text-body text-black/60 mt-12 max-w-[400px] mx-auto leading-relaxed">
              We make candles that tell stories—scents inspired by the places 
              and people that shaped us. No filler. No pretense. Just light.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.7}>
            <div className="mt-12">
              <MagneticButton href="/about" variant="outline">
                Our Story
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================== NEWSLETTER - PREMIUM ==================== */}
      <section className="py-24 md:py-32 border-t border-black/10">
        <div className="max-w-[500px] mx-auto px-6 text-center">
          <ScrollReveal>
            <span className="text-tiny uppercase-label block mb-6 tracking-[0.25em] text-black/50">
              Stay in the loop
            </span>
            <h2 className="text-large font-serif mb-8">
              Join the Inner Circle
            </h2>
            <p className="text-body text-black/60 mb-10">
              Early access, exclusive drops, and stories from behind the scenes.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            {newsletterSubmitted ? (
              <div className="py-8">
                <SuccessAnimation 
                  show={true} 
                  message="Welcome to the inner circle!" 
                />
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-6 py-5 bg-cream border-0 text-body font-serif 
                           placeholder:text-black/40 focus:outline-none focus:ring-2 
                           focus:ring-black/20 transition-all duration-300"
                  required
                />
                <MagneticButton type="submit" variant="primary" className="w-full">
                  Subscribe
                </MagneticButton>
              </form>
            )}
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-tiny text-black/40 mt-6">
              No spam, ever. Unsubscribe anytime.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
