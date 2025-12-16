'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative bg-cover bg-center h-96 flex items-center justify-center text-white" style={{ backgroundImage: "url('https://placehold.co/1200x400?text=Beautiful+Property')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center">
        <h2 className="text-5xl font-bold mb-4">{t.heroTitle}</h2>
        <p className="text-xl mb-8">{t.heroSubtitle}</p>
        <a href="#properties" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300">{t.heroButton}</a>
      </div>
    </section>
  );
}
