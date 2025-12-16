'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Navigation() {
  const { t } = useLanguage();

  return (
    <nav className="bg-gray-700 p-2 flex justify-center space-x-4">
      <a href="#home" className="text-white hover:text-gray-300">{t.navHome}</a>
      <a href="#properties" className="text-white hover:text-gray-300">{t.navProperties}</a>
      <a href="#about" className="text-white hover:text-gray-300">{t.navAbout}</a>
      <a href="#contact" className="text-white hover:text-gray-300">{t.navContact}</a>
    </nav>
  );
}
