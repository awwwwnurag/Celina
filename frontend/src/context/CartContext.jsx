import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [discountValue, setDiscountValue] = useState(0);

  // Load from LocalStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('evara_cart');
    const storedWishlist = localStorage.getItem('evara_wishlist');
    if (storedCart) setCartItems(JSON.parse(storedCart));
    if (storedWishlist) setWishlistItems(JSON.parse(storedWishlist));
  }, []);

  // Sync to LocalStorage
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('evara_cart', JSON.stringify(items));
  };

  const saveWishlist = (items) => {
    setWishlistItems(items);
    localStorage.setItem('evara_wishlist', JSON.stringify(items));
  };

  // Add item to Cart
  const addToCart = (product, size, color, qty = 1) => {
    const existing = cartItems.find(
      (item) => item.product === product._id && item.size === size && item.color === color
    );

    let newItems;
    if (existing) {
      newItems = cartItems.map((item) =>
        item.product === product._id && item.size === size && item.color === color
          ? { ...item, quantity: Math.min(product.stock, item.quantity + qty) }
          : item
      );
    } else {
      newItems = [
        ...cartItems,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          image: typeof product.images[0] === 'string' ? product.images[0] : (product.images[0]?.url || '/placeholder.jpg'),
          discount: product.discount || 0,
          size,
          color,
          quantity: qty,
          stock: product.stock
        }
      ];
    }
    saveCart(newItems);
  };

  // Remove item from Cart
  const removeFromCart = (productId, size, color) => {
    const newItems = cartItems.filter(
      (item) => !(item.product === productId && item.size === size && item.color === color)
    );
    saveCart(newItems);
  };

  // Update item quantity in Cart
  const updateQty = (productId, size, color, qty) => {
    const newItems = cartItems.map((item) =>
      item.product === productId && item.size === size && item.color === color
        ? { ...item, quantity: Math.max(1, Math.min(item.stock, qty)) }
        : item
    );
    saveCart(newItems);
  };

  // Clear Cart
  const clearCart = () => {
    saveCart([]);
    setCouponCode('');
    setDiscountType('');
    setDiscountValue(0);
  };

  // Add/Remove from Wishlist
  const toggleWishlist = (product) => {
    const exists = wishlistItems.some((item) => item._id === product._id);
    let newItems;
    if (exists) {
      newItems = wishlistItems.filter((item) => item._id !== product._id);
    } else {
      newItems = [...wishlistItems, product];
    }
    saveWishlist(newItems);
  };

  // Apply Coupon
  const applyCoupon = async (code) => {
    try {
      const normalizedCode = code.toUpperCase().trim();
      const res = await axios.post('/api/coupons/validate', {
        code: normalizedCode,
        purchaseAmount: itemsPrice
      });
      const coupon = res.data.coupon;
      setCouponCode(coupon.code);
      setDiscountType(coupon.discountType);
      setDiscountValue(coupon.discountValue);
      return { success: true, message: res.data.message || `Coupon ${coupon.code} applied successfully!` };
    } catch (err) {
      console.error('Failed to validate coupon:', err);
      const msg = err.response?.data?.message || 'Failed to validate coupon.';
      return { success: false, message: msg };
    }
  };

  // Price calculations
  const itemsPrice = cartItems.reduce((sum, item) => {
    // Price after product-specific discount
    const discountedPrice = item.price * (1 - (item.discount / 100));
    return sum + discountedPrice * item.quantity;
  }, 0);

  // Apply dynamic coupon discount
  let promoDiscount = 0;
  if (couponCode) {
    if (discountType === 'Percentage') {
      promoDiscount = itemsPrice * (discountValue / 100);
    } else if (discountType === 'Fixed') {
      promoDiscount = Math.min(discountValue, itemsPrice);
    }
  }
  const subtotal = itemsPrice - promoDiscount;

  // Shipping logic: Free shipping above 1299 or if coupon is FreeShipping
  const shippingPrice = subtotal > 1299 || (couponCode && discountType === 'FreeShipping') || cartItems.length === 0 ? 0 : 99;
  const taxPrice = subtotal * 0.12; // 12% GST
  const totalPrice = subtotal + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        couponCode,
        discountType,
        discountValue,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        toggleWishlist,
        applyCoupon,
        prices: {
          itemsPrice,
          promoDiscount,
          shippingPrice,
          taxPrice,
          totalPrice
        }
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartContext;
