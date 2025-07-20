// ecommerce-frontend/app/page.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react'; // Added useCallback
import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductVariant } from '../../lib/cart';

interface RawProductData {
  id: number;
  name: string;
  description: string;
  price: string | number;
  imageUrl?: string;
  variants?: ProductVariant[];
  inventory?: number;
}

type SortOption = 'none' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const banners = [
  {
    src: '/clothes.jpg',
    alt: 'Summer Collection Sale',
    link: '#featured-products', // Link to featured products or a specific category
    heading: 'Summer Sale: Up to 50% Off!',
    description: 'Discover the hottest trends this season.',
  },
  {
    src: '/gadgets.jpg',
    alt: 'New Arrivals Electronics',
    link: '/', // Link to home or new arrivals page
    heading: 'Brand New Electronics',
    description: 'Explore the latest gadgets and gear.',
  },
  {
    src: '/fashion.jpg',
    alt: 'Footwear Collection',
    link: '/', // Link to a footwear category
    heading: 'Step Up Your Style',
    description: 'Comfort and fashion in every pair.',
  },
];

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('none');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Function to go to the next slide
  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
  }, []);

  // Set up automatic slide scrolling
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(slideInterval); // Clean up interval on component unmount
  }, [nextSlide]); // Re-run effect if nextSlide changes (due to useCallback, it won't)


  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('https://ecommercebackend-production-7ae0.up.railway.app/product');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData: RawProductData[] = await response.json();

        const fetchedProducts: Product[] = rawData.map(item => ({
          ...item,
          price: parseFloat(item.price as string),
          variants: item.variants || [],
          inventory: item.inventory || 0,
          id: typeof item.id === 'string' ? parseInt(item.id, 10) : item.id,
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

  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);


  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-300 bg-gray-950">Loading products...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-red-500 bg-gray-950">Error: {error}</div>;
  }

  if (products.length === 0) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-300 bg-gray-950">No products available.</div>;
  }

  return (
    <div className="container mx-auto my-12 p-8 border border-gray-700 rounded-lg shadow-2xl bg-gray-900 text-gray-200">
      
      {/* Top right View Cart button (remains as is from previous version, as it is outside Navbar scope for this page) */}
      

      {/* NEW: Image Slider (replaces Hero Section) */}
      <section className="relative w-full h-80 md:h-96 lg:h-[450px] overflow-hidden rounded-lg shadow-xl mb-12 border border-gray-700">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0} // Prioritize loading the first image
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0  flex flex-col items-center justify-center text-center p-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg leading-tight">
                {banner.heading}
              </h2>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow-md">
                {banner.description}
              </p>
              <Link href={banner.link} passHref>
                <button className="mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 text-lg md:text-xl rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        ))}

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-teal-500 w-8' : 'bg-gray-400 hover:bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section id="featured-products" className="mb-12">
          <h2 className="text-4xl font-extrabold text-teal-500 mb-8 text-center">Featured Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((productItem) => (
              <Link key={productItem.id} href={`/products/${productItem.id}`} passHref>
                <div className="group flex flex-col items-center border rounded-lg p-6 shadow-md cursor-pointer transition duration-300 ease-in-out bg-gray-800 border-gray-700 hover:shadow-xl hover:border-teal-500 hover:ring-2 hover:ring-teal-500 transform hover:-translate-y-1">
                  <Image
                    src={productItem.imageUrl || 'https://via.placeholder.com/300x200/663399/FFFFFF?text=Featured+Image'}
                    alt={productItem.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-md mb-4 group-hover:scale-105 transform transition duration-300 ease-in-out"
                  />
                  <h3 className="text-2xl font-bold text-gray-50 mb-2 text-center">{productItem.name}</h3>
                  <p className="text-xl font-bold text-teal-400 mb-3">${productItem.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-300 mb-4 text-center">{productItem.description.substring(0, 90)}...</p>
                  <button className="mt-auto w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-md transition duration-300 ease-in-out">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Products section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 pt-4 border-t border-gray-700">
        <h2 className="text-3xl font-bold text-gray-50 mb-4 md:mb-0">All Products</h2>
        <div className="flex items-center space-x-4">
          <label htmlFor="sort-by" className="text-gray-300 font-medium">Sort by:</label>
          <select
            id="sort-by"
            value={sortOption}
            onChange={handleSortChange}
            className="p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-800 text-gray-200"
          >
            <option value="none">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedProducts.map((productItem) => (
          <Link key={productItem.id} href={`/products/${productItem.id}`} passHref>
            <div
              className="border rounded-lg p-4 shadow-md cursor-pointer transition duration-300 ease-in-out bg-gray-800 border-gray-700 hover:shadow-lg hover:border-teal-500 hover:ring-2 hover:ring-teal-500"
            >
              <Image
                src={productItem.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={productItem.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-50 mb-2">{productItem.name}</h3>
              <p className="text-lg font-bold text-teal-400 mb-2">${productItem.price.toFixed(2)}</p>
              <p className="text-sm text-gray-300">{productItem.description.substring(0, 100)}...</p>
              <button className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                View Details
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}