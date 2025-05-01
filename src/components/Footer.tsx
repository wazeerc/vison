
import React from 'react';
import { Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 mt-16 border-t border-gray-100 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-vison-dark-charcoal font-montserrat">Vison</h3>
            <p className="mt-1 text-sm text-vison-charcoal/70">
              The Smarter Way to View and Edit JSON
            </p>
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="#features" className="text-vison-purple-dark hover:text-vison-purple transition-colors">Features</a>
            <a href="#docs" className="text-vison-purple-dark hover:text-vison-purple transition-colors">Documentation</a>
            <a href="#about" className="text-vison-purple-dark hover:text-vison-purple transition-colors">About</a>
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="text-vison-charcoal/60 hover:text-vison-purple transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-vison-charcoal/60 hover:text-vison-purple transition-colors">
              <Twitter size={20} />
            </a>
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
