import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

export default function MyListings() {
    const [session, setSession] = useState<Session | null>(null);
    const [myProperties, setMyProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('owner_id', session.user.id)
                .order('created_at', { ascending: false });

            if (data) setMyProperties(data);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            "Delete Listing",
            "Are you sure you want to delete this property? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const { error } = await supabase.from('properties').delete().eq('id', id);
                        if (!error) {
                            setMyProperties(prev => prev.filter(p => p.id !== id));
                            Alert.alert("Deleted", "Property removed successfully.");
                        } else {
                            Alert.alert("Error", error.message);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <StyledSafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#d97706" />
            </StyledSafeAreaView>
        );
    }

    return (
        <StyledSafeAreaView className="flex-1 bg-white" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <StyledView className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
                <StyledButton onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </StyledButton>
                <StyledText className="text-xl font-bold font-serif text-primary">My Listings</StyledText>
                <StyledButton
                    onPress={() => router.push('/owner/add-property')}
                    className="bg-primary px-3 py-2 rounded-lg flex-row items-center"
                >
                    <Ionicons name="add" size={18} color="white" />
                    <StyledText className="text-white font-bold text-xs ml-1">Add New</StyledText>
                </StyledButton>
            </StyledView>

            <StyledScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                {myProperties.length === 0 ? (
                    <StyledView className="flex-1 items-center justify-center py-20 opacity-80">
                        <StyledView className="w-20 h-20 bg-gray-50 rounded-full mb-6 items-center justify-center border-2 border-dashed border-gray-300">
                            <Ionicons name="home-outline" size={40} color="#9ca3af" />
                        </StyledView>
                        <StyledText className="text-xl font-bold text-gray-400 mb-2">No listings yet</StyledText>
                        <StyledText className="text-gray-400 text-center text-sm px-8">
                            You haven't listed any properties. Tap "Add New" to get started.
                        </StyledText>
                    </StyledView>
                ) : (
                    myProperties.map((prop) => (
                        <StyledView key={prop.id} className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100 overflow-hidden flex-row h-32">
                            <StyledImage
                                source={{ uri: prop.images && prop.images[0] ? prop.images[0] : (prop.imageSrc || 'https://placehold.co/600x400') }}
                                className="w-32 h-full"
                                resizeMode="cover"
                            />
                            <StyledView className="flex-1 p-3 justify-between">
                                <StyledView>
                                    <StyledText className="font-bold text-primary text-base mb-1" numberOfLines={1}>{prop.title}</StyledText>
                                    <StyledText className="text-gray-500 text-xs mb-1">Status: Active</StyledText>
                                    <StyledText className="text-accent font-bold text-sm">₹ {prop.price}</StyledText>
                                </StyledView>

                                <StyledView className="flex-row justify-end space-x-3">
                                    <StyledButton
                                        className="p-2 bg-gray-50 rounded-full"
                                        onPress={() => alert('Edit feature coming next!')}
                                    >
                                        <Ionicons name="create-outline" size={18} color="#374151" />
                                    </StyledButton>
                                    <StyledButton
                                        className="p-2 bg-red-50 rounded-full"
                                        onPress={() => handleDelete(prop.id)}
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                    </StyledButton>
                                </StyledView>
                            </StyledView>
                        </StyledView>
                    ))
                )}
            </StyledScrollView>
        </StyledSafeAreaView>
    );
}
