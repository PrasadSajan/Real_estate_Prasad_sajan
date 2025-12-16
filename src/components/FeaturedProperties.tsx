'use client';

import { useState } from 'react';
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

export default function FeaturedProperties({ properties }: { properties: Property[] }) {
    const { t } = useLanguage();
    const [mapProperty, setMapProperty] = useState<Property | null>(null);
    const [detailsProperty, setDetailsProperty] = useState<Property | null>(null);

    return (
        <section id="properties" className="container mx-auto py-20 px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary relative inline-block">
                    {t.featuredProperties}
                    <span className="block h-1 w-24 bg-accent mx-auto mt-4 rounded-full"></span>
                </h2>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Discover our hand-picked selection of premium properties available for you today.</p>
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
