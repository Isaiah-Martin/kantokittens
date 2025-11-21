import validator from 'email-validator';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    View,
} from 'react-native';
// Use SafeAreaView from the context library
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirebase } from '../../context/FirebaseContext';
import { styles2 } from '../../styles/css';
// Import specific native auth type needed for the assertion
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
// Import web auth type for completeness if needed for web compatibility logic
import type { Auth } from 'firebase/auth';


export default function ForgotPassword() {
    const router = useRouter();
    const params = useLocalSearchParams();
    // auth is a union type (Web | Native)
    const { auth } = useFirebase(); 
    const theme = useTheme();

    const userEmailFromRoute = typeof params.userEmail === 'string' ? params.userEmail : undefined;
    const [email, setEmail] = useState(userEmailFromRoute || '');
    const [errorMsg, setErrorMsg] = useState('');
    const [inPost, setInPost] = useState(false);
    const [message, setMessage] = useState('');

    const handleSendResetEmail = async () => {
        setErrorMsg('');
        setMessage('');

        if (!email) {
            setErrorMsg("Please type your email, this field is required!");
            return;
        }

        if (!validator.validate(email)) {
            setErrorMsg("This email is not valid. Please enter a valid email address.");
            return;
        }

        if (!auth) {
            setErrorMsg("Firebase authentication service is not available.");
            return;
        }
        
        setInPost(true);
        try {
            // --- V8/V9 COMPATIBILITY LOGIC ---
            // Check if the expected native v8 method exists (for @react-native-firebase).
            if (typeof (auth as FirebaseAuthTypes.Module).sendPasswordResetEmail === 'function') {
                 await (auth as FirebaseAuthTypes.Module).sendPasswordResetEmail(email);
            } 
            // If not, it's likely the web environment using the v9 modular web SDK.
            else {
                // Dynamically import the v9 modular function 
                const { sendPasswordResetEmail } = await import('firebase/auth');
                await sendPasswordResetEmail(auth as Auth, email);
            }
            // --- END COMPATIBILITY LOGIC ---

            setMessage("Password reset email sent. Please check your inbox.");
            
        } catch (error: any) {
            console.error("Password reset error:", error);
            if (error.code === 'auth/user-not-found') {
                setErrorMsg("No account found for this email address.");
            } else {
                setErrorMsg("An error occurred. Please try again.");
            }
            setMessage('');
        } finally {
            setInPost(false);
        }
    };

    const isUIDisabled = inPost;

    return (
        // Use the react-native-safe-area-context SafeAreaView
        <SafeAreaView style={styles2.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles2.container}>
                <View style={styles2.loginMain}> 
                    <Text style={styles2.latoFont3}>Forgot Password?</Text>
                    <Text style={styles2.latoFont2}>Enter email for password reset link.</Text>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        error={!!errorMsg} 
                        style={styles2.input}
                        disabled={isUIDisabled}
                    />
                    {!!errorMsg && <Text style={{ color: 'red', marginTop: 10 }}>{errorMsg}</Text>}
                    {!!message && <Text style={{ color: 'green', marginTop: 10 }}>{message}</Text>}
                    
                    <Button
                        mode="contained"
                        onPress={handleSendResetEmail}
                        disabled={isUIDisabled}
                        loading={isUIDisabled}
                        style={styles2.loginButton}
                    >
                        Send Reset Email
                    </Button>
                    <Button
                        mode="text"
                        onPress={() => router.replace('/(auth)/login' as Href)}
                        disabled={isUIDisabled}
                        style={{ marginTop: 10 }}
                    >
                        Return to Login
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
