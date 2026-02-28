/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      black: '#000000',
      white: '#FFFFFF',
      cream: '#FAF9F6',
      transparent: 'transparent',
      current: 'currentColor',
    },
    fontFamily: {
      serif: ['Marcellus', 'Georgia', 'serif'],
      sans: ['system-ui', '-apple-system', 'sans-serif'],
    },
    fontSize: {
      // MASSIVE display text (Byredo-level)
      'hero': ['clamp(80px, 15vw, 180px)', { lineHeight: '0.9', letterSpacing: '-0.04em', fontWeight: '400' }],
      'display': ['clamp(60px, 12vw, 140px)', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '400' }],
      
      // Large headlines
      'title': ['clamp(48px, 8vw, 96px)', { lineHeight: '1', letterSpacing: '-0.025em' }],
      'large': ['clamp(32px, 5vw, 56px)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      
      // Medium - body headlines
      'medium': ['clamp(20px, 3vw, 28px)', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
      'body-large': ['18px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
      
      // Body text
      'body': ['16px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
      
      // Small - labels, captions
      'small': ['12px', { lineHeight: '1.6', letterSpacing: '0.15em' }],
      'tiny': ['10px', { lineHeight: '1.5', letterSpacing: '0.2em' }],
    },
    spacing: {
      0: '0',
      px: '1px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px',
      32: '128px',
      40: '160px',
      48: '192px',
      56: '224px',
      64: '256px',
    },
    borderRadius: {
      none: '0',
      DEFAULT: '0',
      sm: '2px',
      md: '4px',
      lg: '8px',
      full: '9999px',
    },
    transitionDuration: {
      DEFAULT: '300ms',
      0: '0ms',
      150: '150ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    transitionTimingFunction: {
      DEFAULT: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      'premium': 'cubic-bezier(0.6, 0.05, 0.01, 0.9)',
      'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    extend: {
      maxWidth: {
        'content': '1440px',
        'wide': '1600px',
        'text': '680px',
        'narrow': '480px',
      },
      aspectRatio: {
        '3/4': '3 / 4',
        '4/3': '4 / 3',
        '16/10': '16 / 10',
        '21/9': '21 / 9',
      },
      animation: {
        'ken-burns': 'ken-burns 20s ease-out infinite alternate',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'slide-down': 'slide-down 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.08) translate(-1%, -1%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-shimmer': 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)',
        'iridescent': 'linear-gradient(135deg, rgba(255,182,193,0.3), rgba(173,216,230,0.3), rgba(221,160,221,0.3))',
      },
    },
  },
  plugins: [],
};
