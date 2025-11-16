import validator from 'email-validator';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    View,
} from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useFirebase } from '../../context/FirebaseContext';
import { styles2 } from '../../styles/css';

export default function ForgotPassword() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { auth } = useFirebase();
    const theme = useTheme();

    const userEmailFromRoute = typeof params.userEmail === 'string' ? params.userEmail : undefined;
    const [email, setEmail] = useState(userEmailFromRoute || '');
    const [errorMsg, setErrorMsg] = useState(''); // Consolidated error message state
    const [inPost, setInPost] = useState(false);
    const [message, setMessage] = useState(''); // Success message state

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
            await auth.sendPasswordResetEmail(email);
            setMessage("Password reset email sent. Please check your inbox.");
            // ErrorMsg cleared by setMessage
        } catch (error: any) {
            console.error("Password reset error:", error);
            if (error.code === 'auth/user-not-found') {
                setErrorMsg("No account found for this email address.");
            } else {
                setErrorMsg("An error occurred. Please try again.");
            }
            setMessage(''); // Clear success message if an error occurs
        } finally {
            setInPost(false);
        }
    };

    const isUIDisabled = inPost;

    return (
        <SafeAreaView style={styles2.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles2.container}>
                {/* styles2.loginMain or styles2.mainContainer should handle responsive width, e.g., maxWidth: 400 on web */}
                <View style={styles2.loginMain}> 
                    <Text style={styles2.latoFont3}>Forgot Password?</Text>
                    <Text style={styles2.latoFont2}>Enter email for password reset link.</Text>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        error={!!errorMsg} // Use errorMsg state for TextInput error indicator
                        style={styles2.input}
                        disabled={isUIDisabled}
                    />
                    {/* Use a single Text component for error/success display */}
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
