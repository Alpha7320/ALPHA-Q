import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuoteGenerator } from './components/QuoteGenerator';
import { CategoryBrowser } from './components/CategoryBrowser';
import { QuoteCard } from './components/QuoteCard';
import { Loader } from './components/Loader';
import { getInitialQuotes } from './services/geminiService';
import type { Quote } from './types';
import { CATEGORIES } from './constants';

const App: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch quotes from a few categories to populate the page
      const randomCategory1 = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const randomCategory2 = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      
      const [quotes1, quotes2] = await Promise.all([
        getInitialQuotes(randomCategory1.name),
        getInitialQuotes(randomCategory2.name)
      ]);

      const combinedQuotes = [...quotes1, ...quotes2];
      // Filter out potential duplicates or malformed quotes
      const uniqueQuotes = Array.from(new Set(combinedQuotes.map(q => q.quote)))
                                .map(quote => combinedQuotes.find(q => q.quote === quote))
                                .filter((q): q is Quote => q !== undefined);
      
      setQuotes(uniqueQuotes);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch initial quotes. The wisdom of the ages is currently unavailable.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quoteOfTheDay = quotes.length > 0 ? quotes[0] : null;

  return (
    <div className="min-h-screen text-slate-200">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        
        {/* Quote of the Day Section */}
        {isLoading && !quoteOfTheDay && <div className="text-center py-10"><Loader /></div>}
        {error && <div className="text-center py-10 text-red-400">{error}</div>}
        
        {quoteOfTheDay && (
          <section className="mb-16 text-center animate-fadeInUp">
            <h2 className="text-2xl font-light text-amber-400 mb-4">Quote of the Day</h2>
            <div className="max-w-4xl mx-auto">
              <QuoteCard quote={quoteOfTheDay.quote} author={quoteOfTheDay.author} isFeatured={true} />
            </div>
          </section>
        )}

        {/* AI Quote Generator Section */}
        <section className="mb-16 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <QuoteGenerator />
        </section>

        {/* Categories Section */}
        <section className="mb-16 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
          <CategoryBrowser onCategorySelect={async (category) => {
              setIsLoading(true);
              try {
                  const newQuotes = await getInitialQuotes(category);
                  setQuotes(newQuotes);
              } catch(err) {
                  setError("Could not fetch quotes for this category.");
              } finally {
                  setIsLoading(false);
              }
          }}/>
        </section>

        {/* More Quotes Section */}
        <section className="animate-fadeInUp" style={{ animationDelay: '600ms' }}>
          <h2 className="text-3xl font-bold text-center mb-8">Explore More Quotes</h2>
          {isLoading && quotes.length === 0 ? (
            <div className="text-center py-10"><Loader /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quotes.slice(1).map((q, index) => (
                <QuoteCard key={index} quote={q.quote} author={q.author} />
              ))}
            </div>
          )}
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default App;