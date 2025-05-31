import { Suspense } from 'react';
import ThankYouPageContent from './thank-you-content'; 

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">
        Loading order details...
      </div>
    }>
      <ThankYouPageContent />
    </Suspense>
  );
}