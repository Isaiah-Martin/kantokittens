// app/(auth)/login.tsx (Revised with optimized button spacing and width and functional logic)

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Href, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';


export default function Login() {
    const router = useRouter();
    // Assuming AuthContext provides a function 'login' that accepts (email, password)
    // and a 'loading' boolean state.
    const { login, loading } = useContext(AuthContext); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const theme = useTheme();
    const primaryColor = theme.colors.primary;
    
    // --- Functional Logic Implementation ---
    const handleLogin = async () => {
        setErrorMsg(''); // Clear previous errors
        if (!email || !password) {
            setErrorMsg('Please enter both email and password.');
            return;
        }

        try {
            // Call the login function from your AuthContext
            const success = await login(email, password); 
            if (success) {
                // The AuthContext should ideally handle navigation to the main app flow upon success.
                console.log('Login successful, context should handle navigation.');
            } else {
                // If login function returns false (or handles its own errors internally)
                setErrorMsg('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMsg(`An error occurred: ${error.message || 'Unknown error'}`);
        }
    };

    function resetForm() {
        console.log('Resetting form fields.');
        setEmail('');
        setPassword('');
        setErrorMsg('');
    }

    const isUIDisabled = loading;
    
    console.log("Rendering Login screen."); 

    // Define the new background color as a constant for readability
    const contentBgColor = '#D98CBF';

    return (
        <ParallaxScrollView
            // Change header background color to white to match the image background
            headerBackgroundColor={{ light: '#FFFFFF', dark: '#000000' }}
            headerImage={
                // Added a centering view around the image to ensure it's aligned properly
                <View style={styles.imageContainer}>
                    <Image source={require('@/assets/images/KantoKittensCover.png')} style={styles.reactLogo} resizeMode="contain" />
                </View>
            }
        >
            {/* Set content background color to the requested #D98CBF */}
            <View style={{ flexGrow: 1, backgroundColor: contentBgColor }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    // Reduced paddingHorizontal to ensure buttons fit within the screen width
                    style={{ flexGrow: 1, paddingHorizontal: 16, paddingTop: 30 }} 
                >
                    <View style={{ gap: 20 }}>
                        <View style={{ alignItems: 'center' }}>
                            {/* Larger, bold text for the header */}
                            <Text 
                                variant="headlineMedium" 
                                style={{ 
                                    color: theme.colors.onSurface, 
                                    fontWeight: 'bold' 
                                }}
                            >
                                Please Login
                            </Text>
                        </View>
                        <TextInput
                            mode="outlined"
                            label="Email"
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoComplete="email"
                            keyboardType="email-address"
                            disabled={isUIDisabled}
                            style={styles.input}
                        />
                        <TextInput
                            mode="outlined"
                            label="Password"
                            placeholder="Password"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                            disabled={isUIDisabled}
                            style={styles.input}
                        />

                        {/* Error message display */}
                        {!!errorMsg && <Text style={{ color: 'red', marginTop: 10 }}>{errorMsg}</Text>}
                        
                        <View style={{ alignItems: 'center' }}>
                            {/* Forgot Password Button - Uses expo-router for navigation */}
                            <Button
                                mode="text"
                                uppercase={false}
                                onPress={() => router.push('/(auth)/forgotpassword' as Href)}
                                disabled={isUIDisabled}
                            >
                                Forgot Password?
                            </Button>
                        </View>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                            {/* Log In Button - Calls handleLogin function */}
                            <Button
                                mode="contained"
                                style={styles.dynamicButton} 
                                onPress={handleLogin} // This connects the button to the logic
                                disabled={isUIDisabled}
                                loading={isUIDisabled}
                            >
                                Log In
                            </Button>
                            {/* Reset Button - Calls resetForm function */}
                            <Button
                                mode="contained"
                                style={styles.dynamicButton} 
                                onPress={resetForm} // This connects the button to the logic
                                disabled={isUIDisabled}
                            >
                                Reset
                            </Button>
                            {/* Sign Up Button - Uses expo-router for navigation */}
                            <Button
                                mode="contained" 
                                style={styles.dynamicButton} 
                                onPress={() => router.push('/(auth)/signup' as Href)} // This connects the button to the navigation
                                disabled={isUIDisabled}
                            >
                                Sign Up
                            </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                {/* Simplified loading indicator display */}
                {isUIDisabled && (
                  <View style={styles.loadingOverlay}>
                      <ActivityIndicator size="large" animating={true} color={primaryColor} />
                  </View>
                )}
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF', 
    },
    reactLogo: {
        width: '100%', 
        height: '100%',
        aspectRatio: 1,
    },
    input: {
        height: 50, 
    },
    dynamicButton: {
        backgroundColor: 'black', 
        height: 50, 
        justifyContent: 'center',
        flexGrow: 1, // Allows buttons to share available space evenly
    },
    loadingOverlay: {
        position: 'absolute', // Position over content
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        // Optional: add a slight overlay color here if desired
    }
});
