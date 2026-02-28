# Sociale Fragrances - Design System
**Brand Guardian Approved Design System**

## Design Philosophy
**Byredo/Le Labo Minimal-Cool + Tom Ford Bold Luxury**

- Ultra-minimal, editorial luxury
- Strong typographic hierarchy
- Bold negative space
- Monochromatic with strategic brass accents
- Photography-first layouts

---

## Typography

### Font Stack
**Primary:** Marcellus (self-hosted)
**Fallback:** Georgia, serif

### Type Scale
```
h1: 72px / 1.1 line-height / -0.02em letter-spacing (Hero headlines)
h2: 48px / 1.2 / -0.01em (Section titles)
h3: 32px / 1.3 / 0em (Product titles)
h4: 24px / 1.4 / 0.01em (Subsections)
body: 16px / 1.6 / 0.02em (Body copy)
small: 13px / 1.5 / 0.04em (Captions, legal)
```

### Usage Guidelines
- **Brand lockup:** Marcellus, all caps, wide tracking (0.15em)
- **Headlines:** Sentence case, minimal tracking
- **Body:** Generous line-height for readability
- **Buttons:** Uppercase, Marcellus, 0.1em tracking

---

## Color Palette

### Primary Colors
```
Matte Black:     #000000 (primary text, lockup)
Charcoal:        #3D3D3D (secondary text)
Off-White:       #F7F5F0 (backgrounds, cream)
Pure White:      #FFFFFF (cards, overlays)
Warm Beige:      #E8DCC4 (borders, dividers)
```

### Accent Colors
```
Brushed Brass:   #B8860B (CTAs, hover states)
Brass Dark:      #9A7209 (active states)
Sage Green:      #81B29A (success, shipping info)
Dusty Rose:      #D4A5A5 (product highlights)
```

### Usage
- **Backgrounds:** Off-White default, Pure White for cards
- **Text:** Matte Black primary, Charcoal secondary
- **CTAs:** Brushed Brass with hover to Brass Dark
- **Borders:** Warm Beige (1px, subtle)

---

## Spacing Scale

### Base Unit: 8px

```
xs:  4px   (tight spacing, icon gaps)
sm:  8px   (text spacing, small gaps)
md:  16px  (standard padding)
lg:  24px  (section padding)
xl:  40px  (component gaps)
2xl: 64px  (large section spacing)
3xl: 96px  (hero spacing)
4xl: 128px (page-level spacing)
```

### Layout Grid
- **Max width:** 1440px (content container)
- **Gutters:** 40px desktop, 20px mobile
- **Columns:** 12-column grid, 40px gaps

---

## Components

### Buttons

**Primary CTA:**
```
Background: #B8860B (Brushed Brass)
Text: #FFFFFF
Padding: 16px 48px
Border-radius: 2px (sharp, minimal)
Font: Marcellus, 14px, uppercase, 0.1em tracking
Hover: Background → #9A7209
Transition: 300ms ease
```

**Secondary CTA:**
```
Background: transparent
Border: 1px solid #000000
Text: #000000
Padding: 16px 48px
Hover: Background → #000000, Text → #FFFFFF
```

**Text Link:**
```
Text: #000000
Underline: 1px solid #B8860B (offset 4px)
Hover: Text → #B8860B
```

### Cards

**Product Card:**
```
Background: #FFFFFF
Shadow: 0 4px 20px rgba(0,0,0,0.06)
Border-radius: 0 (sharp edges)
Padding: 0 (image full-bleed)
Hover: Transform translateY(-4px), shadow intensify
Transition: 300ms ease
```

**Content Card:**
```
Background: #F7F5F0
Border: 1px solid #E8DCC4
Padding: 48px
Border-radius: 2px
```

### Navigation

**Desktop:**
```
Height: 80px
Background: #FFFFFF
Border-bottom: 1px solid #E8DCC4
Logo: Center (Marcellus, 24px, uppercase)
Nav links: Left/Right (Marcellus, 14px, uppercase, 0.1em tracking)
Spacing: 40px between links
```

**Mobile:**
```
Hamburger menu (top-right)
Full-screen overlay (Off-White background)
Links: Centered, 32px, stacked vertically
```

---

## Layout Patterns

### Hero Section
```
Height: 100vh (full viewport)
Background: Large product photography (slight overlay)
Content: Centered, max-width 800px
Headline: 72px Marcellus
Subheadline: 20px, Charcoal
CTA: Primary button
Spacing: 96px vertical padding
```

### Product Grid
```
Columns: 3 (desktop), 2 (tablet), 1 (mobile)
Gap: 40px
Image aspect: 3:4 (portrait)
Hover: Slight lift + shadow
Text: Product name (24px), Price (16px, bold)
```

### Featured Product (Millennial Ma)
```
Layout: 2-column (50/50 split)
Left: Product image (full-bleed)
Right: Content (64px padding)
Badge: "NEW" (uppercase, 12px, Brass)
Title: 48px Marcellus
Description: 16px, Charcoal, 1.8 line-height
Price: 32px, bold
CTA: Primary button
Ship info: 13px, Sage Green
```

### Collections Section
```
Title: Centered, 48px, 64px margin-bottom
Grid: 3 columns, 40px gap
Card height: 400px
Image: Gradient or solid color overlay
Text: Centered, white on dark, black on light
CTA: Embedded in card
```

### Footer
```
Background: #F7F5F0
Border-top: 1px solid #E8DCC4
Padding: 80px vertical
Logo: Centered, 28px
Social icons: 40px circles, Brass background
Legal: 14px, Charcoal, centered
Links: Inline, separated by |
```

---

## Photography Guidelines

### Product Photography
- **Background:** Pure white or natural stone (marble/limestone)
- **Lighting:** Soft, natural, minimal shadows
- **Composition:** Centered, minimal props
- **Aspect:** 3:4 portrait for grid, 1:1 for featured

### Lifestyle Photography
- **Vibe:** Minimal, modern interiors
- **Colors:** Muted, neutral palettes
- **Props:** Minimal (books, simple vases, natural elements)
- **Avoid:** Busy patterns, bright colors, cluttered spaces

---

## Animation & Interactions

### Page Transitions
```
Duration: 400ms
Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
Type: Fade + slight upward motion (8px)
```

### Hover States
```
Buttons: Background color change (300ms)
Cards: Lift 4px + shadow intensify (300ms)
Links: Color change + underline slide (200ms)
Images: Slight scale (1.02) (500ms)
```

### Scroll Animations
```
Fade-in on scroll (elements enter viewport)
Stagger animations for grids (100ms delay between items)
Parallax: Subtle (hero backgrounds only)
```

---

## Breakpoints

```
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
Wide:    > 1440px
```

### Responsive Rules
- Mobile: Single column, full-width images, stacked navigation
- Tablet: 2-column grids, adjusted spacing
- Desktop: 3-column grids, full layout
- Wide: Max-width container (1440px), centered

---

## Accessibility

### Standards: WCAG AA

**Color Contrast:**
- Text on Off-White: 4.5:1 minimum
- White text on Brass: 4.5:1 minimum
- All interactive elements: 3:1 minimum

**Interactive Elements:**
- Minimum touch target: 44x44px
- Keyboard navigable (focus states)
- Alt text for all images
- ARIA labels for icon buttons

**Typography:**
- Minimum body size: 16px
- Scalable text (rem units)
- Line-height: 1.5 minimum for body

---

## SEO & Performance

### Meta Requirements
```
Title: [Page Name] | Sociale Fragrances
Description: 150-160 characters, keyword-rich
OpenGraph: Images (1200x630), title, description
Twitter Card: summary_large_image
```

### Image Optimization
- Format: WebP with JPEG fallback
- Lazy loading: All below-fold images
- Srcset: Responsive image sets
- Max size: 200KB compressed

### Performance Targets
- Lighthouse score: 90+
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Cumulative Layout Shift: <0.1

---

## Content Strategy

### Homepage
1. Hero: Bold statement + flagship product
2. Featured: Millennial Ma (Mother's Day campaign)
3. Collections: Pride, Boyfriend, Limited
4. Brand Story: Short paragraph, aspirational
5. Newsletter: Simple email capture
6. Instagram: 6-image grid

### Product Pages
1. Hero image (large, zoomable)
2. Title + price
3. Description (2-3 paragraphs, storytelling)
4. Scent notes (bullet list)
5. Details (burn time, wax type, wick)
6. Add to cart (prominent)
7. Related products (3-4)

### Voice & Tone
- **Confident, not arrogant**
- **Editorial, not corporate**
- **Warm, not overly feminine**
- **Storytelling-focused**
- **No exclamation points (ever)**

---

## Implementation Notes

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (custom config)
- **Font:** Marcellus (self-hosted from zip)
- **Images:** next/image (automatic optimization)
- **Forms:** React Hook Form
- **Analytics:** Placeholder (Google Analytics 4)
- **Newsletter:** Placeholder API endpoint

### File Structure
```
/app
  /page.tsx (Home)
  /shop/page.tsx (Collections)
  /shop/[slug]/page.tsx (Product)
  /about/page.tsx
  /contact/page.tsx
  /faq/page.tsx
  /privacy/page.tsx
  /terms/page.tsx
/components
  /Header.tsx
  /Footer.tsx
  /Button.tsx
  /ProductCard.tsx
  /Newsletter.tsx
/public
  /fonts/Marcellus.woff2
  /images/
/styles
  /globals.css (Tailwind + custom)
/lib
  /products.json (data layer)
```

### Deployment
- **Platform:** Vercel
- **Environment:** Production
- **Domain:** Point Squarespace DNS to Vercel
- **SSL:** Auto (Vercel)

---

**Design System Approved by Brand Guardian (Wren)**  
**Ready for Developer Agent Implementation**

---

## Quick Reference

**Primary Font:** Marcellus  
**Base Colors:** Black (#000000), Cream (#F7F5F0), Brass (#B8860B)  
**Max Width:** 1440px  
**Spacing Base:** 8px  
**Border Radius:** 0-2px (minimal)  
**Animation:** 300ms ease  
**Breakpoint:** 768px (mobile/desktop)

---

**Next Step:** Developer agent builds Next.js codebase following this system.
