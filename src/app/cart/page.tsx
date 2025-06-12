'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCart, updateCartItemQuantity, removeCartItem, CartItem } from '../../../lib/cart';
import Image from 'next/image';

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

  const { subtotal, totalQuantity } = calculateCartTotals();

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

   return (
    <div className="container mx-auto my-12 p-8 border border-gray-700 rounded-lg shadow-2xl bg-gray-900 text-gray-200 max-w-4xl"> {/* Dark container */}
      <h1 className="text-3xl font-bold text-center text-teal-500 mb-8">Your Shopping Cart</h1> {/* Teal heading */}

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-400 mb-6">Your cart is empty.</p> {/* Lighter text */}
          <Link href="/" passHref>
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 text-lg rounded-md cursor-pointer transition duration-300 ease-in-out"> {/* Teal button */}
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.selectedVariantValue || ''}`}
                className="flex flex-col md:flex-row items-center bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700" 
              >
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    width={96}
                    height={96}
                    className="object-cover rounded-md mr-4 mb-4 md:mb-0 border border-gray-600" /* Subtle image border */
                  />
                )}
                <div className="flex-grow text-left mb-4 md:mb-0 md:mr-4">
                  <h3 className="text-lg font-semibold text-gray-50">{item.productName}</h3> {/* Light product name */}
                  {item.selectedVariantValue && (
                    <p className="text-sm text-gray-400">{item.selectedVariantName}: {item.selectedVariantValue}</p> 
                  )}
                  <p className="text-md font-bold text-teal-400">${item.productPrice.toFixed(2)}</p> {/* Teal price */}
                </div>
                <div className="flex items-center gap-4">
                  <label htmlFor={`quantity-${item.productId}-${item.selectedVariantValue || ''}`} className="sr-only">Quantity for {item.productName}</label>
                  <select
                    id={`quantity-${item.productId}-${item.selectedVariantValue || ''}`}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item, e)}
                    className="p-2 border border-gray-600 rounded-md text-gray-200 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500" /* Darker select, light text, teal focus */
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition duration-300 ease-in-out text-sm shadow-sm" /* Darker red remove button */
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg text-right mb-8 border border-gray-700"> {/* Darker summary, subtle border */}
            <p className="text-lg font-semibold text-gray-50 mb-2">Total Items: <span className="text-teal-400">{totalQuantity}</span></p> {/* Light text, teal quantity */}
            <p className="text-2xl font-bold text-gray-50">Cart Subtotal: <span className="text-teal-500">${subtotal.toFixed(2)}</span></p> {/* Light text, teal subtotal */}
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/" passHref>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 text-lg rounded-md cursor-pointer transition duration-300 ease-in-out shadow-md"> {/* Dark gray continue shopping */}
                Continue Shopping
              </button>
            </Link>
            <button
              onClick={handleProceedToCheckout}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 text-lg rounded-md cursor-pointer transition duration-300 ease-in-out shadow-md" /* Teal proceed to checkout */
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}