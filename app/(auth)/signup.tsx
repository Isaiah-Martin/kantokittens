// screens/(auth)/signup.tsx

import validator from 'email-validator';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
// Use the recommended SafeAreaView
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addUser } from '~/lib/firestore';
import { useFirebase } from '../../context/FirebaseContext';
import { User } from '../../navigation/types';
// Import specific types for native firebase auth module
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
// Import the specific native firestore types needed for the assertion
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
// Import specific types for web firebase auth module
import type { Auth } from 'firebase/auth';

import { styles2 } from '../../styles/css';

export default function SignUp() {
  const router = useRouter();
  const { auth, firestore } = useFirebase();
  const theme = useTheme();
  const primaryColor = theme.colors.primary;
  const [user, setUser] = useState<Omit<User, 'uid'> & { password: string; name: string }>({
    name: '',
    email: '',
    password: '',
  });
  const [password2, setPassWd2] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [inPost, setInPost] = useState(false);

  const updateUser = (field: keyof typeof user, value: string) => {
    setUser((prevState) => ({ ...prevState, [field]: value }));
  };

  function resetErrMsg() {
    setErrorMsg('');
  }

  async function submitForm() {
    resetErrMsg();

    // 1. Validation Checks
    if (!user.name.trim()) {
      setErrorMsg('Please type your name, this field is required!');
      return;
    }
    if (!user.email) {
      setErrorMsg('Please type your email, this field is required!');
      return;
    }
    if (!validator.validate(user.email)) {
        setErrorMsg('Please enter a valid email address.');
        return;
    }
    if (!user.password || user.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (user.password !== password2) {
      setErrorMsg('Passwords do not match!');
      return;
    }
    if (!auth || !firestore) {
      setErrorMsg('Firebase services not available.');
      return;
    }

    // 2. Proceed with Firebase Auth
    setInPost(true);
    try {
      let userCredential;

      // --- V8/V9 COMPATIBILITY LOGIC (for explicit create user call) ---
      // Check if the expected native v8 method exists (for @react-native-firebase).
      if (typeof (auth as FirebaseAuthTypes.Module).createUserWithEmailAndPassword === 'function') {
        userCredential = await (auth as FirebaseAuthTypes.Module).createUserWithEmailAndPassword(user.email, user.password);
      } 
      // If not, it's likely the web environment using the v9 modular web SDK.
      else {
        // Dynamically import the v9 modular function (requires 'firebase' npm package to be installed)
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        userCredential = await createUserWithEmailAndPassword(auth as Auth, user.email, user.password);
      }
      // --- END COMPATIBILITY LOGIC ---
      
      const newUser: User = {
        uid: userCredential.user.uid,
        name: user.name,
        email: user.email,
      };
      
      await addUser(firestore as FirebaseFirestoreTypes.Module, newUser);
      // The AuthContext listener will pick up the auth state change and navigate.
      
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg('That email address is invalid!');
      } else {
        // Log the full error for debugging purposes
        console.error("Signup error:", error); 
        setErrorMsg(error.message || 'An error occurred during sign up.');
      }
    } finally {
      setInPost(false); 
    }
  }

  function resetForm() {
    setUser({ name: '', email: '', password: '' });
    setPassWd2('');
    resetErrMsg();
  }
  
  const isUIDisabled = inPost;

  return (
    // Use the react-native-safe-area-context SafeAreaView
    <SafeAreaView style={styles2.container}> 
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles2.container}>
        <ScrollView contentContainerStyle={styles2.container}>
          <View style={styles2.mainContainer}>
            <View style={styles2.itemCenter}>
              <Text style={styles2.titleText}>Join to Place Booking</Text>
            </View>
            <TextInput
              mode="outlined"
              label="Name"
              placeholder="Name*"
              value={user.name}
              onChangeText={(text) => updateUser('name', text)}
              disabled={isUIDisabled}
            />
            
            <TextInput
              mode="outlined"
              label="Email"
              placeholder="Email*"
              value={user.email}
              onChangeText={(text) => updateUser('email', text)}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              disabled={isUIDisabled}
              style={{marginTop: 10}}
            />
            
            <TextInput
              mode="outlined"
              label="Password"
              placeholder="Password*"
              secureTextEntry={true}
              value={user.password}
              onChangeText={(text) => updateUser('password', text)}
              disabled={isUIDisabled}
              style={{marginTop: 10}}
            />
            
            <TextInput
              mode="outlined"
              label="Please type password again"
              placeholder="Please type password again*"
              secureTextEntry={true}
              value={password2}
              onChangeText={setPassWd2}
              disabled={isUIDisabled}
              style={{marginTop: 10}}
            />

            {!!errorMsg && <Text style={{ color: 'red', marginTop: 10 }}>{errorMsg}</Text>}
            
            <View style={[styles2.itemLeft, { marginTop: 20 }]}>
              <Button mode="contained" style={{ marginRight: 20 }} onPress={submitForm} disabled={isUIDisabled} loading={isUIDisabled}>
                Sign Up
              </Button>
              <Button mode="contained" style={{ marginRight: 20 }} onPress={resetForm} disabled={isUIDisabled}>
                Reset
              </Button>
              <Button
                mode="outlined"
                style={{ marginRight: 20 }}
                onPress={() => router.replace('/(auth)/login' as Href)}
                disabled={isUIDisabled}
              >
                Log In
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {isUIDisabled && (
        <View style={styles2.loading}>
          <ActivityIndicator size="large" animating={true} color={primaryColor} />
        </View>
      )}
    </SafeAreaView>
  );
}
