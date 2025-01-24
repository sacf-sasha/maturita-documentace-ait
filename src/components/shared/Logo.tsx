import React from 'react';

export const Logo = () => {
  return (
    <div className="flex-shrink-0">
      <div className="flex items-center gap-2">
        <img 
          src="/logo/SACF-logo.webp" 
          alt="SACF Logo" 
          className="h-16 w-auto"
        />
      </div>
    </div>
  );
};