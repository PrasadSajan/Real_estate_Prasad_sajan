'use client';

import { useLanguage } from '../context/LanguageContext';
import PropertyCard from './PropertyCard';

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

export default function FeaturedProperties({ properties }: { properties: Property[] }) {
    const { t } = useLanguage();

    return (
        <section id="properties" className="container mx-auto py-12 px-4">
            <h2 className="text-4xl font-bold text-center mb-8">{t.featuredProperties}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property: Property) => (
                    <PropertyCard
                        key={property.id}
                        imageSrc={property.imageSrc}
                        imageAlt={property.imageAlt}
                        title={property.title}
                        title_mr={property.title_mr}
                        description={property.description}
                        description_mr={property.description_mr}
                        price={property.price}
                    />
                ))}
            </div>
        </section>
    );
}
