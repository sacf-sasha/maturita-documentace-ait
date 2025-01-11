import React, { useState } from 'react';
import { Menu, X, Gamepad2 } from 'lucide-react';
import { NavLinks } from './NavLinks';
import { Logo } from '../shared/Logo';
import AuthButtons from '../auth/AuthButtons';
import { Link } from 'react-router-dom';

//дополнительная навигация для новых вещей
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <nav className="hidden md:flex space-x-8">
              {/* <Link to="/" className="text-white hover:text-blue-400">Home</Link>
              <Link to="/games" className="text-white hover:text-blue-400">Games</Link>
              <Link to="/gameplay" className="text-white hover:text-blue-400">Play Game</Link>
              <Link to="/about" className="text-white hover:text-blue-400">About</Link>
              <Link to="/contact" className="text-white hover:text-blue-400">Contact</Link> */}
            </nav>
            <NavLinks />
            <AuthButtons />
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLinks />
            <div className="mt-4">
              <AuthButtons />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;