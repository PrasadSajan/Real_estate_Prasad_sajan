'use client';

import { useLanguage } from '../context/LanguageContext';

interface PropertyCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  title_mr?: string;
  description: string;
  description_mr?: string;
  price: string;
}

export default function PropertyCard({ imageSrc, imageAlt, title, title_mr, description, description_mr, price }: PropertyCardProps) {
  const { language, t } = useLanguage();

  return (
    <div className="group bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
      <div className="relative overflow-hidden h-48">
        <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 font-serif text-primary">{language === 'mr' && title_mr ? title_mr : title}</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{language === 'mr' && description_mr ? description_mr : description}</p>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <p className="text-xl font-bold text-accent">{price}</p>
          <button className="text-primary text-sm font-semibold uppercase tracking-wide border-b-2 border-transparent hover:border-accent transition-colors">
            {t.cardDetails || 'Details'}
          </button>
        </div>
      </div>
    </div>
  );
}
