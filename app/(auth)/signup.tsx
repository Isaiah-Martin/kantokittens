// app/(auth)/signUp.tsx

import validator from 'email-validator';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
// IMPORT RTDB functions instead of firestore
import { Database, ref, set } from 'firebase/database';
// Import 'useFirebase' to get the 'database' instance
import { useFirebase } from '../../context/FirebaseContext';
import { User } from '../../navigation/types';
import { styles2 } from '../../styles/css';
// Import specific types for native firebase auth module
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
// Import specific types for web firebase auth module
import type { Auth } from 'firebase/auth';


// Helper function to add user data to Realtime Database
const addUserRTDB = async (database: Database, user: User): Promise<void> => {
    // Set data at the path: /users/{user.uid}
    const userRef = ref(database, 'users/' + user.uid);
    await set(userRef, {
        name: user.name,
        email: user.email,
        // Add other fields you need to store in the DB here
    });
};


export default function SignUp() {
  const router = useRouter();
  // Changed from 'firestore' to 'database'
  const { auth, database } = useFirebase(); 
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
    if (!user.name.trim()) { setErrorMsg('Please type your name, this field is required!'); return; }
    if (!user.email) { setErrorMsg('Please type your email, this field is required!'); return; }
    if (!validator.validate(user.email)) { setErrorMsg('Please enter a valid email address.'); return; }
    if (!user.password || user.password.length < 6) { setErrorMsg('Password must be at least 6 characters long.'); return; }
    if (user.password !== password2) { setErrorMsg('Passwords do not match!'); return; }
    
    // Check for required services
    if (!auth || !database) {
      setErrorMsg('Firebase services not available.');
      return;
    }

    // 2. Proceed with Firebase Auth
    setInPost(true);
    try {
      let userCredential;

      // --- V8/V9 COMPATIBILITY LOGIC (for explicit create user call) ---
      if (typeof (auth as FirebaseAuthTypes.Module).createUserWithEmailAndPassword === 'function') {
        userCredential = await (auth as FirebaseAuthTypes.Module).createUserWithEmailAndPassword(user.email, user.password);
      } else {
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        userCredential = await createUserWithEmailAndPassword(auth as Auth, user.email, user.password);
      }
      // --- END COMPATIBILITY LOGIC ---
      
      const newUser: User = {
        uid: userCredential.user.uid,
        name: user.name,
        email: user.email,
      };
      
      // Use the RTDB function and pass the database instance
      await addUserRTDB(database, newUser); 
      
      // The AuthContext listener will pick up the auth state change and navigate upon success.
      
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg('That email address is invalid!');
      } else {
        console.error("Signup error:", error); 
        // Use type checking for 'unknown' error type safety
        if (error instanceof Error) {
            setErrorMsg(error.message || 'An error occurred during sign up.');
        } else {
            setErrorMsg('An unknown error occurred during sign up.');
        }
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
    <SafeAreaView style={styles2.container}> 
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles2.container}>
        <ScrollView contentContainerStyle={styles2.container}>
          <View style={styles2.mainContainer}>
            <View style={styles2.itemCenter}>
              <Text style={styles2.titleText}>Join to Place Booking</Text>
            </View>
            {/* Input Fields (Omitted for brevity, they remain the same as the original) */}
            <TextInput mode="outlined" label="Name" placeholder="Name*" value={user.name} onChangeText={(text) => updateUser('name', text)} disabled={isUIDisabled} />
            <TextInput mode="outlined" label="Email" placeholder="Email*" value={user.email} onChangeText={(text) => updateUser('email', text)} autoCapitalize="none" autoComplete="email" keyboardType="email-address" disabled={isUIDisabled} style={{marginTop: 10}} />
            <TextInput mode="outlined" label="Password" placeholder="Password*" secureTextEntry={true} value={user.password} onChangeText={(text) => updateUser('password', text)} disabled={isUIDisabled} style={{marginTop: 10}} />
            <TextInput mode="outlined" label="Please type password again" placeholder="Please type password again*" secureTextEntry={true} value={password2} onChangeText={setPassWd2} disabled={isUIDisabled} style={{marginTop: 10}} />

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
