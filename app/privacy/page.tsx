import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | SOCIALE',
  description: 'SOCIALE privacy policy.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-white py-4xl">
      <div className="max-w-text mx-auto px-md">
        {/* Title */}
        <h1 className="text-title font-serif text-center mb-3xl">Privacy Policy</h1>

        {/* Content */}
        <div className="space-y-xl text-body">
          <p className="text-small uppercase-label">Last updated: February 2026</p>

          <section>
            <h2 className="text-medium font-serif mb-md">Information We Collect</h2>
            <p>
              When you make a purchase, we collect your name, email address, shipping
              address, and payment information. We use this information to fulfill your
              order and communicate with you about your purchase.
            </p>
          </section>

          <section>
            <h2 className="text-medium font-serif mb-md">How We Use Your Information</h2>
            <p>
              We use your information to process orders, send shipping updates, and
              respond to customer service requests. If you subscribe to our newsletter,
              we'll send occasional updates about new products and promotions.
            </p>
          </section>

          <section>
            <h2 className="text-medium font-serif mb-md">Data Protection</h2>
            <p>
              We use industry-standard encryption to protect your personal information.
              Payment processing is handled by secure third-party providers. We never
              store your full credit card number.
            </p>
          </section>

          <section>
            <h2 className="text-medium font-serif mb-md">Third Parties</h2>
            <p>
              We share your information only with service providers necessary to fulfill
              your order (shipping carriers, payment processors). We never sell your
              personal information.
            </p>
          </section>

          <section>
            <h2 className="text-medium font-serif mb-md">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal
              information at any time. Contact us at info@socialefragrances.com.
            </p>
          </section>

          <section>
            <h2 className="text-medium font-serif mb-md">Cookies</h2>
            <p>
              We use essential cookies to operate our website and analytics cookies to
              understand how visitors use our site. You can disable cookies in your
              browser settings.
            </p>
          </section>

          <section className="pt-xl border-t border-black">
            <p>
              Questions about this policy? Email{' '}
              <a
                href="mailto:info@socialefragrances.com"
                className="underline underline-offset-4 decoration-2 hover:no-underline"
              >
                info@socialefragrances.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
