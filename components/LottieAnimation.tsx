'use client';

import dynamic from 'next/dynamic';
import { CSSProperties } from 'react';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Inline Lottie JSON animations (small, optimized)

// Scroll indicator - subtle bouncing arrow
const scrollIndicatorData = {
  v: '5.5.7',
  fr: 30,
  ip: 0,
  op: 60,
  w: 50,
  h: 50,
  nm: 'scroll',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'arrow',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [25, 20, 0], e: [25, 30, 0], i: { x: 0.4, y: 1 }, o: { x: 0.6, y: 0 } },
            { t: 30, s: [25, 30, 0], e: [25, 20, 0], i: { x: 0.4, y: 1 }, o: { x: 0.6, y: 0 } },
            { t: 60, s: [25, 20, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'sh',
              d: 1,
              ks: {
                a: 0,
                k: {
                  c: false,
                  v: [[-8, -5], [0, 5], [8, -5]],
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                },
              },
            },
            {
              ty: 'st',
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 2 },
              lc: 2,
              lj: 2,
            },
            { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
    },
  ],
};

// Loading spinner - elegant rotating ring
const loadingData = {
  v: '5.5.7',
  fr: 60,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: 'loading',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'ring',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 60, s: [360] }] },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'el', d: 1, s: { a: 0, k: [40, 40] }, p: { a: 0, k: [0, 0] } },
            {
              ty: 'st',
              c: { a: 0, k: [0, 0, 0, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 2 },
              lc: 2,
              lj: 2,
              d: [{ n: 'd', nm: 'dash', v: { a: 0, k: 60 } }, { n: 'g', nm: 'gap', v: { a: 0, k: 80 } }],
            },
            { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
    },
  ],
};

// Success checkmark - satisfying check animation
const successData = {
  v: '5.5.7',
  fr: 60,
  ip: 0,
  op: 45,
  w: 100,
  h: 100,
  nm: 'success',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'check',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [0, 0, 100], e: [110, 110, 100], i: { x: 0.2, y: 1 }, o: { x: 0.8, y: 0 } },
            { t: 20, s: [110, 110, 100], e: [100, 100, 100] },
            { t: 30, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'sh',
              d: 1,
              ks: {
                a: 0,
                k: {
                  c: false,
                  v: [[-15, 0], [-5, 10], [15, -10]],
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                },
              },
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.2, 0.7, 0.3, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 4 },
              lc: 2,
              lj: 2,
            },
            {
              ty: 'tm',
              s: { a: 0, k: 0 },
              e: {
                a: 1,
                k: [
                  { t: 10, s: [0], e: [100], i: { x: 0.2, y: 1 }, o: { x: 0.8, y: 0 } },
                  { t: 35, s: [100] },
                ],
              },
              o: { a: 0, k: 0 },
            },
            { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
      ],
      ip: 0,
      op: 45,
      st: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'circle',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [0, 0, 100], e: [110, 110, 100], i: { x: 0.2, y: 1 }, o: { x: 0.8, y: 0 } },
            { t: 15, s: [110, 110, 100], e: [100, 100, 100] },
            { t: 25, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'el', d: 1, s: { a: 0, k: [60, 60] }, p: { a: 0, k: [0, 0] } },
            {
              ty: 'st',
              c: { a: 0, k: [0.2, 0.7, 0.3, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
              lc: 2,
              lj: 2,
            },
            { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
      ],
      ip: 0,
      op: 45,
      st: 0,
    },
  ],
};

interface LottieAnimationProps {
  type: 'scroll' | 'loading' | 'success';
  loop?: boolean;
  autoplay?: boolean;
  style?: CSSProperties;
  className?: string;
  onComplete?: () => void;
}

export default function LottieAnimation({
  type,
  loop = true,
  autoplay = true,
  style,
  className,
  onComplete,
}: LottieAnimationProps) {
  const animationData = {
    scroll: scrollIndicatorData,
    loading: loadingData,
    success: successData,
  }[type];
  
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      style={style}
      className={className}
      onComplete={onComplete}
    />
  );
}

// Export scroll indicator as standalone component for hero
export function LottieScrollIndicator({ color = 'white' }: { color?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span 
        className="text-[10px] uppercase tracking-[0.3em] opacity-60"
        style={{ color }}
      >
        Scroll
      </span>
      <div className="w-[30px] h-[30px]" style={{ filter: color === 'white' ? 'none' : 'invert(1)' }}>
        <LottieAnimation type="scroll" />
      </div>
    </div>
  );
}
