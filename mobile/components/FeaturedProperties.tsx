import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Link } from 'expo-router';
import { translations } from '../src/data/translations';
import { formatPrice } from '../src/utils/format';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledButton = styled(TouchableOpacity);

interface Property {
    id: string;
    title: string;
    price: string;
    location?: string;
    type?: string;
    imageSrc: string;
    [key: string]: any;
}

export default function FeaturedProperties() {
    const t = translations['en'];
    const [properties, setProperties] = useState<Property[]>([]);
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get User
                const { data: { session } } = await supabase.auth.getSession();
                setUserId(session?.user?.id || null);

                // 2. Get Properties
                const { data: propsData, error: propsError } = await supabase
                    .from('properties')
                    .select('*')
                    .limit(6)
                    .order('created_at', { ascending: false });

                if (propsError) throw propsError;

                if (propsData) {
                    const mapped = propsData.map(p => ({
                        ...p,
                        imageSrc: p.images && p.images.length > 0 ? p.images[0] : (p.imageSrc || 'https://placehold.co/600x400'),
                        price: p.price.toString()
                    }));
                    setProperties(mapped);
                }

                // 3. Get Saved Properties (if logged in)
                if (session?.user?.id) {
                    const { data: savedData } = await supabase
                        .from('saved_properties')
                        .select('property_id');

                    if (savedData) {
                        setSavedIds(savedData.map(s => s.property_id));
                    }
                }

            } catch (error) {
                console.log('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUserId(session?.user?.id || null);
            if (event === 'SIGNED_OUT') setSavedIds([]);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const toggleFavorite = async (propertyId: string) => {
        if (!userId) {
            // Optional: Navigate to login logic here? 
            // For now just alert or ignore
            alert("Please log in to save properties!");
            return;
        }

        const isSaved = savedIds.includes(propertyId);

        // Optimistic Update
        let newSavedIds = isSaved
            ? savedIds.filter(id => id !== propertyId)
            : [...savedIds, propertyId];
        setSavedIds(newSavedIds);

        try {
            if (isSaved) {
                const { error } = await supabase
                    .from('saved_properties')
                    .delete()
                    .eq('user_id', userId)
                    .eq('property_id', propertyId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('saved_properties')
                    .insert({ user_id: userId, property_id: propertyId });
                if (error) throw error;
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            // Revert on error
            setSavedIds(savedIds);
        }
    };

    if (loading) {
        return (
            <StyledView className="py-8 px-6">
                <StyledText>Loading properties...</StyledText>
            </StyledView>
        );
    }

    return (
        <StyledView className="py-8 px-6">
            <StyledView className="flex-row justify-between items-end mb-6">
                <StyledView>
                    <StyledText className="text-2xl font-bold text-primary font-serif">
                        {t.featuredProperties}
                    </StyledText>
                    <StyledView className="h-1 w-16 bg-accent mt-2 rounded-full" />
                </StyledView>
                <StyledButton>
                    <StyledText className="text-primary font-bold">View All</StyledText>
                </StyledButton>
            </StyledView>

            <StyledView className="gap-6">
                {properties.map((prop) => (
                    <StyledView key={prop.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
                        <Link href={`/properties/${prop.id}`} asChild>
                            <TouchableOpacity activeOpacity={0.9}>
                                <StyledView className="relative">
                                    <StyledImage
                                        source={{ uri: prop.imageSrc }}
                                        className="w-full h-56"
                                        resizeMode="cover"
                                    />
                                    {/* Badge Top Left */}
                                    <StyledView className="absolute top-4 left-4 bg-primary/90 px-3 py-1 rounded-full shadow-sm">
                                        <StyledText className="text-white font-bold text-xs">{prop.type || "For Sale"}</StyledText>
                                    </StyledView>
                                </StyledView>

                                <StyledView className="p-5">
                                    <StyledText className="text-xl font-bold text-gray-900 mb-2 font-serif" numberOfLines={1}>{prop.title}</StyledText>
                                    <StyledView className="flex-row items-center mb-3">
                                        <StyledText className="text-gray-500 text-sm">📍 {prop.location || "Prime Location"}</StyledText>
                                    </StyledView>

                                    <StyledView className="flex-row justify-between items-center border-t border-gray-100 pt-4 mt-2">
                                        <StyledText className="text-xl font-bold text-accent">{formatPrice(prop.price)}</StyledText>
                                        <StyledText className="text-primary text-sm font-semibold uppercase tracking-wide">Details →</StyledText>
                                    </StyledView>
                                </StyledView>
                            </TouchableOpacity>
                        </Link>

                        {/* Heart Button Top Right (Outside Link to prevent navigation) */}
                        <StyledButton
                            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full items-center justify-center shadow-md z-10"
                            onPress={(e) => {
                                e.stopPropagation(); // prevent link press
                                toggleFavorite(prop.id);
                            }}
                        >
                            <Ionicons
                                name={savedIds.includes(prop.id) ? "heart" : "heart-outline"}
                                size={22}
                                color={savedIds.includes(prop.id) ? "red" : "gray"}
                            />
                        </StyledButton>
                    </StyledView>
                ))}
            </StyledView>
        </StyledView>
    );
}
