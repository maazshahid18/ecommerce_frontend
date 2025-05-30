import React from 'react';
import { CartItem } from '../../lib/cart';
interface OrderSummaryCardProps {
  cartItems: CartItem[];
  total: number;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ cartItems, total }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Order Summary</h2>
      <div className="space-y-2 mb-4">
        {cartItems.map((item, index) => (
          <div key={`${item.productId}-${item.selectedVariantValue || index}`} className="flex justify-between items-center text-gray-700">
            <span className="font-medium">
              {item.productName} {item.selectedVariantValue ? `(${item.selectedVariantName}: ${item.selectedVariantValue})` : ''} x {item.quantity}
            </span>
            <span className="font-semibold">${(item.productPrice * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <p className="text-xl font-bold text-blue-600 mt-4 pt-4 border-t border-dashed border-gray-300">
        <strong>Total:</strong> ${total.toFixed(2)}
      </p>
    </div>
  );
};

export default OrderSummaryCard;