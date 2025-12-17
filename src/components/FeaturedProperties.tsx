'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import PropertyCard from './PropertyCard';
import PropertyDetailsModal from './PropertyDetailsModal';
import dynamic from 'next/dynamic';

const PropertyMapModal = dynamic(() => import('./PropertyMapModal'), { ssr: false });

interface Property {
    id: string;
    imageSrc: string;
    imageAlt: string;
    images?: string[];
    title: string;
    title_mr?: string;
    description: string;
    description_mr?: string;
    price: string;
    latitude?: number;
    longitude?: number;
    location?: string;
    type?: string;
}

import { useRouter, useSearchParams } from 'next/navigation';

export default function FeaturedProperties({ properties }: { properties: Property[] }) {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mapProperty, setMapProperty] = useState<Property | null>(null);
    const [detailsProperty, setDetailsProperty] = useState<Property | null>(null);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const currentSort = searchParams.get('sort') || 'newest';

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' }
    ];

    const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Newest First';

    const handleSortSelect = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'newest') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }
        router.push(`/?${params.toString()}`, { scroll: false });
        setIsSortOpen(false);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.sort-dropdown-container')) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <section id="properties" className="container mx-auto py-20 px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary relative inline-block">
                        {t.featuredProperties}
                        <span className="block h-1 w-24 bg-accent mt-4 rounded-full"></span>
                    </h2>
                    <p className="text-gray-600 mt-4 max-w-2xl">Discover our hand-picked selection of premium properties available for you today.</p>
                </div>

                {/* Custom Sort Dropdown */}
                <div className="w-full md:w-auto relative sort-dropdown-container z-20">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="w-full md:w-64 flex items-center justify-between px-6 py-3 bg-white border border-gray-100 rounded-full shadow-md text-gray-700 font-medium hover:shadow-lg hover:border-accent/30 transition-all active:scale-95"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                </svg>
                            </span>
                            <span>{currentLabel}</span>
                        </div>
                        <span className={`text-accent transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </span>
                    </button>

                    {/* Dropdown Menu */}
                    {isSortOpen && (
                        <div className="absolute right-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up origin-top-right">
                            <ul className="py-2">
                                {sortOptions.map((option) => (
                                    <li key={option.value}>
                                        <button
                                            onClick={() => handleSortSelect(option.value)}
                                            className={`w-full text-left px-6 py-3 text-sm transition-colors hover:bg-gray-50 flex items-center justify-between ${currentSort === option.value ? 'text-accent font-bold bg-accent/5' : 'text-gray-600'}`}
                                        >
                                            {option.label}
                                            {currentSort === option.value && (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {properties.map((property: Property) => (
                    <PropertyCard
                        key={property.id}
                        id={property.id}
                        imageSrc={property.images && property.images.length > 0 ? property.images[0] : property.imageSrc}
                        imageAlt={property.imageAlt}
                        title={property.title}
                        title_mr={property.title_mr}
                        description={property.description}
                        description_mr={property.description_mr}
                        price={property.price}
                        latitude={property.latitude}
                        longitude={property.longitude}
                        onViewMap={() => setMapProperty(property)}
                        onClick={() => setDetailsProperty(property)}
                    />
                ))}
            </div>

            {/* Map Modal */}
            {mapProperty && mapProperty.latitude && mapProperty.longitude && (
                <PropertyMapModal
                    isOpen={!!mapProperty}
                    onClose={() => setMapProperty(null)}
                    latitude={mapProperty.latitude}
                    longitude={mapProperty.longitude}
                    title={mapProperty.title}
                />
            )}

            {/* Details Modal */}
            {detailsProperty && (
                <PropertyDetailsModal
                    isOpen={!!detailsProperty}
                    onClose={() => setDetailsProperty(null)}
                    property={detailsProperty}
                />
            )}
        </section>
    );
}
