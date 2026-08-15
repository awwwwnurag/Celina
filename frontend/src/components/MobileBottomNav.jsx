import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3x3, Heart, ShoppingCart, User } from 'lucide-react';
import CartContext from '../context/CartContext';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { cartItems, wishlistItems } = React.useContext(CartContext);

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/shop', icon: Grid3x3, label: 'Categories' },
    { path: '/wishlist', icon: Heart, label: 'Wishlist', count: wishlistItems.length },
    { path: '/checkout', icon: ShoppingCart, label: 'Cart', count: cartItems.length },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path === '/home') return location.pathname === '/home';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 lg:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                active ? 'text-brand-burgundy' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon size={22} />
                {item.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-burgundy text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {item.count > 9 ? '9+' : item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
