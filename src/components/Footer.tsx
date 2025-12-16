'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white py-6 text-center">
      <p>{t.footerRight}</p>
    </footer>
  );
}
