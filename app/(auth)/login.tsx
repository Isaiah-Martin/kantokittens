// app/(auth)/login.tsx (Revised with optimized button spacing and width)

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
    
    const handleLogin = async () => {
        // ... (handleLogin logic remains the same) ...
    };

    function resetForm() {
        // ... (resetForm logic remains the same) ...
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
                        {/* Added justifyContent: 'space-between' for even distribution of buttons */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                            <Button
                                mode="contained"
                                style={styles.dynamicButton} // Use dynamicButton style below
                                onPress={handleLogin}
                                disabled={isUIDisabled}
                                loading={isUIDisabled}
                            >
                                Log In
                            </Button>
                            <Button
                                mode="contained"
                                style={styles.dynamicButton} // Use dynamicButton style below
                                onPress={resetForm}
                                disabled={isUIDisabled}
                            >
                                Reset
                            </Button>
                            <Button
                                mode="contained" 
                                style={styles.dynamicButton} // Use dynamicButton style below
                                onPress={() => router.push('/(auth)/signup' as Href)}
                                disabled={isUIDisabled}
                            >
                                Sign Up
                            </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                {isUIDisabled && (
                  <View style={{ /* simple loading styles if needed */ }}>
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
    // New style for buttons: dynamic sizing based on content
    dynamicButton: {
        backgroundColor: 'black', 
        height: 50, 
        justifyContent: 'center',
        // No fixed width, lets the content dictate size
    },
    buttonText: {
        color: '#D98CBF',
        tintColor: '#D98CBF'
    }
});
