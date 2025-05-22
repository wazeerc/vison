import React from 'react';

import { VisonLogo } from './HandDrawnIcons';

const Header: React.FC = () => {
  return (
    <header className="py-8 mb-8 border-b border-gray-100 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="relative">
          <VisonLogo className="w-8 h-8 text-vison-purple" />
          <div className="absolute inset-0 bg-vison-purple/10 rounded-full blur-xl -z-10"></div>
        </div>
        <h1 className="text-4xl font-bold text-vison-dark-charcoal font-nunito">Vison</h1>
        <span className="relative inline-block px-[8px] py-[3px] text-xs font-semibold text-vison-purple bg-gradient-to-br from-vison-peach/70 to-vison-blue/30 rounded-full shadow-soft-sm border border-vison-purple/20 -translate-y-2 overflow-hidden">
          Beta
          <span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shine"
            style={{ backgroundSize: '200% 100%', animationDuration: '5s' }}
          ></span>
        </span>
      </div>
      <p className="mt-2 text-center text-vison-charcoal/80 max-w-md mx-auto font-nunito">
        Effortlessly View, Edit, and Share JSON Data
      </p>
    </header>
  );
};

export default Header;
