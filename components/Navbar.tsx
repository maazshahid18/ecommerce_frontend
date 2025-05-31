'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToCartChanges, getCart } from '../lib/cart'; // Assuming these exist and work

export default function Navbar() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 text-white text-2xl font-extrabold tracking-wide hover:text-white/90 transition-colors duration-200">
              The Test Store
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
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

          {/* Mobile Hamburger Menu Icon */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleSidebar} className="text-white hover:text-blue-200 focus:outline-none focus:text-blue-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-blue-700 p-5 transform transition-transform duration-300 ease-in-out z-50 md:hidden
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end mb-4">
          <button onClick={toggleSidebar} className="text-white hover:text-blue-200 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link href="/" className="text-white text-xl font-medium hover:text-blue-200 transition-colors duration-200" onClick={toggleSidebar}>
            Products
          </Link>
          <Link href="/cart" className="relative bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 shadow-md flex items-center space-x-2 justify-center" onClick={toggleSidebar}>
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
        </nav>
      </div>
    </nav>
  );
}
