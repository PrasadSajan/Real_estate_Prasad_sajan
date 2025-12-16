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
  const { language } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img src={imageSrc} alt={imageAlt} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{language === 'mr' && title_mr ? title_mr : title}</h3>
        <p className="text-gray-700 mb-4">{language === 'mr' && description_mr ? description_mr : description}</p>
        <p className="text-xl font-semibold text-blue-600">{price}</p>
      </div>
    </div>
  );
}
