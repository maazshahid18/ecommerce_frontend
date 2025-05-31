"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  Product,
  ProductVariant,
  CartItem,
  addProductToCart,
} from "../../../../lib/cart";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [showViewCartButton, setShowViewCartButton] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `https://ecommercebackend-production-7ae0.up.railway.app/product/${id}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Product not found.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = (await response.json()) as Product;
        const fetchedProduct: Product = {
          ...rawData,
          price: parseFloat(String(rawData.price)),
        };
        setProduct(fetchedProduct);

        if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
          setSelectedVariant(fetchedProduct.variants[0]);
        }
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "An unexpected error occurred";
        setError(`Failed to fetch product: ${message}`);
        console.error("Failed to fetch product:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const variant = product?.variants.find((v) => v.value === selectedValue);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = () => {
    if (product && selectedVariant && quantity > 0) {
      const item: CartItem = {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        selectedVariantName: selectedVariant.name,
        selectedVariantValue: selectedVariant.value,
        quantity: quantity,
      };
      addProductToCart(item);
      alert(
        `${item.quantity} of ${item.productName} (${item.selectedVariantValue}) added to cart!`
      );
      setShowViewCartButton(true);
    } else {
      alert("Please select a product, variant, and quantity.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-xl text-slate-600 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Oops!</h1>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="text-slate-400 text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-slate-600 mb-2">
            Product Not Found
          </h1>
          <p className="text-slate-500">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-medium">Back to Products</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div className="mb-8 lg:mb-0">
            <div className="aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden relative group">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
                  <div className="text-slate-400 text-4xl">📷</div>
                </div>
              )}
              <Image
                src={
                  product.imageUrl ||
                  "https://via.placeholder.com/600x600?text=No+Image+Available"
                }
                alt={product.name}
                width={600}
                height={600}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          <div className="lg:max-w-lg">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline space-x-2 mb-6">
                <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-slate-500 text-lg">USD</span>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {product.variants && product.variants.length > 0 && (
                <div>
                  <label className="block text-slate-800 text-lg font-semibold mb-3">
                    Choose Variant
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-lg font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md"
                      value={selectedVariant?.value || ""}
                      onChange={handleVariantChange}
                    >
                      {product.variants.map((variant, index) => (
                        <option key={index} value={variant.value}>
                          {variant.name}: {variant.value}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-800 text-lg font-semibold mb-3">
                  Quantity
                </label>
                <div className="relative w-32">
                  <select
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-lg font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md"
                    value={quantity}
                    onChange={handleQuantityChange}
                  >
                    {[
                      ...Array(product.inventory > 10 ? 10 : product.inventory),
                    ].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.inventory > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    product.inventory > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.inventory > 0
                    ? `${product.inventory} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.inventory === 0}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-3 group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>
                {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
              </span>
            </button>

            {showViewCartButton && (
              <div className="mt-4">
                <Link href="/cart" passHref>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    View Cart
                  </button>
                </Link>
              </div>
            )}

            <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8-4v10m0 0v4"
                    />
                  </svg>
                  <span className="text-sm font-medium text-slate-600">
                    Free Shipping
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-slate-600">
                    Quality Guaranteed
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-slate-600">
                    30-Day Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}