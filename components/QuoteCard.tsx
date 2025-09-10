
import React, { useState } from 'react';
import { generateQuoteImage, explainQuote } from '../services/geminiService';
import { Loader } from './Loader';
import { Modal } from './Modal';

interface QuoteCardProps {
  quote: string;
  author: string;
  isFeatured?: boolean;
}

const QuoteVisualizer: React.FC<{ quote: string; author: string; onClose: () => void }> = ({ quote, author, onClose }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        const visualize = async () => {
            try {
                const base64Image = await generateQuoteImage(quote);
                setImageUrl(`data:image/jpeg;base64,${base64Image}`);
            } catch (err) {
                setError('Could not generate image. Please try another quote.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        visualize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quote]);

    return (
        <Modal onClose={onClose} title="Visualize Quote">
            <div className="relative w-full aspect-square bg-slate-800 rounded-lg overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Loader />
                        <p className="mt-4 text-slate-300">Generating visual harmony...</p>
                    </div>
                )}
                {error && <div className="absolute inset-0 flex items-center justify-center text-red-400 p-4">{error}</div>}
                {imageUrl && (
                    <img src={imageUrl} alt="AI generated background for the quote" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center p-8 text-center">
                    <p className={`font-playfair text-white text-2xl md:text-3xl lg:text-4xl leading-tight shadow-text`}>
                        “{quote}”
                    </p>
                    <p className="mt-6 text-xl text-slate-200 font-light">- {author}</p>
                </div>
            </div>
        </Modal>
    );
};

const QuoteExplainer: React.FC<{ quote: string; author: string; onClose: () => void }> = ({ quote, author, onClose }) => {
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        const getExplanation = async () => {
            try {
                const result = await explainQuote(quote, author);
                setExplanation(result);
            } catch (err) {
                setError('Could not get an explanation. The wisdom remains a mystery for now.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        getExplanation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quote, author]);

    return (
        <Modal onClose={onClose} title={`The Meaning Behind "${quote.substring(0, 20)}..."`}>
            {isLoading && <div className="text-center"><Loader /></div>}
            {error && <div className="text-red-400">{error}</div>}
            {explanation && <p className="text-slate-300 leading-relaxed">{explanation}</p>}
        </Modal>
    );
};


export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, author, isFeatured = false }) => {
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`“${quote}” - ${author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const cardClasses = isFeatured
    ? "bg-slate-800/50 p-8 rounded-xl shadow-2xl border border-slate-700"
    : "bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-amber-500/10 hover:border-slate-600 border border-transparent transition-all duration-300 flex flex-col h-full";
  
  const quoteClasses = isFeatured 
    ? "text-3xl md:text-4xl font-playfair" 
    : "text-xl font-playfair";

  return (
    <>
      <div className={cardClasses}>
        <div className="flex-grow">
          <blockquote className="border-l-4 border-amber-400 pl-4 mb-4">
            <p className={`${quoteClasses} text-white`}>“{quote}”</p>
          </blockquote>
          <cite className="block text-right text-amber-300 not-italic">- {author}</cite>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-end space-x-2">
           <button onClick={() => setIsExplainerOpen(true)} className="px-3 py-2 text-sm rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-slate-200">Explain</button>
           <button onClick={() => setIsVisualizerOpen(true)} className="px-3 py-2 text-sm rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-slate-200">Visualize</button>
           <button onClick={handleCopy} className="px-3 py-2 text-sm rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-slate-200">{copied ? 'Copied!' : 'Copy'}</button>
        </div>
      </div>
      {isVisualizerOpen && <QuoteVisualizer quote={quote} author={author} onClose={() => setIsVisualizerOpen(false)} />}
      {isExplainerOpen && <QuoteExplainer quote={quote} author={author} onClose={() => setIsExplainerOpen(false)} />}
    </>
  );
};
