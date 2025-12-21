
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, Link } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(TouchableOpacity);

export default function SignupScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            Alert.alert(
                'Invalid Password',
                'Password must be at least 8 characters long and include at least one letter, one number, and one special character.'
            );
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            if (data.session) {
                router.replace('/(tabs)/profile');
            } else {
                Alert.alert('Success', 'Please check your inbox for email verification!');
                router.back();
            }
        }
        setLoading(false);
    }

    return (
        <StyledSafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, padding: 24 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <StyledView className="absolute top-4 left-6 z-10 w-full mt-4">
                        <StyledButton onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full w-10 h-10 items-center justify-center">
                            <Ionicons name="arrow-back" size={24} color="#374151" />
                        </StyledButton>
                    </StyledView>

                    <StyledView className="flex-1 justify-center">
                        <StyledView className="mb-8">
                            <StyledText className="text-3xl font-bold text-primary font-serif mb-2">Create Account</StyledText>
                            <StyledText className="text-gray-500 text-base">Sign up to start saving your favorite homes</StyledText>
                        </StyledView>

                        <StyledView className="space-y-4">
                            <StyledView>
                                <StyledText className="text-gray-700 font-bold mb-2 ml-1">Full Name</StyledText>
                                <StyledTextInput
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                            </StyledView>

                            <StyledView>
                                <StyledText className="text-gray-700 font-bold mb-2 ml-1">Email</StyledText>
                                <StyledTextInput
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium"
                                    placeholder="hello@example.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </StyledView>

                            <StyledView>
                                <StyledText className="text-gray-700 font-bold mb-2 ml-1">Password</StyledText>
                                <StyledView className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 flex-row items-center">
                                    <StyledTextInput
                                        className="flex-1 text-gray-700 font-medium py-3 h-full"
                                        placeholder="••••••••"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
                                    </TouchableOpacity>
                                </StyledView>
                                <StyledText className="text-gray-400 text-xs ml-1 mt-1">
                                    Must be 8+ chars with letters, numbers & symbols
                                </StyledText>
                            </StyledView>

                            <StyledButton
                                className={`bg-primary rounded-xl py-4 items-center mt-4 ${loading ? 'opacity-70' : ''}`}
                                onPress={signUpWithEmail}
                                disabled={loading}
                            >
                                <StyledText className="text-white font-bold text-lg">
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </StyledText>
                            </StyledButton>

                            <StyledView className="flex-row justify-center mt-6">
                                <StyledText className="text-gray-500">Already have an account? </StyledText>
                                <Link href="/(auth)/login" asChild>
                                    <StyledButton>
                                        <StyledText className="text-accent font-bold">Sign In</StyledText>
                                    </StyledButton>
                                </Link>
                            </StyledView>
                        </StyledView>
                    </StyledView>
                </ScrollView>
            </KeyboardAvoidingView>
        </StyledSafeAreaView>
    );
}
