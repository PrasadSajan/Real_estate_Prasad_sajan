import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import FeaturedProperties from '../components/FeaturedProperties';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

interface Property {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  title_mr?: string;
  description: string;
  description_mr?: string;
  price: string;
}

import { supabase } from '@/lib/supabase';
import localProperties from '@/data/properties.json';

async function getProperties(): Promise<Property[]> {
  try {
    const { data, error } = await supabase.from('properties').select('*');
    if (!error && data && data.length > 0) {
      return data as Property[];
    }
  } catch (e) {
    console.warn('Supabase fetch failed, using local data:', e);
  }
  return localProperties;
}

export default async function Home() {
  const properties = await getProperties();

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <Navigation />
      <Hero />

      {/* Featured Properties Section */}
      <FeaturedProperties properties={properties} />

      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
