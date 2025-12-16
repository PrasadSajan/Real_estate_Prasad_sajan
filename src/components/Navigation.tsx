'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Navigation() {
  const { t } = useLanguage();

  return (

    <nav className="bg-primary-light p-3 flex justify-center space-x-8 shadow-inner">
      <a href="#home" className="text-gray-300 hover:text-accent font-medium tracking-wide transition-colors duration-300 uppercase text-sm">{t.navHome}</a>
      <a href="#properties" className="text-gray-300 hover:text-accent font-medium tracking-wide transition-colors duration-300 uppercase text-sm">{t.navProperties}</a>
      <a href="#about" className="text-gray-300 hover:text-accent font-medium tracking-wide transition-colors duration-300 uppercase text-sm">{t.navAbout}</a>
      <a href="#contact" className="text-gray-300 hover:text-accent font-medium tracking-wide transition-colors duration-300 uppercase text-sm">{t.navContact}</a>
    </nav>
  );
}
