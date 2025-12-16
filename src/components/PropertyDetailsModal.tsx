'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '@/utils/format';
import { useLanguage } from '../context/LanguageContext';
import ContactForm from './ContactForm';

interface Property {
    id: string;
    imageSrc: string;
    imageAlt: string;
    title: string;
    title_mr?: string;
    description: string;
    description_mr?: string;
    price: string;
    latitude?: number;
    longitude?: number;
    location?: string;
    type?: string;
    images?: string[];
    views?: number;
}

interface PropertyDetailsModalProps {
    property: Property;
    isOpen: boolean;
    onClose: () => void;
}

export default function PropertyDetailsModal({ property, isOpen, onClose }: PropertyDetailsModalProps) {
    const { t, language } = useLanguage();
    const [activeImage, setActiveImage] = useState(property.images?.[0] || property.imageSrc);
    const [showContactForm, setShowContactForm] = useState(false);
    const [showCopied, setShowCopied] = useState(false);

    const handleShare = async () => {
        const url = `${window.location.origin}/properties/${property.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: property.title,
                    text: `Check out this property: ${property.title}`,
                    url: url
                });
            } catch (err) {
                // Ignore
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy', err);
            }
        }
    };

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const displayTitle = language === 'mr' && property.title_mr ? property.title_mr : property.title;
    const displayDesc = language === 'mr' && property.description_mr ? property.description_mr : property.description;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-scale-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white p-2 rounded-full transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-800">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Share Button (Top Left) */}
                <button
                    onClick={handleShare}
                    className="absolute top-4 left-4 z-10 bg-white/50 hover:bg-white p-2 rounded-full transition-colors group"
                    title="Share Property"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-800">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                    {showCopied && (
                        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-fade-in-up">
                            Link Copied!
                        </span>
                    )}
                </button>

                {/* Image Section (Left/Top) */}
                <div className="w-full md:w-1/2 bg-gray-100 flex flex-col">
                    <div className="relative h-64 md:h-full min-h-[300px]">
                        <img
                            src={activeImage}
                            alt={property.imageAlt}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    {/* Thumbnails if multiple images exist */}
                    {property.images && property.images.length > 1 && (
                        <div className="flex gap-2 p-4 overflow-x-auto">
                            {property.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section (Right/Bottom) */}
                <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-accent font-bold uppercase tracking-wider mb-2">
                            <span className="bg-accent/10 px-2 py-1 rounded">{property.type || 'Property'}</span>
                            <span>•</span>
                            <span>{property.location || 'Pune'}</span>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-primary mb-2">{displayTitle}</h2>
                        <p className="text-3xl font-bold text-accent">{formatPrice(property.price)}</p>
                    </div>

                    {/* Toggleable Content: Description OR Contact Form */}
                    {showContactForm ? (
                        <div className="flex-grow flex flex-col animate-fade-in-up">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Contact Owner</h3>
                                <button
                                    onClick={() => setShowContactForm(false)}
                                    className="text-sm text-gray-500 hover:text-primary underline"
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                <ContactForm
                                    propertyId={property.id}
                                    propertyTitle={displayTitle}
                                    className="!p-0 !shadow-none !border-none"
                                    onSuccess={() => {
                                        // Optional: close modal or switch back after success
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="prose prose-sm text-gray-600 mb-8 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
                                <p className="whitespace-pre-line leading-relaxed">{displayDesc}</p>
                            </div>

                            <div className="mt-auto space-y-4">
                                <button
                                    onClick={() => setShowContactForm(true)}
                                    className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                    Contact Owner
                                </button>
                                <p className="text-center text-xs text-gray-400">
                                    Reference ID: {property.id.slice(0, 8)}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
