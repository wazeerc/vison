
import React from 'react';
import { JsonIcon } from './HandDrawnIcons';

const Header: React.FC = () => {
  return (
    <header className="py-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-center gap-3">
        <JsonIcon className="w-10 h-10 text-vison-blue-dark" />
        <h1 className="text-3xl font-bold text-vison-dark-charcoal">Vison</h1>
      </div>
      <p className="mt-2 text-center text-vison-charcoal/80">
        The Smarter Way to View and Edit JSON
      </p>
    </header>
  );
};

export default Header;
