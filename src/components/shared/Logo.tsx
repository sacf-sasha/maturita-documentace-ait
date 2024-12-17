import React from 'react';
import { Gamepad2 } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex-shrink-0">
      <div className="flex items-center gap-2">
        <Gamepad2 className="h-8 w-8 text-purple-500" />
        <span className="text-white text-xl font-bold">SACF</span>
      </div>
    </div>
  );
};