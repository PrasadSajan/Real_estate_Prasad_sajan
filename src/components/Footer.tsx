'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-950 text-white py-8 text-center border-t border-gray-900">
      <p className="text-gray-400 font-light tracking-wide text-sm">{t.footerRight}</p>
    </footer>
  );
}
