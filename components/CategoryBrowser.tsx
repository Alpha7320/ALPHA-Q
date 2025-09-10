import React from 'react';
import { CATEGORIES } from '../constants';

interface CategoryBrowserProps {
    onCategorySelect: (category: string) => void;
}

export const CategoryBrowser: React.FC<CategoryBrowserProps> = ({ onCategorySelect }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        {CATEGORIES.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategorySelect(category.name)}
            className="group bg-slate-800/50 p-6 rounded-xl flex flex-col items-center justify-center text-center gap-4 border border-slate-700 hover:border-amber-400/50 hover:bg-slate-800/80 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-amber-400 group-hover:text-amber-300 transition-colors duration-300 group-hover:scale-110 transform">
              {category.icon}
            </div>
            <span className="font-semibold text-slate-200">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};