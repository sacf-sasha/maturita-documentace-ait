import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Logo } from '../shared/Logo';
import { FooterLinks } from './FooterLinks';
import { SocialLinks } from './SocialLinks';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="text-sm mt-4">
              Creating immersive gaming experiences that push the boundaries of imagination.
            </p>
          </div>
          
          <FooterLinks 
            title="Quick Links" 
            links={[
              { label: 'About Us', href: '/about' },
              { label: 'Games', href: '/games' },
              { label: 'News', href: '/news' },
              { label: 'Careers', href: '/careers' }
            ]} 
          />
          
          <FooterLinks 
            title="Support" 
            links={[
              { label: 'Contact', href: '/contact' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' }
            ]} 
          />
          
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <SocialLinks />
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} SACF Games. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;