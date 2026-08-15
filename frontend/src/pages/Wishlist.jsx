import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import CartContext from '../context/CartContext';

export const Wishlist = () => {
  const { wishlistItems, toggleWishlist } = useContext(CartContext);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8 border-b border-brand-border dark:border-zinc-800 pb-4">
        <h2 className="font-display font-semibold text-2xl uppercase tracking-wider text-brand-burgundy dark:text-white flex items-center justify-center gap-2">
          <Heart size={24} fill="currentColor" className="text-brand-burgundy dark:text-red-400" /> My Wishlist
        </h2>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-brand-light dark:bg-zinc-850 rounded-md border border-brand-border border-dashed text-gray-500">
          <p className="font-medium text-sm">Your wishlist is currently empty.</p>
          <Link to="/shop" className="inline-block mt-4 bg-brand-burgundy text-white px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div key={product._id} className="border border-brand-border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md overflow-hidden p-3 flex flex-col justify-between">
              
              <div className="relative aspect-[3/4] rounded bg-gray-100 overflow-hidden">
                <img src={typeof product.images[0] === 'string' ? product.images[0] : (product.images[0]?.url || '/placeholder.jpg')} alt={product.name} className="w-full h-full object-cover" />
              </div>

              <div className="mt-3 text-center space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-medium text-sm text-brand-burgundy dark:text-white line-clamp-1 uppercase">
                    {product.name}
                  </h4>
                  <div className="price font-bold text-brand-burgundy dark:text-red-400 text-sm mt-1">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link to={`/product/${product._id}`} className="flex-grow">
                    <button className="w-full bg-brand-burgundy text-white hover:opacity-90 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider flex justify-center items-center gap-1.5 transition">
                      <ShoppingCart size={12} /> Options
                    </button>
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-950 transition"
                    aria-label="Remove item"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Wishlist;
