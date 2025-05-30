// app/thank-you/page.tsx
import { Suspense } from 'react';
import ThankYouPageContent from './thank-you-content'; // Import the client component

export default function ThankYouPage() {
  return (
    // Wrap the client component that uses useSearchParams with Suspense
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">
        Loading order details...
      </div>
    }>
      <ThankYouPageContent />
    </Suspense>
  );
}