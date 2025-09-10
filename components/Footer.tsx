import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent mt-16">
      <div className="container mx-auto px-4 py-8 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} Alpha Quotes. Powered by Generative AI.</p>
        <p className="mt-2 text-sm font-semibold tracking-wider text-amber-500">CREATED BY : ALI</p>
      </div>
    </footer>
  );
};