import validator from 'email-validator';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    TextInput as RNTextInput,
    SafeAreaView,
    Text,
    View
} from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useFirebase } from '../../context/FirebaseContext';
import { styles2 } from '../../styles/css';

export default function ForgotPassword() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { auth } = useFirebase(); // Get auth from FirebaseContext

    const userEmailFromRoute = typeof params.userEmail === 'string' ? params.userEmail : undefined;
    const [email, setEmail] = useState(userEmailFromRoute || '');
    const [emailErr, setEmailErr] = useState('');
    const emailEl = useRef<RNTextInput | null>(null);
    const [inPost, setInPost] = useState(false);
    const [message, setMessage] = useState('');
    const theme = useTheme();

    const handleSendResetEmail = async () => {
        setEmailErr('');
        setMessage('');

        if (!email) {
            setEmailErr("Please type your email, this field is required!");
            emailEl.current?.focus();
            return;
        }

        if (!validator.validate(email)) {
            setEmailErr("This email is not valid. Please enter a valid email address.");
            emailEl.current?.focus();
            return;
        }

        if (!auth) {
            return;
        }
        
        setInPost(true);
        try {
            await auth.sendPasswordResetEmail(email);
            setMessage("Password reset email sent. Please check your inbox.");
            setEmailErr('');
        } catch (error: any) {
            console.error("Password reset error:", error);
            if (error.code === 'auth/user-not-found') {
                setEmailErr("No account found for this email address.");
            } else {
                setEmailErr("An error occurred. Please try again.");
            }
        } finally {
            setInPost(false);
        }
    };

    return (
        <SafeAreaView style={styles2.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles2.container}>
                <View style={styles2.loginMain}>
                    <Text style={styles2.latoFont3}>Forgot Password?</Text>
                    <Text style={styles2.latoFont2}>Enter email for password reset link.</Text>
                    <TextInput
                        ref={emailEl}
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        error={!!emailErr}
                        style={styles2.input}
                        disabled={inPost}
                    />
                    {!!emailErr && <Text style={styles2.errorText}>{emailErr}</Text>}
                    {!!message && <Text style={styles2.successText}>{message}</Text>}
                    <Button
                        mode="contained"
                        onPress={handleSendResetEmail}
                        disabled={inPost}
                        loading={inPost}
                        style={styles2.loginButton}
                    >
                        Send Reset Email
                    </Button>
                    <Button
                        mode="text"
                        onPress={() => router.replace('/(auth)/login' as Href)}
                        disabled={inPost}
                        style={{ marginTop: 10 }}
                    >
                        Return to Login
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}