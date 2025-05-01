
import React from 'react';
import { FileJson } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-8 mb-8 border-b border-gray-100 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="relative">
          <FileJson size={36} className="text-vison-purple animate-float" />
          <div className="absolute inset-0 bg-vison-purple/10 rounded-full blur-xl -z-10"></div>
        </div>
        <h1 className="text-4xl font-bold text-vison-dark-charcoal font-montserrat">Vison</h1>
      </div>
      <p className="mt-2 text-center text-vison-charcoal/80 max-w-md mx-auto">
        The Smarter Way to View, Edit and Transform JSON Data
      </p>
    </header>
  );
};

export default Header;
