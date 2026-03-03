import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductBySlug, products } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found | SOCIALE' };
  }

  // Special SEO for Millennial Ma product
  if (slug === 'ma') {
    return {
      title: 'Millennial Ma Candle | Y2K Nostalgia Collection | SOCIALE',
      description: 'The candle that smells like your 2003 bedroom. Two sizes, hand-poured, made for millennial moms who remember. The perfect Mother\'s Day gift.',
      keywords: ['millennial mom gifts', 'Y2K nostalgia candle', 'mother\'s day candle', 'nostalgia gifts', '2000s gifts'],
      openGraph: {
        title: 'Millennial Ma Candle | Y2K Nostalgia Collection | SOCIALE',
        description: 'For the teens we were. And the moms we are. The candle that smells like your 2003 bedroom.',
        images: ['/images/campaign/ma-pink-car.jpg'],
      },
    };
  }

  return {
    title: `${product.name} | SOCIALE`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
