'use client';

import { useLanguage } from '../context/LanguageContext';

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-primary text-white py-20 px-4 text-center relative overflow-hidden">
      {/* Decorative Circle */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>

      <div className="container mx-auto relative z-10">
        <h2 className="text-4xl font-bold mb-6 font-serif">{t.aboutTitle}</h2>
        <div className="w-20 h-1 bg-accent mx-auto mb-8 rounded-full"></div>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto font-light tracking-wide text-gray-300">
          {t.aboutText}
        </p>
      </div>
    </section>
  );
}
