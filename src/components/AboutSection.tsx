'use client';

import { useLanguage } from '../context/LanguageContext';

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-blue-600 text-white py-12 px-4 text-center">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-4">{t.aboutTitle}</h2>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto">
          {t.aboutText}
        </p>
      </div>
    </section>
  );
}
