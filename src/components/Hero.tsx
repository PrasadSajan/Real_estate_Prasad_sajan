'use client';

import { useLanguage } from '../context/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Hero() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '');

  const [propertyTypes, setPropertyTypes] = useState<{ name: string, label: string }[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Property Types
      const { data: typesData } = await supabase
        .from('property_types')
        .select('*')
        .order('label', { ascending: true });

      if (typesData) {
        setPropertyTypes(typesData);
      }

      // 2. Fetch Unique Locations from Properties
      const { data: propsData } = await supabase
        .from('properties')
        .select('location');

      if (propsData) {
        // Extract unique locations
        const uniqueLocations = Array.from(new Set(propsData.map(item => item.location).filter(Boolean)));
        setLocations(uniqueLocations.sort());
      }
    };

    fetchData();
  }, []);

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.location-dropdown') && !target.closest('.type-dropdown')) {
        setIsLocationOpen(false);
        setIsTypeOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (propertyType) params.set('type', propertyType);

    router.push(`/?${params.toString()}`);
  };

  const currentTypeLabel = propertyTypes.find(t => t.name === propertyType)?.label || 'All Types';

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

            {/* Location Custom Dropdown */}
            <div className="flex-grow relative location-dropdown">
              <button
                type="button"
                onClick={() => { setIsLocationOpen(!isLocationOpen); setIsTypeOpen(false); }}
                className="w-full p-4 pl-12 rounded-xl bg-white/95 text-left text-gray-900 focus:outline-none focus:ring-4 focus:ring-accent/30 transition-shadow text-lg font-medium flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 absolute left-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </span>
                  <span>{location || 'All Locations'}</span>
                </div>
                <span className={`text-accent transition-transform duration-300 ${isLocationOpen ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </button>

              {isLocationOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up z-30 max-h-60 overflow-y-auto">
                  <ul className="py-2 text-left">
                    <li>
                      <button
                        type="button"
                        onClick={() => { setLocation(''); setIsLocationOpen(false); }}
                        className={`w-full text-left px-6 py-3 text-lg transition-colors hover:bg-gray-50 ${location === '' ? 'text-accent font-bold bg-accent/5' : 'text-gray-700'}`}
                      >
                        All Locations
                      </button>
                    </li>
                    {locations.map((loc) => (
                      <li key={loc}>
                        <button
                          type="button"
                          onClick={() => { setLocation(loc); setIsLocationOpen(false); }}
                          className={`w-full text-left px-6 py-3 text-lg transition-colors hover:bg-gray-50 ${location === loc ? 'text-accent font-bold bg-accent/5' : 'text-gray-700'}`}
                        >
                          {loc}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Property Type Custom Dropdown */}
            <div className="md:w-1/4 relative type-dropdown">
              <button
                type="button"
                onClick={() => { setIsTypeOpen(!isTypeOpen); setIsLocationOpen(false); }}
                className="w-full h-full p-4 rounded-xl bg-white/95 text-left text-gray-900 focus:outline-none focus:ring-4 focus:ring-accent/30 transition-shadow text-lg font-medium flex items-center justify-between whitespace-nowrap"
              >
                <span>{currentTypeLabel}</span>
                <span className={`text-gray-500 transition-transform duration-300 ${isTypeOpen ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </button>

              {isTypeOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up z-30">
                  <ul className="py-2 text-left">
                    <li>
                      <button
                        type="button"
                        onClick={() => { setPropertyType(''); setIsTypeOpen(false); }}
                        className={`w-full text-left px-6 py-3 text-lg transition-colors hover:bg-gray-50 ${propertyType === '' ? 'text-accent font-bold bg-accent/5' : 'text-gray-700'}`}
                      >
                        All Types
                      </button>
                    </li>
                    {propertyTypes.map((type) => (
                      <li key={type.name}>
                        <button
                          type="button"
                          onClick={() => { setPropertyType(type.name); setIsTypeOpen(false); }}
                          className={`w-full text-left px-6 py-3 text-lg transition-colors hover:bg-gray-50 ${propertyType === type.name ? 'text-accent font-bold bg-accent/5' : 'text-gray-700'}`}
                        >
                          {type.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
