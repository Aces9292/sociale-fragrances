'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import SplitText, { SplitWords } from '@/components/SplitText';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import MagneticButton from '@/components/MagneticButton';
import { ParallaxImage } from '@/components/ParallaxSection';
import { YearTransition } from '@/components/AnimatedCounter';
import { ScrollIndicator } from '@/components/ScrollProgress';

export default function MaCampaignPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="bg-white overflow-hidden">
      {/* ==================== HERO ==================== */}
      <section ref={heroRef} className="relative h-screen -mt-[80px] md:-mt-[100px] overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <Image
            src="/images/campaign/ma-hero-posh.jpg"
            alt="Millennial Ma Campaign"
            fill
            className="object-cover ken-burns"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>

        <motion.div 
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: heroOpacity }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-tiny uppercase tracking-[0.4em] text-white/80 mb-8"
          >
            A Love Letter to Millennial Moms
          </motion.span>

          <SplitText
            text="MA"
            as="h1"
            className="text-hero text-white font-serif text-shadow-strong"
            charDelay={0.15}
            duration={0.8}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-medium text-white/90 font-serif mt-8 text-shadow"
          >
            that body spray, all grown up.
          </motion.p>
        </motion.div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <ScrollIndicator color="rgba(255,255,255,0.7)" />
        </div>
      </section>

      {/* ==================== YEAR TRANSITION ==================== */}
      <section className="py-32 md:py-48 bg-black text-white">
        <div className="max-w-content mx-auto px-6 text-center">
          <ScrollReveal>
            <YearTransition
              fromYear={2004}
              toYear={2024}
              className="text-display font-serif mb-16"
              duration={4}
            />
          </ScrollReveal>

          <div className="max-w-text mx-auto space-y-8">
            <ScrollReveal delay={0.3}>
              <p className="text-medium font-serif leading-relaxed text-white/90">
                Twenty years ago, you were drenching yourself in that body spray 
                before first period.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.5}>
              <p className="text-medium font-serif leading-relaxed text-white/90">
                Now you're the mom. The eye-roll recipient. The one who's 
                embarrassing on purpose.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.7}>
              <p className="text-large font-serif leading-relaxed text-white mt-12">
                Plot twist: She was right all along.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ==================== THE STORY - SPLIT LAYOUT ==================== */}
      <section className="grid-asymmetric min-h-screen">
        {/* Image */}
        <div className="relative h-[60vh] md:h-auto">
          <ParallaxImage
            src="/images/products/DSC_0235.jpg"
            alt="Ma Candle"
            className="h-full md:h-screen md:sticky md:top-0"
            speed={0.15}
            kenBurns={false}
          />
        </div>

        {/* Content */}
        <div className="flex items-center bg-cream">
          <div className="p-10 md:p-16 lg:p-20">
            <StaggerContainer staggerDelay={0.15}>
              <StaggerItem>
                <span className="text-tiny uppercase tracking-[0.3em] text-black/50 block mb-8">
                  2004 → Present
                </span>
              </StaggerItem>

              <StaggerItem>
                <h2 className="text-title font-serif mb-10">The Glow Up</h2>
              </StaggerItem>

              <StaggerItem>
                <p className="text-body-large leading-relaxed mb-6 text-black/80">
                  Picture it: Your bedroom. Magazine cutouts of Chad Michael Murray. 
                  A Razr phone you flip dramatically. Jeans so low your thong shows.
                </p>
              </StaggerItem>

              <StaggerItem>
                <p className="text-body leading-relaxed mb-6 text-black/70">
                  Your mom yells to turn down Dashboard Confessional. 
                  You roll your eyes. She doesn't understand <em>anything</em>.
                </p>
              </StaggerItem>

              <StaggerItem>
                <p className="text-body leading-relaxed mb-8 text-black/70">
                  You douse yourself in that body spray. Every. Single. Day.
                  It wasn't body spray—it was a <em>personality</em>.
                </p>
              </StaggerItem>

              <StaggerItem>
                <div className="pt-8 border-t border-black/10">
                  <p className="text-medium font-serif text-black/90">
                    Now your daughter rolls her eyes at you.
                    And you smile. Because you remember being her.
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ==================== Y2K NOSTALGIA GRID ==================== */}
      <section className="py-32 md:py-48 bg-black text-white">
        <div className="max-w-wide mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <span className="text-tiny uppercase tracking-[0.3em] text-white/50 block mb-4">
              If You Remember These
            </span>
            <h2 className="text-title font-serif">This Candle Is For You</h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              '🦋 Butterfly Clips',
              '👖 Low-Rise Jeans',
              '💇‍♀️ Chunky Highlights',
              '💜 Pink Mist Vibes',
              '💋 Frosted Lip Gloss',
              '📱 Razr Flip Phone',
              '💬 AIM Away Messages',
              '💎 Juicy Tracksuit',
              '📺 The O.C.',
              '🏖️ Laguna Beach',
              '🛍️ Abercrombie',
              '🎵 Dashboard Confessional',
            ].map((item, index) => (
              <ScrollReveal
                key={item}
                delay={index * 0.05}
                className="text-center py-6 border border-white/20 hover:border-white/40 transition-colors duration-300"
              >
                <span className="text-[13px] uppercase tracking-[0.1em] text-white/80">
                  {item}
                </span>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.5} className="text-center mt-16">
            <p className="text-body text-white/60">
              You lived through it. Now your kids think it's "vintage." 😭
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================== SCENT NOTES ==================== */}
      <section className="py-32 md:py-48">
        <div className="max-w-text mx-auto px-6 text-center">
          <ScrollReveal>
            <span className="text-tiny uppercase tracking-[0.3em] text-black/50 block mb-4">
              The Scent
            </span>
            <h2 className="text-title font-serif mb-16">What's In The Bottle</h2>
          </ScrollReveal>

          <div className="space-y-16">
            {[
              {
                name: 'Pink Mist',
                emoji: '✨',
                desc: 'THE scent of 2004. Cherry blossom, peach, white musk. You wore it to seventh period AND the mall.',
              },
              {
                name: 'Vanilla',
                emoji: '🍪',
                desc: 'Warm, cozy, main character vibes. This is what your kids will remember as "how mom\'s house always smelled."',
              },
              {
                name: 'Amber',
                emoji: '🧡',
                desc: 'The bridge between your chaotic 2004 energy and your sophisticated 2024 era. Sweet meets grown.',
              },
            ].map((note, index) => (
              <ScrollReveal key={note.name} delay={index * 0.15}>
                <div className="space-y-3">
                  <span className="text-3xl">{note.emoji}</span>
                  <h3 className="text-large font-serif">{note.name}</h3>
                  <p className="text-body text-black/70 max-w-[400px] mx-auto leading-relaxed">
                    {note.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PRODUCT CTA ==================== */}
      <section className="py-32 md:py-48 bg-cream">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Product Image */}
            <ScrollReveal direction="left">
              <div className="relative aspect-square">
                <Image
                  src="/images/products/001-professional-product-photography-silver-.png"
                  alt="Ma Candle - Silver 3-Wick Vessel"
                  fill
                  className="object-contain"
                />
              </div>
            </ScrollReveal>

            {/* Product Info */}
            <div className="text-center md:text-left">
              <StaggerContainer staggerDelay={0.1}>
                <StaggerItem>
                  <span className="text-tiny uppercase tracking-[0.3em] text-black/50 block mb-4">
                    Limited Edition
                  </span>
                </StaggerItem>

                <StaggerItem>
                  <h2 className="text-display font-serif mb-4">Ma</h2>
                </StaggerItem>

                <StaggerItem>
                  <p className="text-large font-serif mb-8">$42</p>
                </StaggerItem>

                <StaggerItem>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-black/50 space-y-2 mb-10">
                    <p>60 Hour Burn Time</p>
                    <p>Natural Soy, Palm, Coconut Wax</p>
                    <p>Essential Oils Only</p>
                    <p>Handcrafted in Connecticut</p>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <p className="text-tiny uppercase tracking-[0.2em] text-black/70 mb-8">
                    Pre-Order · Ships for Mother's Day
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

      {/* ==================== FINAL MANIFESTO ==================== */}
      <section className="py-32 md:py-48 bg-black text-white text-center">
        <div className="max-w-text mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-title font-serif mb-8">
              You Became Your Mother
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <p className="text-medium font-serif text-white/80 mb-12 leading-relaxed">
              And honestly? That's the biggest compliment.
              She was right all along.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <MagneticButton href="/shop/ma" variant="secondary" size="large">
              Pre-Order Ma
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
