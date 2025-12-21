import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { formatPrice } from '../../src/utils/format';
import { Ionicons } from '@expo/vector-icons';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

export default function SavedScreen() {
    const [session, setSession] = useState<Session | null>(null);
    const [savedProperties, setSavedProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
            // Join query: Get saved_properties and the related property details
            const { data, error } = await supabase
                .from('saved_properties')
                .select(`
                    id,
                    property:properties (*)
                `)
                .eq('user_id', session.user.id);

            if (error) {
                console.error(error);
            } else if (data) {
                // Flatten the structure
                const mapped = data.map((item: any) => ({
                    ...item.property,
                    saved_id: item.id, // ID from saved_properties table
                    imageSrc: item.property.images && item.property.images.length > 0 ? item.property.images[0] : (item.property.imageSrc || 'https://placehold.co/600x400'),
                    price: item.property.price.toString()
                }));
                setSavedProperties(mapped);
            }
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <StyledSafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#d97706" />
            </StyledSafeAreaView>
        );
    }

    if (!session) {
        return (
            <StyledSafeAreaView className="flex-1 bg-white items-center justify-center p-8">
                <StyledView className="w-24 h-24 bg-red-50 rounded-full mb-6 items-center justify-center animate-bounce-slow">
                    <Ionicons name="heart" size={48} color="#ef4444" />
                </StyledView>
                <StyledText className="text-2xl font-bold font-serif text-primary mb-3 text-center">Saved Properties</StyledText>
                <StyledText className="text-gray-500 text-center text-lg mb-8 leading-relaxed">
                    Log in to view your favorite properties and keep track of your dream homes.
                </StyledText>
                <StyledButton
                    className="bg-primary w-full py-4 rounded-xl shadow-lg shadow-primary/30"
                    onPress={() => router.push('/(auth)/login')}
                >
                    <StyledText className="text-white font-bold text-center text-lg">Log In</StyledText>
                </StyledButton>
            </StyledSafeAreaView>
        );
    }

    return (
        <StyledSafeAreaView className="flex-1 bg-white" edges={['top']}>
            <StyledView className="px-6 py-4 bg-white shadow-sm z-10 flex-row justify-between items-center">
                <StyledText className="text-3xl font-bold text-primary font-serif">Saved Homes</StyledText>
                <StyledView className="bg-red-50 px-3 py-1 rounded-full">
                    <StyledText className="text-red-500 font-bold">{savedProperties.length} Saved</StyledText>
                </StyledView>
            </StyledView>

            {savedProperties.length === 0 ? (
                <StyledView className="flex-1 items-center justify-center p-8 opacity-80">
                    <StyledView className="w-24 h-24 bg-gray-50 rounded-full mb-6 items-center justify-center">
                        <Ionicons name="heart-dislike-outline" size={48} color="#9ca3af" />
                    </StyledView>
                    <StyledText className="text-xl font-bold text-gray-400 mb-2">No saved properties yet</StyledText>
                    <StyledText className="text-gray-400 text-center text-base">
                        Start exploring and tap the heart icon to save properties you like.
                    </StyledText>
                    <StyledButton
                        className="mt-8 border border-primary px-8 py-3 rounded-xl hover:bg-gray-50"
                        onPress={() => router.push('/')}
                    >
                        <StyledText className="text-primary font-bold text-lg">Explore Properties</StyledText>
                    </StyledButton>
                </StyledView>
            ) : (
                <StyledScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {savedProperties.map((prop) => (
                        <Link href={`/properties/${prop.id}`} asChild key={prop.id}>
                            <StyledButton activeOpacity={0.9} className="bg-white rounded-3xl mb-6 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                                {/* Image Section */}
                                <StyledView className="h-48 relative bg-gray-200">
                                    <StyledImage
                                        source={{ uri: prop.imageSrc }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                    <StyledView className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                                    <StyledButton className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30">
                                        <Ionicons name="heart" size={20} color="#ef4444" />
                                    </StyledButton>

                                    <StyledView className="absolute bottom-4 left-4 right-4">
                                        <StyledText className="text-white font-bold text-xl shadow-sm">
                                            {formatPrice(prop.price)}
                                        </StyledText>
                                    </StyledView>
                                </StyledView>

                                {/* Content Section */}
                                <StyledView className="p-5">
                                    <StyledText className="text-xl font-bold text-primary font-serif mb-1 leading-tight" numberOfLines={1}>
                                        {prop.title}
                                    </StyledText>
                                    <StyledText className="text-gray-500 text-sm font-medium mb-3" numberOfLines={1}>
                                        <Ionicons name="location-sharp" size={14} color="#d97706" /> {prop.location || 'Unknown Location'}
                                    </StyledText>

                                    <StyledButton className="bg-gray-50 py-3 rounded-xl items-center border border-gray-100">
                                        <StyledText className="text-primary font-bold text-sm">View Property</StyledText>
                                    </StyledButton>
                                </StyledView>
                            </StyledButton>
                        </Link>
                    ))}
                </StyledScrollView>
            )}
        </StyledSafeAreaView>
    );
}
