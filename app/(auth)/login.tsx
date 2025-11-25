// app/(auth)/login.tsx (Corrected TypeScript Errors)

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
            // FIX 1: The 'login' function in AuthContext is typed as returning 'void' (Promise<void>).
            // It modifies state internally and triggers navigation via the useEffect listener.
            // We should just call it and await completion, not assign its (empty) return value to 'success'.
            await login(email, password); 
            
            // The AuthContext listener handles the actual navigation upon successful authentication.
            console.log('Login request sent. AuthContext should handle navigation via state change.');
            
        } catch (error) {
            // FIX 2: 'error' is of type 'unknown'. We must safely type-check it before accessing properties like '.message'.
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

    const isUIDisabled = loading;
    
    console.log("Rendering Login screen."); 

    const contentBgColor = '#D98CBF';

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#FFFFFF', dark: '#000000' }}
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

                        {!!errorMsg && <Text style={{ color: 'red', marginTop: 10 }}>{errorMsg}</Text>}
                        
                        <View style={{ alignItems: 'center' }}>
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
                            <Button
                                mode="contained"
                                style={styles.dynamicButton} 
                                onPress={handleLogin} 
                                disabled={isUIDisabled}
                                loading={isUIDisabled}
                            >
                                Log In
                            </Button>
                            <Button
                                mode="contained"
                                style={styles.dynamicButton} 
                                onPress={resetForm} 
                                disabled={isUIDisabled}
                            >
                                Reset
                            </Button>
                            <Button
                                mode="contained" 
                                style={styles.dynamicButton} 
                                onPress={() => router.push('/(auth)/signup' as Href)} 
                                disabled={isUIDisabled}
                            >
                                Sign Up
                            </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
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
        flexGrow: 1, 
    },
    loadingOverlay: {
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
