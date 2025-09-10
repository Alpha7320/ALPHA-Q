import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-950/50 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-700/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#/" className="flex items-center space-x-3">
          <svg
            className="h-10 w-10 text-amber-400 logo-glow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M12 12h-9" />
            <path d="M9 18H3" />
            <circle cx="17" cy="15" r="3" />
            <path d="m21 19-4-4" />
          </svg>
          <h1 className="text-3xl font-bold tracking-wider text-white font-playfair">
            ALPHA QUOTES
          </h1>
        </a>
        <nav className="flex items-center space-x-4 sm:space-x-6">
            <a href="#/" className="text-slate-300 hover:text-amber-400 transition-colors font-medium text-sm sm:text-base">Home</a>
            <a href="#/generate" className="text-slate-300 hover:text-amber-400 transition-colors font-medium text-sm sm:text-base">Generate Quote</a>
        </nav>
      </div>
    </header>
  );
};
