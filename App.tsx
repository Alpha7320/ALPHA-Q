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

// --- PAGE COMPONENTS DEFINED WITHIN App.tsx ---

const HomePage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const initialQuotes = await getInitialQuotes(randomCategory.name);
      
      const uniqueQuotes = Array.from(new Set(initialQuotes.map(q => q.quote)))
                                .map(quote => initialQuotes.find(q => q.quote === quote))
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
  }, [fetchQuotes]);

  const quoteOfTheDay = quotes.length > 0 ? quotes[0] : null;

  return (
    <>
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

      <section className="mb-16 text-center animate-fadeInUp" style={{ animationDelay: '200ms' }}>
         <h2 className="text-3xl font-bold mb-4">Create Your Own Wisdom</h2>
         <p className="text-slate-400 mb-6 max-w-2xl mx-auto">Use our AI Quote Generator to craft unique quotes on any topic. Perfect for inspiration, social media, or finding the right words.</p>
         <a href="#/generate" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-8 py-4 rounded-md hover:shadow-lg hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition-all duration-300 inline-block">
          Launch Generator
         </a>
      </section>

      <section className="mb-16 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
        <CategoryBrowser />
      </section>

      <section className="animate-fadeInUp" style={{ animationDelay: '600ms' }}>
        <h2 className="text-3xl font-bold text-center mb-8">Explore More Quotes</h2>
        {isLoading && quotes.length <= 1 ? (
          <div className="text-center py-10"><Loader /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quotes.slice(1).map((q, index) => (
              <QuoteCard key={index} quote={q.quote} author={q.author} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

const CategoryPage: React.FC<{ categoryName: string }> = ({ categoryName }) => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategoryQuotes = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const newQuotes = await getInitialQuotes(categoryName);
                // Fix: When using a type guard, the filter predicate must return a boolean.
                // The logical AND `&&` operator can return a string, so we cast to boolean.
                setQuotes(newQuotes.filter((q): q is Quote => Boolean(q && q.quote && q.author)));
            } catch(err) {
                console.error(err);
                setError(`Could not fetch quotes for ${categoryName}.`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategoryQuotes();
    }, [categoryName]);

    return (
        <section className="animate-fadeInUp">
            <h2 className="text-4xl font-bold text-center mb-12 font-playfair">
                Quotes on <span className="text-amber-400">{categoryName}</span>
            </h2>
            {isLoading ? (
                <div className="text-center py-10"><Loader /></div>
            ) : error ? (
                <div className="text-center py-10 text-red-400">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {quotes.map((q, index) => (
                        <QuoteCard key={index} quote={q.quote} author={q.author} />
                    ))}
                </div>
            )}
        </section>
    );
};

const GeneratorPage: React.FC = () => {
    return (
        <section className="animate-fadeInUp">
            <QuoteGenerator />
        </section>
    );
};

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
      window.scrollTo(0, 0); // Scroll to top on page change
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    const decodedRoute = decodeURIComponent(route);
    if (decodedRoute.startsWith('#/category/')) {
      const categoryName = decodedRoute.substring('#/category/'.length);
      return <CategoryPage categoryName={categoryName} />;
    }

    switch (decodedRoute) {
      case '#/generate':
        return <GeneratorPage />;
      case '#/':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen text-slate-200">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;