// ecommerce-frontend/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { subscribeToCartChanges, getCart } from '../lib/cart'; // Adjust import path if Navbar moves

export default function Navbar() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl sticky top-0 z-50"> {/* Dark gray/black gradient */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center space-x-4 md:hidden">
            <button onClick={toggleSidebar} className="text-gray-100 hover:text-teal-400 focus:outline-none focus:text-teal-400 transition-colors duration-200"> {/* Light text, teal hover */}
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
            <Link href="/" className="flex-shrink-0 text-gray-50 text-2xl font-extrabold tracking-wide hover:text-teal-200 transition-colors duration-200"> {/* Light gray logo, teal hover */}
              The Test Store
            </Link>
          </div>

          {/* Desktop Logo */}
          <div className="hidden md:flex items-center">
            <Link href="/" className="flex-shrink-0 text-gray-50 text-2xl font-extrabold tracking-wide hover:text-teal-200 transition-colors duration-200">
              The Test Store
            </Link>
          </div>

          {/* Desktop Nav Links & Cart Icon */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-100 text-lg font-medium hover:text-teal-400 transition-colors duration-200"> {/* Light text, teal hover */}
              Products
            </Link>
            <Link href="/cart" className="relative bg-gray-700/50 hover:bg-gray-600/50 text-gray-100 font-semibold py-2 px-5 rounded-full transition-all duration-200 shadow-md flex items-center space-x-2 border border-gray-600"> {/* Darker semi-transparent background, subtle border */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform scale-90 origin-center transition-transform duration-200 ease-out border-2 border-red-800">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Cart Icon */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="relative bg-gray-700/50 hover:bg-gray-600/50 text-gray-100 font-semibold py-2 px-4 rounded-full transition-all duration-200 shadow-md flex items-center space-x-2 border border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform scale-90 origin-center transition-transform duration-200 ease-out border-2 border-red-800">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden" onClick={toggleSidebar}></div> 
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 p-6 transform transition-transform duration-300 ease-in-out z-50 md:hidden shadow-lg border-r border-gray-700
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      > {/* Dark sidebar, subtle border */}
        <div className="flex justify-end mb-6">
          <button onClick={toggleSidebar} className="text-gray-100 hover:text-teal-400 focus:outline-none transition-colors duration-200">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-6">
          <Link href="/" className="text-gray-100 text-xl font-medium hover:text-teal-400 transition-colors duration-200" onClick={toggleSidebar}>
            Products
          </Link>
          <Link href="/cart" className="relative bg-gray-700/50 hover:bg-gray-600/50 text-gray-100 font-semibold py-2 px-4 rounded-full transition-all duration-200 shadow-md flex items-center space-x-2 justify-center border border-gray-600" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform scale-90 origin-center transition-transform duration-200 ease-out border-2 border-red-800">
                {cartItemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </nav>
  );
}