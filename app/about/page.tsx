import Image from 'next/image';
import { Metadata } from 'next';
import { getBrandImage } from '@/lib/images';

export const metadata: Metadata = {
  title: 'About | SOCIALE',
  description: 'Natural soy wax candles handcrafted in Connecticut. Est. when millennials grew up.',
};

export default function AboutPage() {
  return (
    <div className="bg-white py-4xl">
      <div className="max-w-text mx-auto px-md">
        {/* Title */}
        <h1 className="text-title font-serif text-center mb-3xl">About</h1>

        {/* Content */}
        <div className="space-y-xl text-body">
          <p>
            SOCIALE makes candles that tell stories. Not boring stories. 
            The kind you tell at 2am with your best friends, laughing so hard you cry.
          </p>

          <p>
            We start with natural soy wax and essential oil blends. No synthetic 
            garbage. No paraffin. Just clean, honest ingredients that burn slow 
            and make your space smell incredible without giving you a headache.
          </p>

          <p>
            Every candle is hand-poured in small batches in Connecticut. 
            We care about the details—the way the wax pools, the throw of 
            the scent, whether it actually looks cute on your shelf. (It does.)
          </p>

          <p>
            The <strong>Pride Collection</strong> celebrates the places that shaped LGBTQ+ 
            history. Fire Island. Palm Springs. Provincetown. Asbury Park. 
            These aren't just destinations—they're where our community found home.
          </p>

          <p>
            The <strong>Boyfriend Collection</strong> is... exactly what it sounds like. 
            The Hipster. The Bro. The Ivy Leaguer. Three archetypes, three 
            scent profiles. Because sometimes you just need a candle that gets the joke.
          </p>

          <p>
            And <strong>Ma</strong>? That's for all the millennial moms who wore Love Spell 
            in 2004 and became their mothers. (It's a compliment. Trust us.)
          </p>

          <p className="pt-xl border-t border-black">
            Questions? Wanna collab? Just want to say hi? 👋<br />
            <a
              href="mailto:hello@socialefragrances.com"
              className="underline underline-offset-4 decoration-2 hover:no-underline"
            >
              hello@socialefragrances.com
            </a>
          </p>

          <p className="text-small text-black/60">
            Based in Connecticut. Vibing since 2021.
          </p>
        </div>
      </div>
    </div>
  );
}
