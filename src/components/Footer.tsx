import React from 'react';

import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 mt-16 border-t border-gray-100 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-vison-dark-charcoal font-nunito">
              Vison - Visualize JSON
            </h3>
            <p className="mt-1 text-sm text-vison-charcoal/70 font-nunito">
              The Smarter Way to View, Edit, and Securely Share JSON
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-2 text-xs text-vison-charcoal/60 font-nunito">
            <a
              href="https://github.com/wazeerc/vison"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-vison-purple transition-colors"
            >
              <Github size={14} />
              Contribute on GitHub
            </a>
            <p>&copy; {new Date().getFullYear()} Vison. Made with ❤️.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
