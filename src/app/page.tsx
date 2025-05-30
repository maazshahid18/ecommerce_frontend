'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Ensure Product and ProductVariant are imported from the correct path
import { Product } from '../../lib/cart'; // <--- UPDATED IMPORT

// Define the structure of the raw data received from the API
interface RawProductData {
  // Assuming the raw data from /product doesn't have variants or inventory directly
  id: number; // Corrected based on your Product interface
  name: string;
  description: string;
  price: string | number; // Price might come as a string, e.g., "19.99"
  imageUrl?: string; // Optional if not all products have an image
  // If your backend *does* return variants/inventory here, add them to this interface:
  // variants?: any[]; // Or ProductVariant[] if the backend provides them in this format
  // inventory?: number;
}

type SortOption = 'none' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('none');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/product');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData: RawProductData[] = await response.json();

        const fetchedProducts: Product[] = rawData.map(item => ({
          // Spread existing properties from rawData
          ...item,
          // Ensure price is parsed as a number.
          price: parseFloat(item.price as string),
          // FIX: Add missing variants and inventory with default values
          // If your backend *does* provide these in the /product endpoint,
          // adjust RawProductData and map them directly instead of default values.
          variants: [], // Default to an empty array of variants
          inventory: 0, // Default to 0, or a more appropriate initial value
          // Also, ensure 'id' is a number based on your Product interface:
          id: typeof item.id === 'string' ? parseInt(item.id, 10) : item.id, // Parse if string, otherwise use as is
        }));
        setProducts(fetchedProducts);
      }  catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unexpected error occurred';
        setError(`Failed to fetch products: ${message}`);
        console.error("Failed to fetch products:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const sortedProducts = useMemo(() => {
    const sortableProducts = [...products];

    switch (sortOption) {
      case 'price-asc':
        sortableProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortableProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sortableProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortableProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'none':
      default:
        break;
    }
    return sortableProducts;
  }, [products, sortOption]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">Loading products...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-red-600">Error: {error}</div>;
  }

  if (products.length === 0) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">No products available.</div>;
  }

  return (
    <div className="container mx-auto my-12 p-8 border border-gray-300 rounded-lg shadow-md bg-white max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 md:mb-0">Our Products</h1>
        <div className="flex items-center space-x-4">
          <label htmlFor="sort-by" className="text-gray-700 font-medium">Sort by:</label>
          <select
            id="sort-by"
            value={sortOption}
            onChange={handleSortChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
          <Link href="/cart" passHref>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 text-lg rounded-md cursor-pointer transition duration-300 ease-in-out">
              View Cart
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {sortedProducts.map((productItem) => (
          <Link key={productItem.id} href={`/products/${productItem.id}`} passHref>
            <div
              className="border rounded-lg p-4 shadow-md cursor-pointer transition duration-300 ease-in-out border-gray-200 hover:shadow-lg hover:border-blue-500 hover:ring-2 hover:ring-blue-500"
            >
              <Image
                src={productItem.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={productItem.name}
                width={300} // Provide appropriate width
                height={200} // Provide appropriate height
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{productItem.name}</h2>
              <p className="text-lg font-bold text-blue-600 mb-2">${productItem.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600">{productItem.description.substring(0, 100)}...</p>
              <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                View Details
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}