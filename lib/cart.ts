export interface ProductVariant {
  name: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  variants: ProductVariant[];
  inventory: number;
  imageUrl?: string; 
}

export interface CartItem {
  productId: number;
  productName: string;
  productPrice: number;
  selectedVariantName?: string;
  selectedVariantValue?: string;
  quantity: number;
  imageUrl?: string;
}

type CartChangeListener = (cart: CartItem[]) => void;
const listeners: CartChangeListener[] = [];

const emitCartChange = () => {
  const currentCart = getCart(); 
  listeners.forEach(listener => listener(currentCart));
};

export const subscribeToCartChanges = (listener: CartChangeListener) => {
  listeners.push(listener);
  listener(getCart());
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};


export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cartJson = localStorage.getItem('cart');
  try {
    return cartJson ? JSON.parse(cartJson) : [];
  } catch (e) {
    console.error("Failed to parse cart from localStorage:", e);
    return []; 
  }
};

export const saveCart = (cart: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
    emitCartChange(); 
  }
};

export const addProductToCart = (item: CartItem) => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(
    (cartItem) =>
      cartItem.productId === item.productId &&
      cartItem.selectedVariantValue === item.selectedVariantValue
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    cart.push({ ...item, imageUrl: item.imageUrl });
  }
  saveCart(cart); 
};

export const updateCartItemQuantity = (
  productId: number,
  selectedVariantValue: string | undefined,
  newQuantity: number
) => {
  const cart = getCart();
  const itemIndex = cart.findIndex(
    (cartItem) =>
      cartItem.productId === productId &&
      cartItem.selectedVariantValue === selectedVariantValue
  );

  if (itemIndex > -1) {
    if (newQuantity <= 0) {
      cart.splice(itemIndex, 1); 
    } else {
      cart[itemIndex].quantity = newQuantity;
    }
    saveCart(cart); 
  }
};

export const removeCartItem = (
  productId: number,
  selectedVariantValue: string | undefined
) => {
  const cart = getCart();
  const updatedCart = cart.filter(
    (cartItem) =>
      !(cartItem.productId === productId && cartItem.selectedVariantValue === selectedVariantValue)
  );
  saveCart(updatedCart); 
};

export const clearCart = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        emitCartChange();
    }
};