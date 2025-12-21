'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ImageUpload from '@/components/admin/ImageUpload';
import StatsCard from '@/components/admin/StatsCard';
import AdminPropertyCard from '@/components/admin/AdminPropertyCard';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';
import InquiryCard from '@/components/admin/InquiryCard';

const LocationPicker = dynamic(() => import('@/components/admin/LocationPicker'), {
    ssr: false,
    loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg">Loading Map...</div>
});

interface Property {
    id: string;
    title: string;
    title_mr?: string;
    description: string;
    description_mr?: string;
    price: number;
    imagesrc: string;
    imagealt: string;
    images?: string[];
    latitude: number | null;
    longitude: number | null;
    location: string;
    type?: string;
    views?: number;
    bedrooms?: number;
    bathrooms?: number;
    area_sqft?: number;
}

interface Inquiry {
    id: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    message?: string;
    created_at: string;
    property?: {
        title: string;
    } | null;
}

export default function AdminDashboard() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [activeTab, setActiveTab] = useState<'properties' | 'inquiries'>('properties');
    const [propertyTypes, setPropertyTypes] = useState<{ name: string, label: string }[]>([]);
    const [stats, setStats] = useState({ views: 0, inquiries: 0 });
    const [userProfile, setUserProfile] = useState({ name: 'Owner', initial: 'O' });
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Property>>({
        title: '',
        title_mr: '',
        description: '',
        description_mr: '',
        price: undefined,
        location: '',
        imagesrc: '',
        imagealt: '',
        images: [],
        latitude: undefined,
        longitude: undefined,
        type: '',
        bedrooms: 0,
        bathrooms: 0,
        area_sqft: undefined
    });

    useEffect(() => {
        checkUser();
        fetchDashboardData();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/admin/login');
            return;
        }

        // Derive User Profile
        let displayName = session.user.user_metadata?.full_name;

        if (!displayName && session.user.email) {
            // Fallback: extract from email (e.g., prasad.sajan@gmail.com -> Prasad Sajan)
            const emailName = session.user.email.split('@')[0];
            displayName = emailName
                .split(/[._]/) // Split by dot or underscore
                .map(part => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize
                .join(' ');
        }

        if (!displayName) displayName = 'Owner';

        const initial = displayName.charAt(0).toUpperCase();
        setUserProfile({ name: displayName, initial });
    };

    const fetchDashboardData = async () => {
        setLoading(true);

        // 1. Fetch Properties (for list & views)
        const { data: propsData, error: propsError } = await supabase
            .from('properties')
            .select('*')
            .order('id', { ascending: false });

        if (propsData) {
            setProperties(propsData);
            // Calculate total views
            const totalViews = propsData.reduce((acc, curr) => acc + (curr.views || 0), 0);
            setStats(prev => ({ ...prev, views: totalViews }));
        }

        // 2. Fetch Property Types
        const { data: typesData } = await supabase
            .from('property_types')
            .select('*')
            .order('label', { ascending: true });

        if (typesData) {
            setPropertyTypes(typesData);
        }

        // 3. Fetch Inquiries Count
        const { count } = await supabase
            .from('inquiries')
            .select('*', { count: 'exact', head: true });

        if (count !== null) {
            setStats(prev => ({ ...prev, inquiries: count }));
        }

        // 4. Fetch Actual Inquiries (for Inbox)
        const { data: inboxData } = await supabase
            .from('inquiries')
            .select(`
                *,
                property:properties (title)
            `)
            .order('created_at', { ascending: false });

        if (inboxData) {
            // Transform to match interface if needed (Supabase returns array of objects, property is object)
            // The type assertion handles the join shape
            setInquiries(inboxData as any);
        }

        setLoading(false);
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation Checks
        if (!formData.title?.trim()) {
            showNotification('Please enter a property title.', 'error');
            return;
        }
        if (!formData.price) { // Changed validation for number type
            showNotification('Please enter a price.', 'error');
            return;
        }
        if (!formData.location?.trim()) { // Added validation for location
            showNotification('Please enter a property location (area).', 'error');
            return;
        }
        if (!formData.type) {
            showNotification('Please select a property type.', 'error');
            return;
        }
        if (!formData.images || formData.images.length === 0) {
            showNotification('Please upload at least one image of the property.', 'error');
            return;
        }
        if (formData.latitude === undefined || formData.longitude === undefined) { // Changed validation for number | null type
            showNotification('Please select the property location on the map.', 'error');
            return;
        }

        const propertyData = {
            ...formData,
            price: formData.price, // Already a number
            latitude: formData.latitude,
            longitude: formData.longitude,
            location: formData.location, // Added to payload
            views: 0 // Init views to 0
        };

        const { error } = await supabase
            .from('properties')
            .insert([propertyData]);

        if (!error) {
            showNotification('Property added successfully!', 'success');
            // Reset form
            setFormData({
                title: '',
                title_mr: '',
                description: '',
                description_mr: '',
                price: undefined, // Reset to undefined for number type
                location: '', // Reset location
                imagesrc: '',
                imagealt: '',
                images: [],
                latitude: undefined,
                longitude: undefined,
                type: ''
            });
            fetchDashboardData();
        } else {
            showNotification('Error adding property: ' + error.message, 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this property?')) {
            const { error } = await supabase
                .from('properties')
                .delete()
                .eq('id', id);

            if (!error) {
                showNotification('Property deleted successfully', 'success');
                fetchDashboardData();
            } else {
                showNotification('Error deleting property: ' + error.message, 'error');
            }
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    const handleDeleteInquiry = async (id: string) => {
        if (confirm('Are you sure you want to delete this message?')) {
            const { error } = await supabase
                .from('inquiries')
                .delete()
                .eq('id', id);

            if (!error) {
                showNotification('Message deleted', 'success');
                // Optimistic update
                setInquiries(prev => prev.filter(i => i.id !== id));
                setStats(prev => ({ ...prev, inquiries: prev.inquiries - 1 }));
            } else {
                showNotification('Error deleting message', 'error');
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {notification && (
                <Toast
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            {/* Top Navigation */}
            <nav className="bg-white px-6 py-4 shadow-sm sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-serif font-bold">
                            {userProfile.initial}
                        </div>
                        <h1 className="text-xl font-bold font-serif text-gray-800">{userProfile.name}</h1>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="text-gray-500 hover:text-red-500 font-medium text-sm transition-colors flex items-center gap-2"
                    >
                        <span>Sign Out</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                    </button>
                </div>
            </nav>

            <main className="container mx-auto p-6 space-y-8">

                {/* Stats Overview */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Listings"
                        value={properties.length}
                        color="bg-blue-500"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>}
                    />
                    <StatsCard
                        title="Active Properties"
                        value={properties.length}
                        color="bg-green-500"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <StatsCard
                        title="Total Views"
                        value={stats.views} // Dynamic Views
                        color="bg-purple-500"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    />
                    <StatsCard
                        title="Inquiries"
                        value={stats.inquiries} // Dynamic Inquiries
                        color="bg-orange-500"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
                    />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Add Property Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <span className="w-1 h-6 bg-accent rounded-full"></span>
                                New Listing
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Details</label>
                                        <input
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            placeholder="Title (English)"
                                            value={formData.title || ''}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                        <input
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            placeholder="Title (Marathi)"
                                            value={formData.title_mr || ''}
                                            onChange={e => setFormData({ ...formData, title_mr: e.target.value })}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-gray-700"
                                                placeholder="Price (₹)"
                                                type="number"
                                                value={formData.price ?? ''}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    setFormData({ ...formData, price: val === '' ? undefined : parseFloat(val) });
                                                }}
                                            />
                                            <select
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                value={formData.type || ''}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option value="" disabled>Select Type</option>
                                                {propertyTypes.map(type => (
                                                    <option key={type.name} value={type.name}>{type.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Row 2: Area & Location */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                placeholder="Area Sqft (e.g. 1200)"
                                                type="number"
                                                value={formData.area_sqft ?? ''}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    setFormData({ ...formData, area_sqft: val === '' ? undefined : parseFloat(val) });
                                                }}
                                            />
                                            <input
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                placeholder="Location Name (e.g. Baner)"
                                                value={formData.location || ''}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>

                                        {/* Row 3: Bed/Bath (Conditional) */}
                                        {/* Row 3: Bed/Bath (Conditional) */}
                                        {['apartment', 'flat', 'house', 'villa', 'penthouse', 'home', 'bungalow'].some(t => formData.type?.toLowerCase().includes(t)) && (
                                            <div className="grid grid-cols-2 gap-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Bedrooms</label>
                                                    <div className="flex items-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, bedrooms: Math.max(0, (prev.bedrooms || 0) - 1) }))}
                                                            className="w-8 h-8 bg-white rounded-l border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                                        >-</button>
                                                        <input
                                                            className="w-full h-8 text-center border-t border-b border-gray-200 font-bold text-gray-700 outline-none"
                                                            value={formData.bedrooms || 0}
                                                            readOnly
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, bedrooms: (prev.bedrooms || 0) + 1 }))}
                                                            className="w-8 h-8 bg-white rounded-r border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                                        >+</button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Bathrooms</label>
                                                    <div className="flex items-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, bathrooms: Math.max(0, (prev.bathrooms || 0) - 1) }))}
                                                            className="w-8 h-8 bg-white rounded-l border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                                        >-</button>
                                                        <input
                                                            className="w-full h-8 text-center border-t border-b border-gray-200 font-bold text-gray-700 outline-none"
                                                            value={formData.bathrooms || 0}
                                                            readOnly
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, bathrooms: (prev.bathrooms || 0) + 1 }))}
                                                            className="w-8 h-8 bg-white rounded-r border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                                        >+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                                        <div className="relative">
                                            <textarea
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[100px]"
                                                placeholder="Description (English)"
                                                value={formData.description || ''}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                maxLength={1000}
                                            />
                                            <p className="text-xs text-gray-400 text-right mt-1">{formData.description?.length || 0}/1000</p>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[100px]"
                                                placeholder="Description (Marathi)"
                                                value={formData.description_mr || ''}
                                                onChange={e => setFormData({ ...formData, description_mr: e.target.value })}
                                                maxLength={1000}
                                            />
                                            <p className="text-xs text-gray-400 text-right mt-1">{formData.description_mr?.length || 0}/1000</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Media</label>
                                    <ImageUpload
                                        onUpload={(urls) => setFormData(prev => ({
                                            ...prev,
                                            images: urls,
                                            imagesrc: urls.length > 0 ? urls[0] : prev.imagesrc
                                        }))}
                                        currentImages={formData.images}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</label>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <LocationPicker
                                            latitude={formData.latitude ?? undefined} // Convert null to undefined
                                            longitude={formData.longitude ?? undefined} // Convert null to undefined
                                            onLocationSelect={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-accent/20">
                                    Publish Property
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Property List Grid OR Inbox */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-end">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                {activeTab === 'properties' ? 'Your Inventory' : 'Inbox Messages'}
                            </h2>

                            {/* Tabs */}
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('properties')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'properties' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Properties
                                </button>
                                <button
                                    onClick={() => setActiveTab('inquiries')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'inquiries' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Inbox
                                    {inquiries.length > 0 && <span className="ml-2 bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">{inquiries.length}</span>}
                                </button>
                            </div>
                        </div>

                        {activeTab === 'properties' ? (
                            properties.length === 0 ? (
                                <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
                                    <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No properties yet</h3>
                                    <p className="text-gray-500 mt-1">Get started by adding your first property listing on the left.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {properties.map(p => (
                                        <AdminPropertyCard
                                            key={p.id}
                                            title={p.title}
                                            price={p.price}
                                            imageSrc={p.images && p.images.length > 0 ? p.images[0] : p.imagesrc}
                                            latitude={p.latitude ?? undefined} // Convert null to undefined
                                            longitude={p.longitude ?? undefined} // Convert null to undefined
                                            onDelete={() => handleDelete(p.id)}
                                        />
                                    ))}
                                </div>
                            )
                        ) : (
                            /* Inbox Tab Content */
                            inquiries.length === 0 ? (
                                <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
                                    <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
                                    <p className="text-gray-500 mt-1">Inquiries from customers will appear here.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {inquiries.map(inquiry => (
                                        <InquiryCard
                                            key={inquiry.id}
                                            inquiry={inquiry}
                                            onDelete={handleDeleteInquiry}
                                        />
                                    ))}
                                </div>
                            )
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
