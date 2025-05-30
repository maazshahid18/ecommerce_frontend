'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCart, updateCartItemQuantity, removeCartItem, CartItem } from '../../../lib/cart';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  const loadCart = () => {
    setCartItems(getCart());
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('storage', loadCart);
    return () => {
      window.removeEventListener('storage', loadCart);
    };
  }, []);

  const handleQuantityChange = (
    item: CartItem,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newQuantity = Number(e.target.value);
    updateCartItemQuantity(item.productId, item.selectedVariantValue, newQuantity);
    loadCart();
  };

  const handleRemoveItem = (item: CartItem) => {
    if (confirm(`Are you sure you want to remove ${item.productName} from your cart?`)) {
      removeCartItem(item.productId, item.selectedVariantValue);
      loadCart();
    }
  };

  const calculateCartTotals = () => {
    let subtotal = 0;
    let totalQuantity = 0;
    cartItems.forEach((item) => {
      subtotal += item.productPrice * item.quantity;
      totalQuantity += item.quantity;
    });
    return { subtotal, totalQuantity, total: subtotal };
  };

  const { subtotal, totalQuantity, total } = calculateCartTotals();

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto my-12 p-8 border border-gray-300 rounded-lg shadow-md bg-white max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
          <Link href="/" passHref>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 text-lg rounded-md cursor-pointer transition duration-300 ease-in-out">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {cartItems.map((item, index) => (
              <div key={`<span class="math-inline">\{item\.productId\}\-</span>{item.selectedVariantValue || index}`} className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                {item.imageUrl && ( 
                  <img src={item.imageUrl} alt={item.productName} className="w-24 h-24 object-cover rounded-md mr-4 mb-4 md:mb-0" />
                )}
                <div className="flex-grow text-left mb-4 md:mb-0 md:mr-4">
                  <h3 className="text-lg font-semibold text-gray-800">{item.productName}</h3>
                  {item.selectedVariantValue && (
                    <p className="text-sm text-gray-600">{item.selectedVariantName}: {item.selectedVariantValue}</p>
                  )}
                  <p className="text-md font-bold text-blue-600">${item.productPrice.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <label htmlFor={`quantity-${index}`} className="sr-only">Quantity for {item.productName}</label>
                  <select
                    id={`quantity-${index}`}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item, e)}
                    className="p-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition duration-300 ease-in-out text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 p-6 rounded-lg text-right mb-8">
            <p className="text-lg font-semibold text-gray-700 mb-2">Total Items: {totalQuantity}</p>
            <p className="text-2xl font-bold text-gray-800">Cart Subtotal: <span className="text-blue-600">${subtotal.toFixed(2)}</span></p>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/" passHref>
              <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 text-lg rounded-md cursor-pointer transition duration-300 ease-in-out">
                Continue Shopping
              </button>
            </Link>
            <button
              onClick={handleProceedToCheckout}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 text-lg rounded-md cursor-pointer transition duration-300 ease-in-out"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}