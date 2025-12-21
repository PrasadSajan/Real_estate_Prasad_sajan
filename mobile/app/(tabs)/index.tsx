import { ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import Hero from '../../components/Hero';
import FeaturedProperties from '../../components/FeaturedProperties';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

export default function Home() {
    return (
        <StyledSafeAreaView className="flex-1 bg-white" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <StyledScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 50 }}>
                <Hero />
                <FeaturedProperties />
            </StyledScrollView>
        </StyledSafeAreaView>
    );
}
