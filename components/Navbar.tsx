'use client'; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToCartChanges, getCart } from '../lib/cart';
export default function Navbar() {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const initialCart = getCart();
    const initialCount = initialCart.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(initialCount);

    const unsubscribe = subscribeToCartChanges((updatedCart) => {
      const newCount = updatedCart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(newCount);
    });

    return () => {
      unsubscribe();
    };
  }, []); 

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 text-white text-2xl font-extrabold tracking-wide hover:text-white/90 transition-colors duration-200">
              The Test Store
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/" className="text-white text-lg font-medium hover:text-blue-200 transition-colors duration-200">
              Products
            </Link>
            <Link href="/cart" className="relative bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 shadow-md flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform scale-90 origin-center transition-transform duration-200 ease-out">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}