import { View, Text, ScrollView, Image, TouchableOpacity, Linking, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { translations } from '../../src/data/translations';
import { formatPrice } from '../../src/utils/format';
import { supabase } from '../../lib/supabase';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledButton = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);

const { width } = Dimensions.get('window');

export default function PropertyDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const t = translations['en'];
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) return;
            try {
                // Fetch property details
                const { data, error } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    const mapped = {
                        ...data,
                        imageSrc: data.images && data.images.length > 0 ? data.images[0] : (data.imageSrc || 'https://placehold.co/600x400'),
                        price: data.price.toString()
                    };
                    setProperty(mapped);
                }

                // Check if saved
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    const { data: savedData } = await supabase
                        .from('saved_properties')
                        .select('id')
                        .eq('user_id', session.user.id)
                        .eq('property_id', id)
                        .single();
                    if (savedData) setIsSaved(true);
                }

            } catch (error) {
                console.log("Error fetching property details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const toggleSave = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/(auth)/login');
            return;
        }

        if (isSaved) {
            await supabase.from('saved_properties').delete().eq('user_id', session.user.id).eq('property_id', id);
            setIsSaved(false);
        } else {
            await supabase.from('saved_properties').insert({ user_id: session.user.id, property_id: id });
            setIsSaved(true);
        }
    };

    const handleCall = () => {
        Linking.openURL('tel:+919876543210'); // Placeholder
    };

    const handleWhatsApp = () => {
        Linking.openURL(`https://wa.me/919876543210?text=I'm interested in ${property?.title}`);
    };

    if (loading) {
        return (
            <StyledView className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#d97706" />
            </StyledView>
        );
    }

    if (!property) {
        return (
            <StyledSafeAreaView className="flex-1 justify-center items-center bg-white px-8">
                <Ionicons name="alert-circle-outline" size={64} color="#9ca3af" />
                <StyledText className="text-xl font-bold text-gray-800 mt-4">Property not found</StyledText>
                <StyledText className="text-gray-500 text-center mt-2 mb-6">The property you are looking for might have been removed or is unavailable.</StyledText>
                <StyledButton onPress={() => router.back()} className="w-full bg-primary py-4 rounded-xl items-center">
                    <StyledText className="text-white font-bold text-lg">Go Back</StyledText>
                </StyledButton>
            </StyledSafeAreaView>
        );
    }

    return (
        <StyledView className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />

            <StyledScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Image Hero */}
                <StyledView className="relative h-[400px]">
                    <StyledImage
                        source={{ uri: property.imageSrc }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <StyledView className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />

                    {/* Header Actions */}
                    <StyledSafeAreaView className="absolute top-0 left-0 right-0 flex-row justify-between px-6 pt-2">
                        <StyledButton onPress={() => router.back()} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border border-white/20">
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </StyledButton>
                        <StyledView className="flex-row gap-3">
                            <StyledButton className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border border-white/20">
                                <Ionicons name="share-social-outline" size={24} color="white" />
                            </StyledButton>
                            <StyledButton onPress={toggleSave} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border border-white/20">
                                <Ionicons name={isSaved ? "heart" : "heart-outline"} size={24} color={isSaved ? "#ef4444" : "white"} />
                            </StyledButton>
                        </StyledView>
                    </StyledSafeAreaView>

                    {/* Basic Info Overlay */}
                    <StyledView className="absolute bottom-6 left-6 right-6">
                        <StyledView className="flex-row items-center mb-2">
                            <StyledView className="bg-accent px-3 py-1 rounded-lg mr-3">
                                <StyledText className="text-white font-bold text-xs uppercase">{property.type || "For Sale"}</StyledText>
                            </StyledView>
                            <StyledView className="flex-row items-center bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm">
                                <Ionicons name="star" size={14} color="#fbbf24" style={{ marginRight: 4 }} />
                                <StyledText className="text-white font-bold text-xs">4.8 (Verified)</StyledText>
                            </StyledView>
                        </StyledView>

                        <StyledText className="text-white text-3xl font-bold font-serif shadow-sm leading-tight mb-1">{property.title}</StyledText>
                        <StyledView className="flex-row items-center">
                            <Ionicons name="location-outline" size={18} color="#d1d5db" style={{ marginRight: 4 }} />
                            <StyledText className="text-gray-200 text-lg font-medium">{property.location || "Excellent Location"}</StyledText>
                        </StyledView>
                    </StyledView>
                </StyledView>

                {/* Content Body */}
                <StyledView className="-mt-8 bg-white rounded-t-[40px] px-6 pt-10 pb-6 flex-1">

                    {/* Price & Owner */}
                    <StyledView className="flex-row justify-between items-center mb-8">
                        <StyledView>
                            <StyledText className="text-gray-500 font-medium text-sm mb-1">Total Price</StyledText>
                            <StyledText className="text-3xl font-bold text-primary">{formatPrice(property.price)}</StyledText>
                        </StyledView>
                        <StyledView className="flex-row items-center">
                            <StyledView className="w-12 h-12 bg-gray-100 rounded-full mr-3 items-center justify-center border border-gray-200">
                                <Ionicons name="person" size={24} color="#9ca3af" />
                            </StyledView>
                            <StyledView>
                                <StyledText className="font-bold text-gray-800">Owner</StyledText>
                                <StyledText className="text-gray-500 text-xs">Verified Seller</StyledText>
                            </StyledView>
                        </StyledView>
                    </StyledView>

                    {/* Key Features (Icons) */}
                    <StyledView className="flex-row justify-between mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <StyledView className="items-center flex-1">
                            <Ionicons name="bed-outline" size={24} color="#d97706" />
                            <StyledText className="text-gray-500 text-xs font-bold mt-2">-- Beds</StyledText>
                        </StyledView>
                        <StyledView className="w-[1px] bg-gray-200 h-8 self-center" />
                        <StyledView className="items-center flex-1">
                            <Ionicons name="water-outline" size={24} color="#d97706" />
                            <StyledText className="text-gray-500 text-xs font-bold mt-2">-- Baths</StyledText>
                        </StyledView>
                        <StyledView className="w-[1px] bg-gray-200 h-8 self-center" />
                        <StyledView className="items-center flex-1">
                            <Ionicons name="resize-outline" size={24} color="#d97706" />
                            <StyledText className="text-gray-500 text-xs font-bold mt-2">-- Sqft</StyledText>
                        </StyledView>
                    </StyledView>

                    <StyledText className="text-xl font-bold text-gray-800 font-serif mb-4">Overview</StyledText>
                    <StyledText className="text-gray-600 text-base leading-7 mb-8">
                        {property.description || "This property features modern amenities and a prime location, perfect for families or investment opportunities. Contact the owner to learn more about this exclusive listing."}
                    </StyledText>

                    {/* Features Chips */}
                    <StyledText className="text-xl font-bold text-gray-800 font-serif mb-4">Amenities</StyledText>
                    <StyledView className="flex-row flex-wrap gap-3 mb-8">
                        {['24/7 Security', 'Power Backup', 'Water Supply', 'Car Parking', 'Elevator', 'Garden'].map((tag, idx) => (
                            <StyledView key={idx} className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl flex-row items-center">
                                <Ionicons name="checkmark-circle" size={16} color="#16a34a" style={{ marginRight: 6 }} />
                                <StyledText className="text-gray-600 text-sm font-medium">{tag}</StyledText>
                            </StyledView>
                        ))}
                    </StyledView>

                    {/* Location Placeholder */}
                    <StyledText className="text-xl font-bold text-gray-800 font-serif mb-4">Location</StyledText>
                    <StyledView className="h-48 bg-gray-100 rounded-2xl items-center justify-center border border-gray-200 mb-6">
                        <Ionicons name="map-outline" size={48} color="#9ca3af" />
                        <StyledText className="text-gray-400 font-bold mt-2">Map View Coming Soon</StyledText>
                    </StyledView>

                </StyledView>
            </StyledScrollView>

            {/* Bottom Action Bar */}
            <StyledView className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-5 pb-8 flex-row gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[30px]">
                <StyledButton onPress={handleCall} className="w-14 h-14 bg-gray-100 rounded-2xl items-center justify-center border border-gray-200">
                    <Ionicons name="call" size={24} color="#374151" />
                </StyledButton>
                <StyledButton onPress={handleWhatsApp} className="flex-1 bg-primary py-4 rounded-2xl items-center justify-center shadow-lg shadow-primary/30 flex-row">
                    <Ionicons name="logo-whatsapp" size={22} color="white" style={{ marginRight: 8 }} />
                    <StyledText className="text-white font-bold text-lg">Contact Owner</StyledText>
                </StyledButton>
            </StyledView>
        </StyledView>
    );
}
