# Sociale Fragrances - Design System V2
**Byredo Black & White Minimal + Ralph Lauren CT Sophistication**

## Core Philosophy

**ULTRA-MINIMAL. MONOCHROME. PHOTOGRAPHY-FIRST.**

- Black and white ONLY (no accent colors)
- Color comes from product photography
- Less is more (aggressive whitespace)
- Sharp, modern, edgy
- Editorial sophistication

---

## Color Palette

### Only Two Colors

```
Pure Black:  #000000 (text, headers, borders)
Pure White:  #FFFFFF (backgrounds, reversed text)
```

**That's it. No grays. No accents. Just black and white.**

### Usage
- **Backgrounds:** Pure white
- **Text:** Pure black
- **Borders:** 1px pure black
- **Hover states:** Invert (black ↔ white)
- **Color:** Only from product images

---

## Typography

### Font
**Marcellus** (self-hosted, serif)
**Fallback:** system-ui (for speed)

### Scale (Aggressive sizing)
```
h1: 96px / 1.0 / -0.03em (Hero - MASSIVE)
h2: 64px / 1.1 / -0.02em (Section titles)
h3: 40px / 1.2 / -0.01em (Product names)
h4: 24px / 1.3 / 0 (Subsections)
body: 16px / 1.8 / 0.01em (Generous line-height)
small: 12px / 1.5 / 0.05em (Captions - UPPERCASE)
```

### Rules
- **Brand lockup:** "SOCIALE" only (no "FRAGRANCES" - too much)
- **All caps for labels:** PRIDE, BOYFRIEND, NEW
- **Sentence case for everything else**
- **Minimal text** (one line is better than two)

---

## Layout

### Grid
- **Max width:** 1280px (tight, not 1440px)
- **Gutters:** 60px desktop, 24px mobile
- **Columns:** Asymmetric (not 12-grid - more dynamic)

### Spacing (Aggressive whitespace)
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

### Principles
- **Empty space is design**
- **One element per viewport** (no clutter)
- **Scroll is good** (don't cram)

---

## Components

### Buttons

**Primary:**
```
Background: #000000
Text: #FFFFFF
Padding: 20px 60px (wide, substantial)
Border: none
Font: Marcellus, 12px, UPPERCASE, 0.2em tracking
Hover: Invert colors (white bg, black text)
Transition: instant (no fade - sharp)
```

**Secondary:**
```
Background: transparent
Border: 2px solid #000000
Text: #000000
Padding: 18px 58px (account for border)
Hover: Invert
```

**No rounded corners. Ever. Sharp rectangles only.**

### Product Cards

**Minimal:**
```
Image: Full-bleed, 3:4 aspect
No border, no shadow, no hover lift
Text below: Product name (40px), Price (16px, black)
Spacing: 80px vertical gap between cards
On hover: Slight opacity (0.8) on image ONLY
```

### Navigation

**Ultra-minimal header:**
```
Height: 100px (generous)
Logo: Left aligned, "SOCIALE" (32px, black)
Nav: Right aligned, 3 links max (SHOP, ABOUT, CONTACT)
Spacing: 60px between nav items
No dividers, no cart icon (just text link: CART)
Border-bottom: 1px solid black
```

**Mobile:**
```
Logo centered
Menu: Three-line icon (top right)
Overlay: Full-screen white, black text, massive (48px)
```

---

## Page Layouts

### Home

**1. Hero (Full viewport)**
```
Layout: Single centered image (candle product shot)
Size: 80vh height
Text overlay: "SOCIALE" (96px, centered, white)
Scroll indicator: Simple arrow down
Background: White (image has natural shadows)
```

**2. Featured Product (Millennial Ma)**
```
Layout: Full-width image left, text right (60/40 split)
Image: Full-bleed to edge
Text: Floating right column
  - "NEW" (12px uppercase)
  - "Ma" (64px)
  - Single-line description (16px)
  - "$42" (24px)
  - [PRE-ORDER] button
Spacing: 160px vertical padding
```

**3. Collections Grid**
```
Layout: 2 columns only (not 3 - more breathing room)
Images: Square (1:1), large
Text: Overlaid on image (white text, black semi-transparent bg)
No titles, just: "PRIDE" and "BOYFRIEND" (40px)
Spacing: 80px gap between cards
```

**4. Manifesto (Brand story)**
```
Layout: Centered column, max 600px wide
Text: 24px, generous line-height (2.0)
Minimal copy: 3-4 sentences max
Black on white
Spacing: 240px top/bottom padding
```

**5. Newsletter**
```
Layout: Single line form
Input + Button side-by-side
Center aligned
Minimal label: "Stay informed" (12px above)
```

### Shop Page

**Minimal grid:**
```
Filter tabs: Top (ALL, PRIDE, BOYFRIEND, SPECIAL)
Grid: 2 columns (desktop), 1 (mobile)
Cards: Image + Name + Price only
Stock: "Only X left" if < 3 (not 5 - more exclusive)
Sold out: "SOLD OUT" overlay (white text on black bar)
Spacing: 120px vertical gaps
```

### Product Page

**Asymmetric layout:**
```
Left: Image gallery (80% width, full-bleed)
Right: Product details (20% width, floating column)
  - Name (40px)
  - Price (24px)
  - Stock indicator
  - Description (16px, max 3 lines)
  - Scent notes (12px, uppercase list)
  - [ADD TO CART] button
Spacing: Minimal (tight text stack)
```

---

## Photography Style

### Product Shots
- **Background:** Pure white OR natural stone (marble/limestone)
- **Lighting:** Hard light with defined shadows (not soft)
- **Composition:** Off-center (not perfectly centered - more dynamic)
- **Framing:** Tight crop (fill the frame)

### Lifestyle
- **Environment:** Minimal modern spaces (white walls, natural light)
- **Props:** Almost none (one book, simple vase max)
- **Colors:** Let candles provide the color
- **Vibe:** Editorial, not lifestyle-y

---

## Interactions

### Animations
**NONE.** Or instant only.

- No fades
- No slides
- No delays
- **Instant** hover state changes (0ms)
- Page transitions: Instant

**Rationale:** Speed = luxury. Slow animations = cheap.

### Hover States
```
Buttons: Instant invert
Links: Instant underline (2px)
Images: 0.8 opacity (instant)
Cards: Nothing (image opacity only)
```

---

## Typography Hierarchy Examples

**Homepage:**
```
SOCIALE           (96px, hero)
NEW               (12px, label)
Ma                (64px, product)
Handcrafted...    (16px, body)
$42               (24px, price)
```

**Product Page:**
```
Fire Island       (40px, name)
$32               (24px, price)
Only 4 left       (12px, stock)
OCEAN / CITRUS    (12px, scent notes)
```

---

## Breakpoints

```
Mobile:  < 768px  (single column, stack everything)
Desktop: ≥ 768px  (asymmetric layouts, generous spacing)
```

**Only two breakpoints. Mobile or desktop. That's it.**

---

## Content Rules

### Copy Style
- **Short.** One line > two lines.
- **Direct.** No fluff.
- **Confident.** No questions, no exclamation points.
- **Specific.** "Handcrafted in Connecticut" not "Made with love"

### Voice
- Not warm, not cold - **neutral/editorial**
- Not chatty - **editorial authority**
- Not sales-y - **informational**

Example GOOD:
> "Natural soy wax. Essential oils. Handcrafted in Connecticut."

Example BAD:
> "We lovingly handcraft each candle with the finest ingredients!"

---

## What NOT to Do

❌ Rounded corners  
❌ Drop shadows  
❌ Gradients  
❌ Multiple fonts  
❌ Accent colors (gray, beige, gold, etc.)  
❌ Animations/transitions  
❌ Decorative elements  
❌ Icons (except absolute minimum)  
❌ Texture overlays  
❌ Patterns  

---

## SEO & Performance

Same targets as V1:
- Lighthouse 90+
- Fast load times
- Accessible (WCAG AA)
- Mobile-first

---

## Implementation Notes

### Tailwind Config
```javascript
{
  colors: {
    black: '#000000',
    white: '#FFFFFF',
  },
  fontFamily: {
    sans: ['system-ui'],
    serif: ['Marcellus', 'Georgia', 'serif'],
  },
  fontSize: {
    'hero': '96px',
    'title': '64px',
    'large': '40px',
    'medium': '24px',
    'body': '16px',
    'small': '12px',
  },
  spacing: {
    '4xl': '240px',
    '3xl': '160px',
    '2xl': '120px',
    'xl': '80px',
    'lg': '40px',
    'md': '24px',
    'sm': '12px',
    'xs': '4px',
  },
  borderRadius: {
    DEFAULT: '0', // No rounded corners
  },
  transitionDuration: {
    DEFAULT: '0ms', // Instant
  }
}
```

---

## Inspiration References

**Design:**
- Byredo.com (black/white minimal)
- RalphLauren.com (sophisticated, not nautical)
- APC.fr (editorial simplicity)
- Lemaire.fr (asymmetric layouts)

**NOT:**
- Squarespace templates (too generic)
- Shopify themes (too busy)
- Traditional luxury (too ornate)

---

**Design System V2 - Approved for Opus Rebuild**

**Key Changes from V1:**
1. Removed ALL color (pure black/white only)
2. Removed animations (instant interactions)
3. Removed rounded corners (sharp edges)
4. Increased whitespace (240px sections)
5. Simplified nav (3 links max)
6. Asymmetric layouts (not rigid grid)
7. Massive typography (96px hero)
8. Minimal copy (one line better than two)

**Vibe: Byredo meets Ralph Lauren CT - Ultra-minimal, modern, edgy, sophisticated.**
