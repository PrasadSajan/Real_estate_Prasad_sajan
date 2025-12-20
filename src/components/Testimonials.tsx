'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Testimonials() {
    const { t } = useLanguage();
    const reviews = [
        {
            name: "Rajesh Patil",
            location: "Pune",
            text: "The process was incredibly smooth. They helped me find a perfect plot in Hinjewadi within my budget.",
            rating: 5
        },
        {
            name: "Sneha Deshmukh",
            location: "Mumbai",
            text: "Professional service and transparent dealing. The best real estate agency I have dealt with.",
            rating: 5
        },
        {
            name: "Amit Kumar",
            location: "Bangalore",
            text: "Bought a row house through them. The legal verification support was excellent.",
            rating: 4
        }
    ];

    return (
        <section className="py-24 bg-primary text-white overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold font-serif text-center mb-16">{t.testimonialsTitle}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex gap-1 mb-4 text-accent">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-lg italic text-gray-300 mb-6">"{review.text}"</p>
                            <div>
                                <h4 className="font-bold text-white text-lg">{review.name}</h4>
                                <p className="text-sm text-gray-400">{review.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
