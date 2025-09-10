import React, { useState } from 'react';
import { generateQuote } from '../services/geminiService';
import type { Quote } from '../types';
import { QuoteCard } from './QuoteCard';
import { Loader } from './Loader';

export const QuoteGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [generatedQuote, setGeneratedQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedQuote(null);
    try {
      const newQuote = await generateQuote(topic);
      setGeneratedQuote(newQuote);
    } catch (err) {
      console.error(err);
      setError('Failed to generate a quote. The AI muse is currently resting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-2">AI Quote Generator</h2>
      <p className="text-center text-slate-400 mb-6">Enter a topic, mood, or name to generate a unique quote.</p>
      
      <form onSubmit={handleGenerate} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., 'The Future', 'Inner Peace', 'Elon Musk'"
          className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all duration-300 shadow-inner"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-6 py-3 rounded-md hover:shadow-lg hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition-all duration-300 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center"
        >
          {isLoading ? <Loader /> : 'Generate'}
        </button>
      </form>
      
      {error && <p className="text-center text-red-400 mt-4">{error}</p>}

      <div className="mt-8 min-h-[150px] flex items-center justify-center">
        {isLoading && !generatedQuote && (
          <div className="text-center">
            <Loader />
            <p className="mt-2 text-slate-400">Consulting the digital oracle...</p>
          </div>
        )}
        {generatedQuote && (
           <div className="w-full max-w-2xl mx-auto animate-fadeInUp">
             <QuoteCard quote={generatedQuote.quote} author={generatedQuote.author} />
           </div>
        )}
      </div>
    </div>
  );
};