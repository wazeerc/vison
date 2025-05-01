
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 mt-16 border-t border-gray-100 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center items-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-vison-dark-charcoal font-pacifico">Vison</h3>
            <p className="mt-1 text-sm text-vison-charcoal/70">
              The Smarter Way to View and Edit JSON
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-vison-charcoal/50">
          <p>&copy; {new Date().getFullYear()} Vison. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ for developers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
