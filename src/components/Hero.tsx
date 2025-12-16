'use client';

import { useLanguage } from '../context/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Hero() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (propertyType) params.set('type', propertyType);

    router.push(`/?${params.toString()}`);
  };

  return (
    <section id="home" className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Zoom Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 animate-slow-zoom"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-2xl font-serif">
          {t.heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-3xl text-gray-100 font-light tracking-wide max-w-3xl mx-auto drop-shadow-md">
          {t.heroSubtitle}
        </p>

        {/* Search Bar Container - Glassmorphism */}
        <div className="mt-12 bg-white/20 backdrop-blur-xl border border-white/30 p-4 md:p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto transform transition-all hover:scale-[1.01]">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow group relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search by Location (e.g. Kothrud, Baner)"
                className="w-full p-4 pl-12 rounded-xl bg-white/95 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-accent/30 transition-shadow text-lg font-medium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="md:w-1/4 relative">
              <select
                className="w-full h-full p-4 rounded-xl bg-white/95 text-gray-900 focus:outline-none focus:ring-4 focus:ring-accent/30 appearance-none text-lg font-medium"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="rowhouse">Row House</option>
                <option value="plot">Plot</option>
                <option value="flat">Flat</option>
                <option value="land">Agri Land</option>
                <option value="commercial">Commercial</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            <button type="submit" className="bg-accent hover:bg-accent-hover text-white text-lg font-bold py-4 px-10 rounded-xl transition duration-300 shadow-lg hover:shadow-accent/50 active:scale-95 flex items-center justify-center gap-2">
              <span>Search</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
