import validator from 'email-validator'; // Assuming you have an email validator
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { addUser } from '~/lib/firestore';
import { useFirebase } from '../../context/FirebaseContext';
import { User } from '../../navigation/types'; // Import the User type
import { styles2 } from '../../styles/css'; // Assuming styles are exported

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
  const [errorMsg, setErrorMsg] = useState(''); // Consolidated error message state
  const [inPost, setInPost] = useState(false);

  // Helper to update user state dynamically
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
      const userCredential = await auth.createUserWithEmailAndPassword(user.email, user.password);
      
      const newUser: User = {
        uid: userCredential.user.uid,
        name: user.name,
        email: user.email,
        // Add other required fields from your User type here if needed
      };
      
      await addUser(firestore, newUser);

      // AuthContext listener in the layout will handle the navigation to /(app)
      
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg('That email address is invalid!');
      } else {
        setErrorMsg(error.message || 'An error occurred during sign up.');
      }
    } finally {
      // Set inPost to false in finally block to ensure loading state finishes
      setInPost(false); 
    }
  }

  function resetForm() {
    setUser({ name: '', email: '', password: '' });
    setPassWd2('');
    resetErrMsg();
  }
  
  // Use inPost state to disable fields while loading
  const isUIDisabled = inPost;

  return (
    <SafeAreaView style={styles2.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles2.container}>
        <ScrollView contentContainerStyle={styles2.container}>
          {/* Removed empty View style={styles2.loginMain} */}
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

            {/* Display combined error message */}
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
