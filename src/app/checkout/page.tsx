'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCart, clearCart, CartItem } from '../../../lib/cart';
import OrderSummaryCard from '../../../components/checkout/OrderSummaryCard';
import PaymentDetailsForm from '../../../components/checkout/PaymentDetailsForm';
import CustomerInfoForm from '../../../components/checkout/CustomerInfoForm';

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
      const response = await fetch('http://localhost:3000/orders', {
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

    } catch (error: any) {
      console.error('Checkout error:', error);
      setApiError(error.message || 'An unexpected error occurred during checkout.');
      router.push(`/thank-you?status=failed&message=${encodeURIComponent(error.message || 'Transaction could not be completed.')}`);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !loading && !apiError) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">Redirecting to shopping...</div>;
  }
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">Processing your order...</div>;
  }

  return (
    <div className="container mx-auto my-12 p-8 border border-gray-300 rounded-lg shadow-md bg-white max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Checkout</h1>

      <OrderSummaryCard cartItems={cartItems} total={total} />

      <form onSubmit={handleSubmit} className="mt-8">
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

        <PaymentDetailsForm
          formData={{
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
          }}
          errors={errors}
          handleChange={handleChange}
        />

        {apiError && <p className="text-red-600 text-center mt-4 font-bold">{apiError}</p>}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 text-lg rounded-md cursor-pointer mt-5 w-full transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}