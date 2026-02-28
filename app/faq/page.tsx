import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | SOCIALE',
  description: 'Frequently asked questions about SOCIALE candles.',
};

const faqs = [
  {
    question: 'What are your candles made of?',
    answer:
      'Natural soy, palm, and coconut wax blend. Essential oil fragrances. Cotton wicks. No paraffin, no synthetic fragrances.',
  },
  {
    question: 'How long do they burn?',
    answer:
      'Our 10 oz candles burn for approximately 50 hours. The 12 oz Ma candle burns for 60 hours. Actual burn time depends on conditions.',
  },
  {
    question: 'Where do you ship?',
    answer:
      'Currently shipping within the United States only. International shipping coming soon.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Orders ship within 2-3 business days. Standard shipping takes 3-5 business days. Expedited options available at checkout.',
  },
  {
    question: 'Can I return or exchange?',
    answer:
      'We accept returns of unopened, unused products within 30 days. Contact us at info@socialefragrances.com to initiate a return.',
  },
  {
    question: 'Do you offer wholesale?',
    answer:
      'Yes. Email info@socialefragrances.com with your business name and location for wholesale inquiries.',
  },
  {
    question: 'Are your products vegan?',
    answer:
      'Yes. All SOCIALE products are 100% vegan and cruelty-free.',
  },
  {
    question: 'How should I care for my candle?',
    answer:
      'Trim the wick to 1/4 inch before each burn. Allow the wax to pool to the edges on the first burn. Never burn for more than 4 hours at a time.',
  },
];

export default function FAQPage() {
  return (
    <div className="bg-white py-4xl">
      <div className="max-w-text mx-auto px-md">
        {/* Title */}
        <h1 className="text-title font-serif text-center mb-3xl">FAQ</h1>

        {/* Questions */}
        <div className="space-y-xl">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-black pb-xl">
              <h2 className="text-medium font-serif mb-md">{faq.question}</h2>
              <p className="text-body">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-3xl text-center">
          <p className="text-body">
            Still have questions?{' '}
            <a
              href="mailto:info@socialefragrances.com"
              className="underline underline-offset-4 decoration-2 hover:no-underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
