import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

export const StickyAddToCart = ({ product, selectedSize, selectedColor, qty, onAddToCart, onBuyNow }) => {
  const { wishlistItems, toggleWishlist } = React.useContext(CartContext);
  const { user } = React.useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(wishlistItems.some((item) => item._id === product?._id));
  }, [wishlistItems, product]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 400;
      setIsVisible(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible || !product) return null;

  const discountedPrice = product.discount > 0 ? product.price * (1 - (product.discount / 100)) : product.price;

  const handleWishlist = () => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }
    toggleWishlist(product);
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-40 lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
            ₹{product.price.toLocaleString()}
          </p>
          <p className="text-lg font-bold text-brand-burgundy dark:text-white">
            ₹{discountedPrice.toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleWishlist}
            className={`p-3 rounded-full border transition ${
              isWishlisted 
                ? 'bg-red-50 border-red-200 text-red-500' 
                : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={onAddToCart}
            className="flex items-center gap-2 bg-brand-burgundy text-white px-5 py-3 rounded-full font-semibold text-sm hover:bg-opacity-90 transition"
          >
            <ShoppingCart size={18} />
            <span>Add</span>
          </button>
          
          <button
            onClick={onBuyNow}
            className="bg-black text-white px-5 py-3 rounded-full font-semibold text-sm hover:bg-opacity-90 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
