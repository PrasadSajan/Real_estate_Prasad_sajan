import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, TextInput, Image } from 'react-native';
import { styled } from 'nativewind';
import { translations } from '../src/data/translations';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImageBackground = styled(ImageBackground);
const StyledButton = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

export default function Hero() {
    const t = translations['en'];
    const router = useRouter();

    const handleSearch = () => {
        router.push('/(tabs)/search');
    };

    return (
        <StyledView className="relative h-[450px] w-full overflow-hidden rounded-b-[40px] shadow-2xl bg-primary">
            <StyledImageBackground
                source={require('../assets/hero-bg.png')}
                className="flex-1 justify-center items-center"
                resizeMode="cover"
            >
                {/* Dark Overlay with Gradient Effect */}
                <StyledView className="absolute inset-0 bg-black/50" />
                <StyledView className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <StyledView className="z-10 w-full px-6 items-center mt-10">
                    <StyledText className="text-white text-4xl font-bold font-serif text-center drop-shadow-2xl mb-4 leading-tight">
                        {t.heroTitle}
                    </StyledText>
                    <StyledText className="text-gray-200 text-center text-lg mb-10 max-w-sm leading-relaxed opacity-90">
                        {t.heroSubtitle}
                    </StyledText>

                    {/* Glassmorphism Search Container */}
                    <StyledView className="w-full bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-2xl">
                        <StyledButton
                            activeOpacity={0.9}
                            onPress={handleSearch}
                            className="bg-white rounded-2xl px-4 py-4 flex-row items-center mb-3"
                        >
                            <Ionicons name="location-outline" size={24} color="#d97706" />
                            <StyledText className="text-gray-500 font-medium text-base ml-3 flex-1">
                                {t.heroAllLocations}
                            </StyledText>
                            <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                        </StyledButton>

                        <StyledButton
                            activeOpacity={0.9}
                            onPress={handleSearch}
                            className="bg-accent rounded-2xl py-4 items-center flex-row justify-center shadow-lg shadow-accent/30"
                        >
                            <StyledText className="text-white font-bold text-lg mr-2">{t.heroSearchBtn}</StyledText>
                            <Ionicons name="search" size={20} color="white" />
                        </StyledButton>
                    </StyledView>
                </StyledView>
            </StyledImageBackground>
        </StyledView>
    );
}
