'use client'; 

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface OrderItemDetail { 
  productName: string;
  selectedVariantName?: string;
  selectedVariantValue?: string;
  quantity: number;
  productPrice: number;
}

interface OrderDetails {
  id: number;
  orderNumber: string;
  items?: OrderItemDetail[]; 
  subtotal: number;
  total: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumberMasked: string;
  transactionStatus: 'approved' | 'declined' | 'failed';
  transactionMessage: string;
  createdAt: string;
}


export default function ThankYouPageContent() { 
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');
  const orderNumberFromUrl = searchParams?.get('orderNumber');
  const errorMessageFromUrl = searchParams?.get('message');

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (orderNumberFromUrl) {
        try {
          setLoading(true);
          const response = await fetch(`https://ecommercebackend-production-7ae0.up.railway.app/orders/${orderNumberFromUrl}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch order details: ${response.statusText}`);
          }
          const rawData = await response.json();

       
          const data: OrderDetails = {
            ...rawData,
            subtotal: parseFloat(rawData.subtotal),
            total: parseFloat(rawData.total),
            
          };

          setOrderDetails(data);
        }catch (e: unknown) {
          const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
          setError(`Error loading order details: ${errorMessage}`);
          console.error('Error fetching order details:', e);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError(errorMessageFromUrl || 'Transaction could not be completed.');
      }
    }

    fetchOrderDetails();
  }, [orderNumberFromUrl, errorMessageFromUrl]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto my-12 p-8 border border-gray-300 rounded-lg shadow-md bg-white text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-red-600 mb-6">Transaction {status?.toUpperCase() || 'Failed'}!</h1>
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <p className="text-gray-700 mb-8">Please review your details or try again.</p>
        <button onClick={() => window.location.href = '/'} className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 text-lg rounded-md cursor-pointer transition duration-300 ease-in-out">
          Back to Shopping
        </button>
      </div>
    );
  }

  if (!orderDetails && status === 'approved' && orderNumberFromUrl) {
    return <div className="container mx-auto my-12 p-8 border border-gray-300 rounded-lg shadow-md bg-white text-center max-w-2xl text-gray-700">No order details found for the approved transaction.</div>;
  }

  const isApproved = orderDetails?.transactionStatus === 'approved' || status === 'approved';

  return (
    <div className="container mx-auto my-12 p-8 border border-gray-300 rounded-lg shadow-md bg-white text-center max-w-2xl">
      {isApproved ? (
        <h1 className="text-3xl font-bold text-green-600 mb-6">Thank You for Your Order!</h1>
      ) : (
        <h1 className="text-3xl font-bold text-red-600 mb-6">Transaction {orderDetails?.transactionStatus?.toUpperCase() || status?.toUpperCase()}!</h1>
      )}

      {orderDetails && (
        <>
          <p className="text-xl font-semibold text-gray-700 mb-6">
            Your Order Number: <strong className="text-blue-600">{orderDetails.orderNumber}</strong>
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200 text-left">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Order Summary</h2>
            {orderDetails.items?.map((item, index) => (
              <div key={index} className="mb-2"> 
                <p className="text-gray-700"><strong>Product:</strong> {item.productName}</p>
                {item.selectedVariantValue && (
                  <p className="text-gray-700 ml-4"><strong>Variant:</strong> {item.selectedVariantName}: {item.selectedVariantValue}</p>
                )}
                <p className="text-gray-700 ml-4"><strong>Quantity:</strong> {item.quantity}</p>
                <p className="text-gray-700 ml-4"><strong>Price per item:</strong> ${item.productPrice?.toFixed(2)}</p>
                {index < orderDetails.items.length - 1 && <hr className="my-2 border-gray-300 border-dashed" />} {/* Separator */}
              </div>
            ))}
            <p className="mb-2 text-gray-700 mt-4"><strong>Subtotal:</strong> ${orderDetails.subtotal.toFixed(2)}</p>
            <p className="text-xl font-bold text-blue-600 mt-4 pt-4 border-t border-dashed border-gray-300"><strong>Total:</strong> ${orderDetails.total.toFixed(2)}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200 text-left">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Customer Information</h2>
            <p className="mb-2 text-gray-700"><strong>Full Name:</strong> {orderDetails.fullName}</p>
            <p className="mb-2 text-gray-700"><strong>Email:</strong> {orderDetails.email}</p>
            <p className="mb-2 text-gray-700"><strong>Phone:</strong> {orderDetails.phoneNumber}</p>
            <p className="mb-2 text-gray-700"><strong>Address:</strong> {orderDetails.address}, {orderDetails.city}, {orderDetails.state}, {orderDetails.zipCode}</p>
            <p className="mb-2 text-gray-700"><strong>Card Used:</strong> XXXX XXXX XXXX {orderDetails.cardNumberMasked}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200 text-left">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Transaction Status</h2>
            <p className={`text-lg font-bold ${isApproved ? 'text-green-600' : 'text-red-600'}`}>
              {orderDetails.transactionMessage}
            </p>
          </div>
        </>
      )}

      {!orderDetails && status && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200 text-left">
          <p className="text-lg font-bold text-red-600 mb-4">
            {errorMessageFromUrl || 'An error occurred during your transaction. Please try again or contact support.'}
          </p>
          {status !== 'approved' && (
            <p className="text-gray-700">
              Please try again, ensuring all your details are correct. If the issue persists, contact our support team.
            </p>
          )}
        </div>
      )}

      <button onClick={() => window.location.href = '/'} className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 text-lg rounded-md cursor-pointer mt-8 transition duration-300 ease-in-out">
        Back to Shopping
      </button>
    </div>
  );
}