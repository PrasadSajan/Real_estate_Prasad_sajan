import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ContactForm from '@/components/ContactForm';
import { formatPrice } from '@/utils/format';

// Force dynamic rendering to handle searchParams/params changes
export const dynamic = 'force-dynamic';

async function getProperty(id: string) {
    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return null;
    }
    return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const property = await getProperty(id);

    if (!property) return { title: 'Property Not Found' };

    return {
        title: `${property.title} | Real Estate`,
        description: property.description.substring(0, 160),
    };
}

export default async function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const property = await getProperty(id);
    const activeImage = property?.images?.[0] || property?.imagesrc || 'https://placehold.co/600x400';

    if (!property) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Header />
            <Navigation />

            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb / Back Link */}
                    <div className="mb-6">
                        <a href="/" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Back to Listings
                        </a>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Column: Images */}
                            <div className="bg-gray-100 relative min-h-[400px] lg:min-h-[600px]">
                                <img
                                    src={activeImage}
                                    alt={property.imagealt || property.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm uppercase tracking-wider">
                                        {property.type || 'Property'}
                                    </span>
                                </div>

                                {/* Image Navigation (Placeholder for now) */}
                                {property.images && property.images.length > 1 && (
                                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {property.images.map((img: string, idx: number) => (
                                            <div key={idx} className={`w-16 h-16 rounded-lg border-2 ${img === activeImage ? 'border-accent' : 'border-white'} overflow-hidden flex-shrink-0 shadow-md`}>
                                                <img src={img} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Details & Contact */}
                            <div className="p-8 md:p-12 flex flex-col">
                                <div className="mb-8 border-b border-gray-100 pb-8">
                                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                                        {property.title}
                                    </h1>
                                    <div className="flex items-center text-gray-500 mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-accent">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        <span className="text-lg">{property.location || 'Pune, India'}</span>
                                    </div>

                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-accent">
                                            {formatPrice(property.price)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-8 flex-grow">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif">About this property</h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                        {property.description}
                                    </p>
                                </div>

                                {/* Contact Form Block */}
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Interested? Contact Owner</h3>
                                    <ContactForm
                                        propertyId={property.id}
                                        propertyTitle={property.title}
                                        className="!shadow-none !border-none !p-0 !bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
