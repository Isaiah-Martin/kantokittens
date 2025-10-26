import { NativeStackScreenProps } from '@react-navigation/native-stack';
import validator from 'email-validator';
import React, { useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    TextInput as RNTextInput,
    SafeAreaView,
    Text,
    View
} from 'react-native';
import { Button, MD3LightTheme as DefaultTheme, TextInput } from 'react-native-paper';
import { auth } from '../lib/firebase';
import { AuthStackParamList } from '../navigation/RootStackParamList'; // Assuming this file exists and is correctly defined
import { styles2 } from '../styles/css';

export type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPassword({route, navigation}: { route: any, navigation: ForgotPasswordScreenProps}) {
    const userEmailFromRoute = route.params?.userEmail;
    const [email, setEmail] = useState(userEmailFromRoute);
    const [emailErr, setEmailErr] = useState('');
    const emailEl = useRef<RNTextInput | null>(null);
    const [inPost, setInPost] = useState(false);
    const [message, setMessage] = useState('');

    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: '#D98CBF',
        },
    };

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
    
    setInPost(true);
    try {
        // Use the native SDK's method to send the password reset email
        await auth().sendPasswordResetEmail(email);
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
                     theme={theme}
                     style={styles2.loginButton}
                  >
                     Send Reset Email
                  </Button>
               </View>
         </KeyboardAvoidingView>
      </SafeAreaView>
    );
}