import Button from '@/components/Button';

export default function NotFound() {
  return (
    <div className="bg-white py-4xl">
      <div className="max-w-text mx-auto px-md text-center">
        <h1 className="text-hero font-serif mb-xl">404</h1>
        <p className="text-medium mb-3xl">Page not found.</p>
        <Button href="/">Return Home</Button>
      </div>
    </div>
  );
}
