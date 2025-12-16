'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-primary text-white p-4 shadow-md transition-all duration-300">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl font-bold tracking-wide">{t.headerTitle}</h1>
          <p className="text-sm opacity-90 font-light tracking-wider uppercase">{t.headerSubtitle}</p>
        </div>
        <button
          onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
          className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-6 rounded-full transition duration-300 shadow-lg transform hover:-translate-y-0.5"
        >
          {language === 'en' ? 'मराठी' : 'English'}
        </button>
      </div>
    </header>
  );
}
