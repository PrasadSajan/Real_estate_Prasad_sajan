'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-gray-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h1 className="text-3xl font-bold">{t.headerTitle}</h1>
        <p className="text-lg">{t.headerSubtitle}</p>
      </div>
      <button
        onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        {language === 'en' ? 'मराठी' : 'English'}
      </button>
    </header>
  );
}
