import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import FeaturedProperties from '../components/FeaturedProperties';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
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
  images?: string[];
  type?: string;
}

import { supabase } from '@/lib/supabase';
import localProperties from '@/data/properties.json';

// Helper to filter local data
function filterLocalProperties(properties: any[], location?: string, type?: string) {
  return properties.filter(p => {
    const matchesLocation = location
      ? (p.title?.toLowerCase().includes(location.toLowerCase()) || p.description?.toLowerCase().includes(location.toLowerCase()))
      : true;
    const matchesType = type
      ? (p.type === type || p.title?.toLowerCase().includes(type.toLowerCase()))
      : true;
    return matchesLocation && matchesType;
  });
}

async function getProperties(location?: string, type?: string, sort?: string): Promise<Property[]> {
  try {
    let query = supabase.from('properties').select('*');

    if (location) {
      // Filter by the specific location column since we are using a dropdown
      query = query.eq('location', location);
    }

    if (type) {
      // Exact match on the new 'type' column
      query = query.eq('type', type);
    }

    // Sorting Logic
    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else {
      // Default: Newest first
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      // Fallback to local data on error
      return filterLocalProperties(localProperties, location, type) as Property[];
    }

    // Return data or empty array if no matches
    return (data as Property[]) || [];

  } catch (e) {
    console.warn('Supabase fetch failed, using local data:', e);
    return filterLocalProperties(localProperties, location, type) as Property[];
  }
}

// Define the expected shape of the properties (Awaited)
interface SearchParamsProps {
  searchParams: Promise<{ location?: string, type?: string, sort?: string }>;
}

export default async function Home(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  const properties = await getProperties(searchParams.location, searchParams.type, searchParams.sort);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <Navigation />
      <Hero />

      {/* Featured Properties Section */}
      <FeaturedProperties properties={properties} />

      <WhyChooseUs />
      <Testimonials />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
