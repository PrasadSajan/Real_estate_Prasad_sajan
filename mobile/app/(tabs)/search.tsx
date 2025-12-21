import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, Platform } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { Link } from 'expo-router';
import { formatPrice } from '../../src/utils/format';
import { Ionicons } from '@expo/vector-icons';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledImage = styled(Image);

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Initial load
    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setSearched(true);

        try {
            let queryBuilder = supabase
                .from('properties')
                .select('*')
                .order('created_at', { ascending: false });

            if (query) {
                queryBuilder = queryBuilder.ilike('title', `%${query}%`);
            }

            if (location) {
                queryBuilder = queryBuilder.ilike('location', `%${location}%`);
            }

            // Note: Add simple price sorting or filtering here if needed in future

            const { data, error } = await queryBuilder.limit(20);

            if (error) throw error;

            if (data) {
                const mapped = data.map(p => ({
                    ...p,
                    imageSrc: p.images && p.images.length > 0 ? p.images[0] : (p.imageSrc || 'https://placehold.co/600x400'),
                    price: p.price.toString()
                }));
                setProperties(mapped);
            }
        } catch (err) {
            console.log("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledSafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header Area */}
            <StyledView className="px-5 pb-4 bg-white shadow-sm z-10">
                <StyledText className="text-3xl font-bold font-serif text-primary mb-4 mt-2">Discover</StyledText>

                <StyledView className="flex-row gap-3">
                    <StyledView className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center">
                        <Ionicons name="search" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
                        <StyledTextInput
                            placeholder="Search properties..."
                            className="flex-1 text-gray-800 font-medium text-base h-full"
                            value={query}
                            onChangeText={setQuery}
                            onSubmitEditing={handleSearch}
                            placeholderTextColor="#9ca3af"
                        />
                    </StyledView>
                    <StyledButton
                        className={`w-12 h-12 rounded-xl items-center justify-center border ${showFilters ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Ionicons name="options-outline" size={24} color={showFilters ? "white" : "#374151"} />
                    </StyledButton>
                </StyledView>

                {/* Expandable Filters */}
                {showFilters && (
                    <StyledView className="mt-4 pt-4 border-t border-gray-100 flex-row gap-3 animate-fade-in-up">
                        <StyledView className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center">
                            <Ionicons name="location-outline" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
                            <StyledTextInput
                                placeholder="Location (e.g. Pune)"
                                className="flex-1 text-gray-800 font-medium text-base h-full"
                                value={location}
                                onChangeText={setLocation}
                                onSubmitEditing={handleSearch}
                            />
                        </StyledView>
                        <StyledButton
                            onPress={handleSearch}
                            className="bg-accent px-6 rounded-xl justify-center items-center shadow-md shadow-accent/20"
                        >
                            <StyledText className="text-white font-bold">Apply</StyledText>
                        </StyledButton>
                    </StyledView>
                )}
            </StyledView>

            {/* Results Content */}
            {loading ? (
                <StyledView className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#d97706" />
                </StyledView>
            ) : (
                <StyledScrollView
                    className="flex-1 px-5 pt-4"
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <StyledView className="flex-row justify-between items-center mb-4">
                        <StyledText className="text-gray-500 font-medium ml-1">
                            {searched ? `${properties.length} Properties Found` : 'Recent Listings'}
                        </StyledText>
                    </StyledView>

                    {properties.map((prop) => (
                        <Link href={`/properties/${prop.id}`} asChild key={prop.id}>
                            <StyledButton
                                activeOpacity={0.9}
                                className="bg-white rounded-3xl mb-6 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
                            >
                                {/* Image Section */}
                                <StyledView className="h-52 relative bg-gray-200">
                                    <StyledImage
                                        source={{ uri: prop.imageSrc }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                    <StyledView className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                    <StyledView className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                        <StyledText className="text-primary font-bold text-xs uppercase tracking-wide">
                                            {prop.type || "For Sale"}
                                        </StyledText>
                                    </StyledView>

                                    <StyledView className="absolute bottom-4 left-4 right-4 flex-row justify-between items-end">
                                        <StyledText className="text-white font-bold text-2xl shadow-sm">
                                            {formatPrice(prop.price)}
                                        </StyledText>
                                    </StyledView>
                                </StyledView>

                                {/* Content Section */}
                                <StyledView className="p-5">
                                    <StyledText className="text-xl font-bold text-primary font-serif mb-2 leading-tight" numberOfLines={1}>
                                        {prop.title}
                                    </StyledText>

                                    <StyledView className="flex-row items-center mb-4">
                                        <Ionicons name="location-sharp" size={16} color="#d97706" style={{ marginRight: 4 }} />
                                        <StyledText className="text-gray-500 text-sm font-medium" numberOfLines={1}>
                                            {prop.location || "Prime Location"}
                                        </StyledText>
                                    </StyledView>

                                    <StyledView className="flex-row justify-between items-center pt-4 border-t border-gray-100">
                                        {/* Features Badges (Hidden until backend supports data) */}
                                        {/* 
                                        <StyledView className="flex-row gap-3">
                                            <StyledView className="flex-row items-center">
                                                <Ionicons name="bed-outline" size={16} color="#6b7280" />
                                                <StyledText className="text-gray-500 text-xs ml-1 font-bold">3 Beds</StyledText>
                                            </StyledView>
                                            <StyledView className="flex-row items-center">
                                                <Ionicons name="water-outline" size={16} color="#6b7280" />
                                                <StyledText className="text-gray-500 text-xs ml-1 font-bold">2 Baths</StyledText>
                                            </StyledView>
                                        </StyledView>
                                        */}

                                        <StyledView className="bg-primary px-4 py-2 rounded-xl w-full items-center">
                                            <StyledText className="text-white text-xs font-bold">View Details</StyledText>
                                        </StyledView>
                                    </StyledView>
                                </StyledView>
                            </StyledButton>
                        </Link>
                    ))}

                    {properties.length === 0 && !loading && (
                        <StyledView className="items-center justify-center py-20 opacity-50">
                            <Ionicons name="search-outline" size={64} color="#d1d5db" />
                            <StyledText className="text-gray-400 text-lg font-medium mt-4">No properties found</StyledText>
                            <StyledText className="text-gray-400 text-sm text-center max-w-xs mt-2">
                                Try adjusting your location or search terms to find what you're looking for.
                            </StyledText>
                        </StyledView>
                    )}
                </StyledScrollView>
            )}
        </StyledSafeAreaView>
    );
}
