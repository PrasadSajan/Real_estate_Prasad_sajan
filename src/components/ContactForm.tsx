'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

import Toast from './ui/Toast';

interface ContactFormProps {
    propertyId?: string | null;
    propertyTitle?: string;
    className?: string;
    onSuccess?: () => void;
}

export default function ContactForm({ propertyId, propertyTitle, className = '', onSuccess }: ContactFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');
        setNotification(null);

        // Basic validation
        if (!formData.name || !formData.phone || (!formData.email && !formData.phone)) {
            setStatus('error');
            showNotification('Please provide your Name and at least one contact method (Phone or Email).', 'error');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase
                .from('inquiries')
                .insert([{
                    property_id: propertyId || null,
                    customer_name: formData.name,
                    customer_email: formData.email,
                    customer_phone: formData.phone,
                    message: formData.message,
                    // created_at is default now()
                }]);

            if (error) throw error;

            setStatus('success');
            showNotification('Inquiry sent successfully! We will contact you soon.', 'success');

            // Clear form but keep success state for a bit
            setFormData({ name: '', email: '', phone: '', message: '' });

            if (onSuccess) {
                setTimeout(onSuccess, 3000); // Close or reset after 3s
            }

        } catch (err: any) {
            console.error('Inquiry Error:', err);
            setStatus('error');
            showNotification(err.message || 'Failed to send inquiry. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {notification && (
                <Toast
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
                {status === 'success' ? (
                    <div className="text-center py-8 animate-fade-in-up">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Inquiry Sent!</h3>
                        <p className="text-gray-500">Thank you. The owner will contact you shortly.</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-4 text-primary font-semibold hover:underline text-sm"
                        >
                            Send another inquiry
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {propertyTitle && (
                            <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                <p className="text-sm text-primary font-semibold">Inquiry for: <span className="text-accent">{propertyTitle}</span></p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="+91 99999 99999"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                id="message"
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                placeholder="I am interested in this property..."
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-lg shadow-lg shadow-accent/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Send Inquiry'
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-2">
                            Your information is safe and will only be shared with the owner.
                        </p>
                    </form>
                )}
            </div>
        </>
    );
}
