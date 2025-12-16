'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/components/admin/LocationPicker'), {
    ssr: false,
    loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded">Loading Map...</div>
});

import ImageUpload from '@/components/admin/ImageUpload';



interface Property {
    id: string;
    title: string;
    title_mr?: string;
    description: string;
    description_mr?: string;
    price: string;
    imagesrc: string;
    imagealt: string;
    images?: string[];
    latitude?: number;
    longitude?: number;
}

export default function AdminDashboard() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState<Partial<Property>>({
        title: '',
        title_mr: '',
        description: '',
        description_mr: '',
        price: '',
        imagesrc: 'https://placehold.co/600x400',
        imagealt: 'Property Image',
        images: []
        // lat/lng are undefined by default
    });

    useEffect(() => {
        checkUser();
        fetchProperties();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/admin/login');
        }
    };

    const fetchProperties = async () => {
        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .order('id', { ascending: false });

        if (data) setProperties(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from('properties')
            .insert([formData]);

        if (!error) {
            alert('Property added successfully!');
            // Reset form
            setFormData({
                title: '',
                title_mr: '',
                description: '',
                description_mr: '',
                price: '',
                imagesrc: 'https://placehold.co/600x400',
                imagealt: 'Property Image',
                images: [],
                latitude: undefined,
                longitude: undefined
            });
            fetchProperties();
        } else {
            alert('Error adding property: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this property?')) {
            const { error } = await supabase
                .from('properties')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchProperties();
            }
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
            <nav className="bg-primary text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold font-serif">Owner Dashboard</h1>
                <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm">Sign Out</button>
            </nav>

            <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Add Property Form */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg h-fit">
                    <h2 className="text-xl font-bold mb-4 text-primary">Add New Listing</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Title (English)"
                            value={formData.title || ''}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Title (Marathi)"
                            value={formData.title_mr || ''}
                            onChange={e => setFormData({ ...formData, title_mr: e.target.value })}
                        />
                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Description (English)"
                            value={formData.description || ''}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Description (Marathi)"
                            value={formData.description_mr || ''}
                            onChange={e => setFormData({ ...formData, description_mr: e.target.value })}
                        />
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Price (e.g. ₹ 45 Lakh)"
                            value={formData.price || ''}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            required
                        />

                        <ImageUpload
                            onUpload={(urls) => setFormData(prev => ({
                                ...prev,
                                images: urls,
                                imagesrc: urls.length > 0 ? urls[0] : prev.imagesrc // Keep sync
                            }))}
                            currentImages={formData.images}
                        />

                        {/* Map Picker */}
                        <div className="border-t pt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Location (Click on map)</label>
                            <LocationPicker
                                latitude={formData.latitude}
                                longitude={formData.longitude}
                                onLocationSelect={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
                            />
                        </div>

                        <button type="submit" className="w-full bg-accent text-white font-bold py-2 rounded hover:bg-accent-hover transition">
                            Add Property
                        </button>
                    </form>
                </div>

                {/* Property List */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold mb-4 text-primary">Current Listings</h2>
                    {properties.length === 0 ? (
                        <p className="text-gray-500">No properties found.</p>
                    ) : (
                        properties.map(p => (
                            <div key={p.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{p.title}</h3>
                                    <p className="text-sm text-gray-600">{p.price}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {p.latitude && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Mapped</span>}
                                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 font-medium text-sm border border-red-200 px-3 py-1 rounded">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
