'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative bg-cover bg-center h-[85vh] flex items-center justify-center text-white" style={{ backgroundImage: "url('https://placehold.co/1920x1080?text=Luxury+Living')" }}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80"></div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">{t.heroTitle}</h2>
        <p className="text-xl md:text-2xl mb-12 font-light tracking-wide">{t.heroSubtitle}</p>

        {/* Search Bar */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-white/20">
          <form className="flex flex-col md:flex-row gap-4">
            <input type="text" placeholder="Search locality (e.g., Temple Area, Vidyanagar)" className="flex-1 p-3 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent" />
            <select className="flex-1 p-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="">Property Type</option>
              <option value="rowhouse">Row House</option>
              <option value="plot">Plot</option>
              <option value="flat">Flat</option>
              <option value="land">Agricultural Land</option>
            </select>
            <button type="submit" className="bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded-md transition duration-300 shadow-md uppercase tracking-wider">
              {t.heroButton}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
