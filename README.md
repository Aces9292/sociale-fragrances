# SOCIALE - Next.js E-commerce Site

**Version 2.0 - Black & White Minimal Redesign**

A premium candle e-commerce site built with Next.js 14, featuring an ultra-minimal black and white design inspired by Byredo and Ralph Lauren.

## Design Philosophy

- **Pure Black & White** - Only #000000 and #FFFFFF. Color comes from product photography.
- **No Rounded Corners** - Sharp, modern rectangles throughout.
- **Instant Interactions** - Zero animations or transitions. Speed = luxury.
- **Aggressive Whitespace** - 240px section breaks, generous breathing room.
- **Massive Typography** - 96px hero text, confident scale.
- **Minimal Copy** - One line is better than two.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Typography:** Marcellus (Google Fonts)
- **Language:** TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## Pages

- `/` - Home (Hero, Featured, Collections, Manifesto, Newsletter)
- `/shop` - Product grid with category tabs
- `/shop/[slug]` - Individual product pages
- `/about` - Brand story
- `/contact` - Contact information
- `/faq` - Frequently asked questions
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/cart` - Shopping cart

## Design System

See `DESIGN_SYSTEM_V2.md` for complete design specifications.

### Color Palette
```
Black: #000000
White: #FFFFFF
```

### Typography Scale
```
Hero:   96px / 1.0
Title:  64px / 1.1
Large:  40px / 1.2
Medium: 24px / 1.3
Body:   16px / 1.8
Small:  12px / 1.5 (UPPERCASE)
```

### Spacing Scale
```
4xl: 240px (massive section breaks)
3xl: 160px (section spacing)
2xl: 120px (component spacing)
xl:  80px  (large gaps)
lg:  40px  (standard spacing)
md:  24px  (tight spacing)
sm:  12px  (minimal gaps)
xs:  4px   (hairline)
```

## Project Structure

```
sociale-nextjs/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── about/page.tsx
│   ├── cart/page.tsx
│   ├── contact/page.tsx
│   ├── faq/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   └── shop/
│       ├── page.tsx
│       └── [slug]/page.tsx
├── components/
│   ├── Button.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── ProductCard.tsx
├── lib/
│   ├── images.ts
│   ├── products.ts
│   └── types.ts
├── public/
│   └── images/products/
└── tailwind.config.js
```

## Product Collections

- **Pride Collection** - Fire Island, Palm Springs, Asbury Park, Provincetown
- **Boyfriend Collection** - Hipster, Bro, Ivy Leaguer
- **Special** - Ma (Limited Edition)

## Deployment

Ready for deployment to Vercel, Netlify, or any Node.js hosting platform.

```bash
npm run build
```

## V2 Changes from V1

1. Removed ALL accent colors (pure black/white only)
2. Removed animations/transitions (instant interactions)
3. Removed rounded corners (sharp edges)
4. Increased whitespace (240px sections)
5. Simplified navigation (3 links max)
6. Asymmetric layouts (not rigid grid)
7. Massive typography (96px hero)
8. Minimal copy throughout

---

Built with ❤️ in Connecticut
