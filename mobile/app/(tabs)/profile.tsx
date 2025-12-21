import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Ionicons } from '@expo/vector-icons';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

export default function ProfileScreen() {
    const [session, setSession] = useState<Session | null>(null);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    async function handleSignOut() {
        const { error } = await supabase.auth.signOut();
        if (error) Alert.alert('Error', error.message);
    }

    const MenuOption = ({ icon, title, subtitle, onPress, color = "#374151" }: any) => (
        <StyledButton
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
        >
            <StyledView className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${color === '#ef4444' ? 'bg-red-50' : 'bg-gray-50'}`}>
                <Ionicons name={icon} size={24} color={color} />
            </StyledView>
            <StyledView className="flex-1">
                <StyledText className={`font-bold text-lg mb-0.5 ${color === '#ef4444' ? 'text-red-500' : 'text-primary'}`}>
                    {title}
                </StyledText>
                {subtitle && <StyledText className="text-gray-400 text-sm font-medium">{subtitle}</StyledText>}
            </StyledView>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
        </StyledButton>
    );

    if (!session) {
        return (
            <StyledSafeAreaView className="flex-1 bg-white items-center justify-center p-8">
                <StyledView className="w-24 h-24 bg-gray-100 rounded-full mb-6 items-center justify-center animate-pulse">
                    <Ionicons name="person" size={48} color="#9ca3af" />
                </StyledView>
                <StyledText className="text-2xl font-bold font-serif text-primary mb-3">Guest User</StyledText>
                <StyledText className="text-gray-500 text-center text-lg mb-8 leading-relaxed">
                    Log in to access your profile, manage listings, and save your favorite homes.
                </StyledText>

                <StyledButton
                    className="w-full bg-primary py-4 rounded-xl shadow-lg shadow-primary/30 active:opacity-90 flex-row justify-center items-center"
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Ionicons name="log-in-outline" size={24} color="white" style={{ marginRight: 8 }} />
                    <StyledText className="text-white font-bold text-lg">Log In / Sign Up</StyledText>
                </StyledButton>
            </StyledSafeAreaView>
        );
    }

    return (
        <StyledSafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <StyledScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header Profile Section */}
                <StyledView className="bg-white p-6 pt-2 pb-8 rounded-b-[40px] shadow-sm mb-6 items-center">
                    <StyledView className="w-28 h-28 bg-primary rounded-full mb-4 items-center justify-center border-4 border-gray-100 shadow-xl overflow-hidden relative">
                        {session.user.user_metadata.avatar_url ? (
                            <StyledImage
                                source={{ uri: session.user.user_metadata.avatar_url }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <StyledText className="text-4xl text-white font-serif font-bold">
                                {session.user.email?.[0].toUpperCase()}
                            </StyledText>
                        )}
                    </StyledView>
                    <StyledText className="text-2xl font-bold text-primary font-serif mb-1">
                        {session.user.user_metadata.full_name || 'Valued User'}
                    </StyledText>
                    <StyledText className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-xs">
                        {session.user.email}
                    </StyledText>
                </StyledView>

                {/* Menu Options */}
                <StyledView className="px-5 space-y-4">
                    <StyledText className="text-gray-400 font-bold text-xs uppercase tracking-widest ml-2 mb-2">My Account</StyledText>

                    <MenuOption
                        icon="heart-outline"
                        title="Saved Properties"
                        subtitle={`${0} Items Saved`}
                        onPress={() => router.push('/(tabs)/saved')}
                    />

                    {/* Owner Features - Only visible if user has owner role */}
                    {(session.user.user_metadata.role === 'owner' ||
                        session.user.app_metadata?.role === 'owner') && (
                            <MenuOption
                                icon="home-outline"
                                title="My Listings"
                                subtitle="Manage properties you own"
                                onPress={() => router.push('/owner/my-listings')}
                            />
                        )}

                    <StyledText className="text-gray-400 font-bold text-xs uppercase tracking-widest ml-2 mt-6 mb-2">Preferences</StyledText>

                    <MenuOption
                        icon="settings-outline"
                        title="Settings"
                        subtitle="Notifications, Privacy"
                        onPress={() => Alert.alert("Settings", "Settings page coming soon.")}
                    />
                    <MenuOption
                        icon="help-circle-outline"
                        title="Help & Support"
                        subtitle="FAQ, Contact Us"
                        onPress={() => Alert.alert("Support", "Contact support at support@realestatebroker.com")}
                    />

                    <StyledView className="mt-6">
                        <MenuOption
                            icon="log-out-outline"
                            title="Sign Out"
                            color="#ef4444"
                            onPress={handleSignOut}
                        />
                    </StyledView>
                </StyledView>

                <StyledText className="text-center text-gray-300 text-xs mt-8">
                    Version 1.0.0
                </StyledText>
            </StyledScrollView>
        </StyledSafeAreaView>
    );
}
