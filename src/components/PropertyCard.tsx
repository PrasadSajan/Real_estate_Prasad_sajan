'use client';

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '@/utils/format';

interface PropertyCardProps {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  title_mr?: string;
  description: string;
  description_mr?: string;
  price: string;
  latitude?: number;
  longitude?: number;
  onViewMap?: () => void;
  onClick?: () => void; // Added onClick prop
}

export default function PropertyCard({ id, imageSrc, imageAlt, title, title_mr, description, description_mr, price, latitude, longitude, onViewMap, onClick }: PropertyCardProps) {
  const { language, t } = useLanguage();
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/properties/${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this property: ${title}`,
          url: url
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div
      className="group bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col h-full cursor-pointer"
      onClick={onClick} // Trigger modal on card click
    >
      <div className="relative overflow-hidden h-48 flex-shrink-0">
        <div className="block w-full h-full">
          <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 pointer-events-none"></div>
        {latitude && longitude && (
          <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow cursor-pointer hover:bg-white z-10" onClick={(e) => { e.stopPropagation(); onViewMap?.(); }} title="View on Map">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
        )}

        {/* Share Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleShare}
            className="bg-white/90 p-2 rounded-full shadow hover:bg-white transition-all active:scale-95 relative"
            title="Share Property"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            {showCopied && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-fade-in-up">
                Link Copied!
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="block group-hover:text-accent transition-colors">
          <h3 className="text-2xl font-bold mb-2 font-serif text-primary line-clamp-1">{language === 'mr' && title_mr ? title_mr : title}</h3>
        </div>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2 flex-grow">{language === 'mr' && description_mr ? description_mr : description}</p>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
          <p className="text-xl font-bold text-accent">{formatPrice(price)}</p>
          <div className="flex gap-4">
            {latitude && longitude && onViewMap && (
              <button
                onClick={(e) => { e.stopPropagation(); onViewMap(); }}
                className="text-primary text-sm font-semibold uppercase tracking-wide border-b-2 border-transparent hover:border-accent transition-colors"
              >
                Map
              </button>
            )}
            <button className="text-primary text-sm font-semibold uppercase tracking-wide border-b-2 border-transparent hover:border-accent transition-colors">
              {t.cardDetails || 'Details'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
