// ecommerce-frontend/app/checkout/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCart, clearCart, CartItem } from '../../../lib/cart'; // Adjust import path if needed
import OrderSummaryCard from '../../../components/checkout/OrderSummaryCard';
import PaymentDetailsForm from '../../../components/checkout/PaymentDetailsForm';
import CustomerInfoForm from '../../../components/checkout/CustomerInfoForm';

// Define the FormData interface
interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

// Define the TransactionResponse interface (adjusted for multiple items)
interface TransactionResponse {
  status: 'approved' | 'declined' | 'failed';
  orderNumber?: string;
  message?: string;
  customerData?: FormData;
  orderSummary?: {
    items: {
      productName: string;
      selectedVariantName?: string;
      selectedVariantValue?: string;
      quantity: number;
      price: number;
    }[];
    subtotal: number;
    total: number;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      alert('Your cart is empty. Redirecting to shopping.');
      router.push('/');
    } else {
      setCartItems(items);
    }
  }, [router]);

  const calculateTotals = () => {
    let subtotal = 0;
    cartItems.forEach(item => {
      subtotal += item.productPrice * item.quantity;
    });
    return { subtotal, total: subtotal };
  };

  const { subtotal, total } = calculateTotals();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number must be 10 digits';
    }
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'Zip Code is required';
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card Number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = 'Card Number must be 16 digits';
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry Date is required';
    } else {
      const [monthStr, yearStr] = formData.expiryDate.split('/');
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (
        !/^\d{2}\/\d{2}$/.test(formData.expiryDate) ||
        month < 1 ||
        month > 12 ||
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        newErrors.expiryDate = 'Expiry Date is invalid or in the past (MM/YY)';
      }
    }
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }
    if (cartItems.length === 0) {
      setApiError("Your cart is empty. Please add items before checking out.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://ecommercebackend-production-7ae0.up.railway.app/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: cartItems.map(item => ({
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            selectedVariantName: item.selectedVariantName,
            selectedVariantValue: item.selectedVariantValue,
            quantity: item.quantity,
          })),
          subtotal,
          total,
        }),
      });

      const result: TransactionResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Transaction failed due to an unknown error.');
      }

      clearCart();
      router.push(`/thank-you?status=${result.status}&orderNumber=${result.orderNumber || ''}`);

    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred during checkout.';

      if (error instanceof Error) {
        console.error('Checkout error:', error);
        errorMessage = error.message;
      }

      setApiError(errorMessage);
      router.push(`/thank-you?status=failed&message=${encodeURIComponent(errorMessage)}`);
    } finally {
      setLoading(false);
    }
  };

  // The main container itself has the dark background from `globals.css` or the parent layout.
  // The 'container mx-auto...' div below will be the themed card.
  if (cartItems.length === 0 && !loading && !apiError) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-300">Redirecting to shopping...</div>;
  }
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-300">Processing your order...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-black py-12 flex items-center justify-center"> {/* Set page background and center content */}
      <div className="container mx-auto p-8 border border-gray-700 rounded-lg shadow-2xl bg-white max-w-4xl"> {/* Themed card container */}
        <h1 className="text-3xl font-bold text-center text-teal-500 mb-8">Checkout</h1>

        {/* Order Summary Card - this component will also need its internal styling updated */}
        <OrderSummaryCard cartItems={cartItems} total={total} />

        <form onSubmit={handleSubmit} className="mt-8">
          {/* Customer Info Form - this component will also need its internal styling updated */}
          <CustomerInfoForm
            formData={{
              fullName: formData.fullName,
              email: formData.email,
              phoneNumber: formData.phoneNumber,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
            }}
            errors={errors}
            handleChange={handleChange}
          />

          {/* Payment Details Form - this component will also need its internal styling updated */}
          <PaymentDetailsForm
            formData={{
              cardNumber: formData.cardNumber,
              expiryDate: formData.expiryDate,
              cvv: formData.cvv,
            }}
            errors={errors}
            handleChange={handleChange}
          />

          {/* API Error Message */}
          {apiError && <p className="text-red-500 text-center mt-4 font-bold">{apiError}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 text-lg rounded-md cursor-pointer mt-5 w-full transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}