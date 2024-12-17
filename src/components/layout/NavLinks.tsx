import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { navItems } from '../../utils/navigation';
import { useCart } from '../../context/CartContext';

export const NavLinks = () => {
  const { items } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevItemsLength, setPrevItemsLength] = useState(items.length);

  useEffect(() => {
    if (items.length !== prevItemsLength) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
      setPrevItemsLength(items.length);
    }
  }, [items.length, prevItemsLength]);

  return (
    <div className="ml-10 flex items-baseline space-x-4">
      {navItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.href}
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'text-white bg-gray-800'
                : 'text-gray-300 hover:text-white'
            }`
          }
        >
          {item.title}
        </NavLink>
      ))}
      <NavLink
        to="/cart"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
            isActive
              ? 'text-white bg-gray-800'
              : 'text-gray-300 hover:text-white'
          }`
        }
      >
        <ShoppingCart className={`h-5 w-5 transition-transform duration-300 ${
          isAnimating ? 'scale-125' : ''
        }`} />
        {items.length > 0 && (
          <span className={`absolute -top-1 -right-1 bg-purple-600 text-white text-xs 
            rounded-full h-5 w-5 flex items-center justify-center
            transition-all duration-300 transform
            ${isAnimating ? 'scale-125 rotate-12' : ''}`}
          >
            {items.length}
          </span>
        )}
      </NavLink>
    </div>
  );
};