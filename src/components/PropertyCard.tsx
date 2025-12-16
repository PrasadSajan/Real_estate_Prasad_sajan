'use client';

import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '@/utils/format';

interface PropertyCardProps {
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
}

export default function PropertyCard({ imageSrc, imageAlt, title, title_mr, description, description_mr, price, latitude, longitude, onViewMap }: PropertyCardProps) {
  const { language, t } = useLanguage();

  return (
    <div className="group bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
      <div className="relative overflow-hidden h-48">
        <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300"></div>
        {latitude && longitude && (
          <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow cursor-pointer hover:bg-white" onClick={onViewMap} title="View on Map">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 font-serif text-primary">{language === 'mr' && title_mr ? title_mr : title}</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{language === 'mr' && description_mr ? description_mr : description}</p>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <p className="text-xl font-bold text-accent">{formatPrice(price)}</p>
          <div className="flex gap-4">
            {latitude && longitude && onViewMap && (
              <button onClick={onViewMap} className="text-primary text-sm font-semibold uppercase tracking-wide border-b-2 border-transparent hover:border-accent transition-colors">
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
