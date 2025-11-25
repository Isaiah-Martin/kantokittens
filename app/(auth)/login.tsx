// app/(auth)/login.tsx (Revised to handle Firebase Initialization Timing)

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
// Import FirebaseContext to check initialization status
import { FirebaseContext } from '../../context/FirebaseContext';


export default function Login() {
    const router = useRouter();
    const { login, loading } = useContext(AuthContext); 
    // Get the isReady state from FirebaseContext
    const { isReady: firebaseIsReady } = useContext(FirebaseContext); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const theme = useTheme();
    const primaryColor = theme.colors.primary;
    
    // --- Functional Logic Implementation ---
    const handleLogin = async () => {
        setErrorMsg(''); // Clear previous errors
        
        // Ensure Firebase is ready before attempting login (redundant check if UI is disabled, but safe)
        if (!firebaseIsReady) {
            setErrorMsg('Firebase services are still initializing. Please wait a moment.');
            return;
        }

        if (!email || !password) {
            setErrorMsg('Please enter both email and password.');
            return;
        }

        try {
            // The 'login' function handles navigation internally via the AuthContext listener.
            await login(email, password); 
            console.log('Login request sent. AuthContext should handle navigation via state change.');
            
        } catch (error) {
            console.error("Login error:", error);
            if (error instanceof Error) {
                setErrorMsg(`An error occurred: ${error.message}`);
            } else {
                setErrorMsg('An unknown error occurred during login.');
            }
        }
    };

    function resetForm() {
        console.log('Resetting form fields.');
        setEmail('');
        setPassword('');
        setErrorMsg('');
    }

    // Combine 'loading' state (from AuthContext) and 'isReady' state (from FirebaseContext)
    const isUIDisabled = loading || !firebaseIsReady;
    
    console.log("Rendering Login screen."); 

    const contentBgColor = '#F3A78F';

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#F3A78F', dark: '#000000' }}
            headerImage={
                <View style={styles.imageContainer}>
                    <Image source={require('@/assets/images/KantoKittensCover.png')} style={styles.reactLogo} resizeMode="contain" />
                </View>
            }
        >
            <View style={{ flexGrow: 1, backgroundColor: contentBgColor }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flexGrow: 1, paddingHorizontal: 16, paddingTop: 30 }} 
                >
                    <View style={{ gap: 20 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text 
                                variant="headlineMedium" 
                                style={{ 
                                    color: '#4A3728', 
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
                            disabled={isUIDisabled} // Uses the combined disabled state
                            style={styles.input}
                        />
                        <TextInput
                            mode="outlined"
                            label="Password"
                            placeholder="Password"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                            disabled={isUIDisabled} // Uses the combined disabled state
                            style={styles.input}
                        />

                        {!!errorMsg && <Text style={{ color: 'red', marginTop: 10 }}>{errorMsg}</Text>}
                        
                        <View style={{ alignItems: 'center' }}>
                            <Button
                                mode="text"
                                uppercase={false}
                                onPress={() => router.push('/(auth)/forgotpassword' as Href)}
                                disabled={isUIDisabled} // Uses the combined disabled state
                            >
                                Forgot Password?
                            </Button>
                        </View>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                            <Button
                                mode="contained"
                                style={styles.dynamicButton} 
                                onPress={handleLogin} 
                                disabled={isUIDisabled} // Uses the combined disabled state
                                loading={isUIDisabled}
                            >
                                Log In
                            </Button>
                            <Button
                                mode="contained"
                                style={styles.dynamicButton} 
                                onPress={resetForm} 
                                disabled={isUIDisabled} // Uses the combined disabled state
                            >
                                Reset
                            </Button>
                            <Button
                                mode="contained" 
                                style={styles.dynamicButton} 
                                onPress={() => router.push('/(auth)/signup' as Href)} 
                                disabled={isUIDisabled} // Uses the combined disabled state
                            >
                                Sign Up
                            </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                {/* Show the activity indicator if UI is disabled (waiting for Firebase or during login attempt) */}
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
        backgroundColor: '#FCFBF6', 
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
        backgroundColor: '#52392F', 
        height: 50, 
        justifyContent: 'center',
        flexGrow: 1, 
    },
    loadingOverlay: {
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
