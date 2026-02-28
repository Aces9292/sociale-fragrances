import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | SOCIALE',
  description: 'SOCIALE terms of service.',
};

export default function TermsPage() {
  return (
    <div className="bg-white py-4xl">
      <div className="max-w-text mx-auto px-md">
        {/* Title */}
        <h1 className="text-title font-serif text-center mb-3xl">Terms of Service</h1>

        {/* Content */}
        <div className="space-y-xl text-body">
          <p className="text-small uppercase-label">Last updated: February 2026</p>

          <section>
            <h2 className="text-medium font-serif mb-md">Agreement to Terms</h2>
            <p>
              By accessing or using socialefragrances.com, you agree to be bound by
              these terms. If you do not agree, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-medium font-serif mb-md">Products and Pricing</h2>
            <p>
              All product descriptions and prices are subject to change without notice.
              We reserve the right to limit quantities and refuse orders at our discretion.
              Colors may appear differently on screen than in person.
            </p>
          </section>

          <section>
            <h2 className="text-medium font-serif mb-md">Orders and Payment</h2>
            <p>
              Payment is required at time of purchase. We accept major credit cards and
              other payment methods shown at checkout. All prices are in USD.
            </p>
          </section>

          <section>
            <h2 className="text-medium font-serif mb-md">Shipping</h2>
            <p>
              We ship within the United States. Risk of loss passes to you upon delivery
              to the carrier. Shipping times are estimates and not guaranteed.
            </p>
          </section>

          <section>
            <h2 className="text-medium font-serif mb-md">Returns</h2>
            <p>
              Unopened products may be returned within 30 days for a full refund.
              Customer is responsible for return shipping costs. Opened or used products
              cannot be returned for hygiene reasons.
            </p>
          </section>

          <section>
            <h2 className="text-medium font-serif mb-md">Intellectual Property</h2>
            <p>
              All content on this website—including text, images, logos, and designs—is
              owned by SOCIALE and protected by copyright law. You may not reproduce or
              distribute any content without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-medium font-serif mb-md">Limitation of Liability</h2>
            <p>
              SOCIALE is not liable for any indirect, incidental, or consequential damages
              arising from your use of our products or website. Our liability is limited
              to the purchase price of the product in question.
            </p>
          </section>

          <section className="pt-xl border-t border-black">
            <p>
              Questions about these terms? Email{' '}
              <a
                href="mailto:hello@socialefragrances.com"
                className="underline underline-offset-4 decoration-2 hover:no-underline"
              >
                hello@socialefragrances.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
