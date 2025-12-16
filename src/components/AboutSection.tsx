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
        <p className="text-lg leading-relaxed max-w-3xl mx-auto font-light tracking-wide text-gray-300 mb-16">
          {t.aboutText}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-accent mb-2">15+</p>
            <p className="text-gray-400 text-sm uppercase tracking-wider">Years Experience</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-accent mb-2">500+</p>
            <p className="text-gray-400 text-sm uppercase tracking-wider">Properties Sold</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-accent mb-2">350+</p>
            <p className="text-gray-400 text-sm uppercase tracking-wider">Happy Families</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-accent mb-2">25+</p>
            <p className="text-gray-400 text-sm uppercase tracking-wider">Awards Won</p>
          </div>
        </div>
      </div>
    </section>
  );
}
