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

async function getProperties(): Promise<Property[]> {
  const res = await fetch('http://localhost:3000/api/properties', { cache: 'no-store' }); // Added full URL and no-store cache
  if (!res.ok) {
    throw new Error('Failed to fetch properties');
  }
  return res.json();
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
