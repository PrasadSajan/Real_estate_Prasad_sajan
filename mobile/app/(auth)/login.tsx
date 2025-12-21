
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, Link } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(TouchableOpacity);

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Warm up the browser
    useEffect(() => {
        WebBrowser.warmUpAsync();
        return () => {
            WebBrowser.coolDownAsync();
        };
    }, []);

    async function signInWithGoogle() {
        setLoading(true);
        try {
            const redirectUrl = makeRedirectUri({
                scheme: 'realestate',
                path: 'auth/callback',
            });
            console.log('Redirect URL:', redirectUrl);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;

            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

                if (result.type === 'success' && result.url) {
                    // Extract tokens from the URL fragment
                    const params: { [key: string]: string } = {};
                    const urlParts = result.url.split('#');

                    if (urlParts.length > 1) {
                        const query = urlParts[1];
                        query.split('&').forEach(part => {
                            const [key, value] = part.split('=');
                            params[key] = decodeURIComponent(value);
                        });
                    }

                    if (params.access_token && params.refresh_token) {
                        const { error: sessionError } = await supabase.auth.setSession({
                            access_token: params.access_token,
                            refresh_token: params.refresh_token,
                        });

                        if (sessionError) throw sessionError;

                        // Navigate to profile
                        router.replace('/(tabs)/profile');
                    }
                }
            }
        } catch (error: any) {
            if (error.message !== 'User cancelled the login process') { // Ignore cancel
                Alert.alert('Google Sign-In Error', error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            router.replace('/(tabs)/profile');
        }
        setLoading(false);
    }

    async function resetPassword() {
        if (!email) {
            Alert.alert('Required', 'Please enter your email address to reset your password.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Email Sent', 'Check your email for the password reset link!');
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
                            <StyledText className="text-3xl font-bold text-primary font-serif mb-2">Welcome Back</StyledText>
                            <StyledText className="text-gray-500 text-base">Sign in to continue to your account</StyledText>
                        </StyledView>

                        <StyledView className="space-y-4">
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
                            </StyledView>

                            <StyledButton
                                className="items-end"
                                onPress={resetPassword}
                            >
                                <StyledText className="text-primary font-bold text-sm">Forgot Password?</StyledText>
                            </StyledButton>

                            <StyledButton
                                className={`bg-primary rounded-xl py-4 items-center mt-4 ${loading ? 'opacity-70' : ''}`}
                                onPress={signInWithEmail}
                                disabled={loading}
                            >
                                <StyledText className="text-white font-bold text-lg">
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </StyledText>
                            </StyledButton>

                            <StyledView className="flex-row items-center my-4">
                                <StyledView className="flex-1 h-px bg-gray-200" />
                                <StyledText className="mx-4 text-gray-400 font-medium">OR</StyledText>
                                <StyledView className="flex-1 h-px bg-gray-200" />
                            </StyledView>

                            <StyledButton
                                className="bg-white border border-gray-200 rounded-xl py-4 items-center flex-row justify-center space-x-2"
                                onPress={signInWithGoogle}
                                disabled={loading}
                            >
                                <Ionicons name="logo-google" size={20} color="black" style={{ marginRight: 8 }} />
                                <StyledText className="text-gray-700 font-bold text-lg">
                                    Continue with Google
                                </StyledText>
                            </StyledButton>

                            <StyledView className="flex-row justify-center mt-6">
                                <StyledText className="text-gray-500">Don't have an account? </StyledText>
                                <Link href="/(auth)/signup" asChild>
                                    <StyledButton>
                                        <StyledText className="text-accent font-bold">Sign Up</StyledText>
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
