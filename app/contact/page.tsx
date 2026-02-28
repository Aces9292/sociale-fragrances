import { Metadata } from 'next';
import Button from '@/components/Button';

export const metadata: Metadata = {
  title: 'Contact | SOCIALE',
  description: 'Get in touch with SOCIALE.',
};

export default function ContactPage() {
  return (
    <div className="bg-white py-4xl">
      <div className="max-w-text mx-auto px-md">
        {/* Title */}
        <h1 className="text-title font-serif text-center mb-3xl">Contact</h1>

        {/* Content */}
        <div className="space-y-xl text-body text-center">
          <p>
            Questions about an order? Want to stock SOCIALE in your store?
            Just want to say hello?
          </p>

          <div className="py-xl border-t border-b border-black">
            <p className="text-small uppercase-label mb-sm">Email</p>
            <a
              href="mailto:hello@socialefragrances.com"
              className="text-medium hover:underline underline-offset-4 decoration-2"
            >
              hello@socialefragrances.com
            </a>
          </div>

          <div className="py-xl">
            <p className="text-small uppercase-label mb-sm">Instagram</p>
            <a
              href="https://instagram.com/socialefragrances"
              target="_blank"
              rel="noopener noreferrer"
              className="text-medium hover:underline underline-offset-4 decoration-2"
            >
              @socialefragrances
            </a>
          </div>

          <div className="pt-xl">
            <p className="text-body mb-lg">
              We respond to all inquiries within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
