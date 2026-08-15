import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { _id, name, price, discount, images, stock, rating, collectionName } = product;

  // Calculate discounted price
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price * (1 - (discount / 100)) : price;

  return (
    <div className="genz-card group p-4 flex flex-col justify-between">
      
      {/* Product Image and Badges */}
      <div className="relative overflow-hidden aspect-[3/4] w-full rounded-xl bg-neutral-50 border border-black/10">
        
        {/* Badges list */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-2 items-start">
          {hasDiscount && (
            <span className="text-[10px] uppercase font-black tracking-wider bg-[#ff007f] text-white px-2.5 py-1 rounded border-2 border-black rotate-[-3deg] shadow-[2px_2px_0px_rgba(0,0,0,1)] inline-block">
              -{discount}% OFF
            </span>
          )}
          {stock === 0 && (
            <span className="text-[10px] uppercase font-black tracking-wider bg-neutral-200 text-neutral-500 px-2.5 py-1 rounded border-2 border-black rotate-[2deg] shadow-[2px_2px_0px_rgba(0,0,0,1)] inline-block">
              SOLD OUT
            </span>
          )}
          {product.featured && (
            <span className="text-[10px] uppercase font-black tracking-wider bg-[#dffe00] text-black px-2.5 py-1 rounded border-2 border-black rotate-[3deg] shadow-[2px_2px_0px_rgba(0,0,0,1)] inline-block">
              HOT 🔥
            </span>
          )}
        </div>

        {/* Dynamic Double Hover Image Zoom */}
        <Link to={`/product/${_id}`} className="block w-full h-full">
          <img
            src={typeof images[0] === 'string' ? images[0] : (images[0]?.url || '/placeholder.jpg')}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {images[1] && (
            <img
              src={typeof images[1] === 'string' ? images[1] : (images[1]?.url || '')}
              alt={`${name} alternative`}
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-110"
            />
          )}
        </Link>

        {/* Floating Quick Action Overlay */}
        {stock > 0 && (
          <div className="absolute bottom-3 right-3 z-10 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <Link to={`/product/${_id}`} className="flex items-center justify-center bg-[#dffe00] text-black border-2 border-black p-2.5 rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:scale-110 hover:bg-yellow-400 transition duration-200">
              <ShoppingBag size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* Info details */}
      <div className="mt-4 text-center space-y-2 flex flex-col justify-between flex-grow">
        <div>
          <span className="text-[9px] uppercase font-extrabold tracking-widest text-neutral-400">
            {collectionName || "Collection"}
          </span>
          <h4 className="font-display font-black text-xs uppercase text-neutral-900 mt-1 line-clamp-1 tracking-tight">
            <Link to={`/product/${_id}`} className="hover:text-[#ff007f] transition-colors">{name}</Link>
          </h4>

          {/* Rating */}
          <div className="flex justify-center items-center gap-1 text-xs text-amber-500 mt-1">
            <Star size={11} fill="currentColor" />
            <span className="font-bold text-neutral-700">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div>
          {/* Price breakdown */}
          <div className="flex justify-center items-baseline gap-2 text-sm font-black mt-1">
            <span className="text-black">
              ₹{finalPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through font-normal">
                ₹{price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <Link to={`/product/${_id}`} className="block w-full mt-3">
            <button
              disabled={stock === 0}
              className={`w-full text-[10px] font-black py-2.5 px-4 rounded-full uppercase tracking-widest transition-all duration-200 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-[2px] ${
                stock === 0
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed border-neutral-300 shadow-none'
                  : 'bg-black text-white hover:bg-[#ff007f]'
              }`}
            >
              {stock === 0 ? 'SOLD OUT' : 'QUICK VIEW'}
            </button>
          </Link>
        </div>

      </div>

    </div>
  );
};
export default ProductCard;
