import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wholesale | SOCIALE Fragrances',
  description: 'Partner with SOCIALE Fragrances for your boutique. Handmade candles from Litchfield County, Connecticut.',
};

export default function WholesalePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-cream py-24">
        <div className="max-w-content mx-auto px-6 text-center">
          <h1 className="text-display font-serif mb-6">Wholesale Partnership</h1>
          <p className="text-xl text-black/70 max-w-2xl mx-auto mb-8">
            Partner with SOCIALE Fragrances to bring artisanal, Connecticut-made candles 
            to your boutique, gift shop, or lifestyle store.
          </p>
          <a 
            href="#apply"
            className="inline-block bg-black text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Apply for Wholesale Account
          </a>
        </div>
      </div>

      {/* Why Partner With Us */}
      <div className="py-20 max-w-content mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-tiny uppercase-label block mb-4 tracking-[0.3em] text-black/50">
            The SOCIALE Difference
          </span>
          <h2 className="text-3xl md:text-4xl font-serif">Why Retailers Choose Us</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              🏠
            </div>
            <h3 className="font-serif text-xl mb-3">Locally Made</h3>
            <p className="text-black/60">
              Every candle is hand-poured in Litchfield County, Connecticut (06798). 
              Your customers support local artisans, not distant factories.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              💎
            </div>
            <h3 className="font-serif text-xl mb-3">Premium Quality</h3>
            <p className="text-black/60">
              Vegan soy wax blend, premium fragrance oils, 50-70 hour burn time. 
              Products your customers will reorder again and again.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              📈
            </div>
            <h3 className="font-serif text-xl mb-3">Strong Margins</h3>
            <p className="text-black/60">
              50% keystone wholesale pricing. Competitive retail pricing that moves inventory 
              while protecting your margin.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-cream">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Wholesale Pricing</h2>
            <p className="text-black/60">Keystone pricing: 50% of MSRP</p>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-sm max-w-3xl mx-auto">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-medium">Product</th>
                  <th className="py-4 px-6 text-center font-medium">Size</th>
                  <th className="py-4 px-6 text-right font-medium">Wholesale</th>
                  <th className="py-4 px-6 text-right font-medium">MSRP</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-4 px-6 font-medium">Millennial Ma</td>
                  <td className="py-4 px-6 text-center">12 oz</td>
                  <td className="py-4 px-6 text-right">$16.00</td>
                  <td className="py-4 px-6 text-right text-black/50">$32.00</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Millennial Ma</td>
                  <td className="py-4 px-6 text-center">20 oz</td>
                  <td className="py-4 px-6 text-right">$24.50</td>
                  <td className="py-4 px-6 text-right text-black/50">$49.00</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">All Pride Collection</td>
                  <td className="py-4 px-6 text-center">12 oz</td>
                  <td className="py-4 px-6 text-right">$16.00</td>
                  <td className="py-4 px-6 text-right text-black/50">$32.00</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">All Boyfriend Collection</td>
                  <td className="py-4 px-6 text-center">12 oz</td>
                  <td className="py-4 px-6 text-right">$16.00</td>
                  <td className="py-4 px-6 text-right text-black/50">$32.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-black/50 mt-6">
            Prices exclude shipping. Volume discounts available for orders over $500.
          </p>
        </div>
      </div>

      {/* Terms Section */}
      <div className="py-20 max-w-content mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif">Terms of Trade</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-cream rounded-lg p-8">
            <h3 className="font-serif text-xl mb-4">Opening Orders</h3>
            <ul className="space-y-3 text-black/70">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Minimum Order: $150</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Minimum 6 units per SKU</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Free display materials included</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Net 30 payment terms</span>
              </li>
            </ul>
          </div>

          <div className="bg-cream rounded-lg p-8">
            <h3 className="font-serif text-xl mb-4">Reorder Terms</h3>
            <ul className="space-y-3 text-black/70">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Minimum Reorder: $100</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>4 units per SKU minimum</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>5-7 business day fulfillment</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Free shipping over $250</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Apply Section */}
      <div id="apply" className="py-20 bg-black text-white">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Ready to Partner?</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Join our network of independent retailers across Connecticut and New York. 
            We're selective about our partnerships to ensure brand alignment and mutual success.
          </p>

          <div className="max-w-xl mx-auto bg-white/10 rounded-lg p-8 backdrop-blur">
            <form className="space-y-4 text-left">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Store Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                    placeholder="Your Boutique"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Contact Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                    placeholder="buyer@yourstore.com"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                    placeholder="(860) 555-0123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Store Location (City, State)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                  placeholder="Litchfield, CT"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Store Website / Instagram</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                  placeholder="www.yourstore.com or @yourstore"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Tell us about your store</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                  placeholder="What products do you carry? Who is your target customer?"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-white text-black font-medium uppercase tracking-wider hover:bg-gray-100 transition-colors"
              >
                Submit Application
              </button>
            </form>
          </div>

          <p className="text-white/50 text-sm mt-6">
            We review all applications within 48 hours. Approved retailers receive 
            wholesale catalog, terms sheet, and ordering instructions.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="py-8 bg-cream text-center">
        <p className="text-sm text-black/50">
          Questions about wholesale? Email me at{' '}
          <a href="mailto:alex@socialefragrances.com" className="underline">
            alex@socialefragrances.com
          </a>
        </p>
      </div>
    </div>
  );
}
