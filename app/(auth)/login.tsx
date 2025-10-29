import ParallaxScrollView from '@/components/parallax-scroll-view'; // Assuming this component exists
import validator from 'email-validator'; // Assuming you have an email validator
import { Href, useRouter } from 'expo-router';
import { useContext, useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Text as RNText, TextInput as RNTextInput, SafeAreaView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, TextInput, useTheme } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { styles2 } from '../../styles/css'; // Assuming styles are exported

export default function Login() {
  const router = useRouter();
  const { login, loading } = useContext(AuthContext); // Use useContext for login and loading
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwdErr, setPasswdErr] = useState('');
  const [inPost, setInPost] = useState(false);
  const emailEl = useRef<RNTextInput | null>(null);
  const passwdEl = useRef<RNTextInput | null>(null);

  const theme = useTheme(); // Use useTheme hook for theme access
  const primaryColor = theme.colors.primary;

  function changeEmail(text: string) {
    const value = text.trim();
    setEmail(value);
  }

  function changePasswd(text: string) {
    const value = text.trim();
    setPassword(value);
  }

  const handleLogin = async () => {
    setEmailErr('');
    setPasswdErr('');
    setInPost(true);

    if (!validator.validate(email)) {
      setEmailErr('Please provide a valid email');
      setInPost(false);
      return;
    }

    if (!password) {
      setPasswdErr('Password cannot be empty');
      setInPost(false);
      return;
    }

    try {
      await login(email, password);
    } catch (error: any) {
      setInPost(false);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        setEmailErr('Incorrect email or password.');
        emailEl.current?.focus();
      } else if (error.code === 'auth/wrong-password') {
        setPasswdErr('Incorrect password.');
        passwdEl.current?.focus();
      } else if (error.message.includes('Network error')) {
        setEmailErr('Network error. Please check your connection.');
      } else {
        Alert.alert('Login Failed', error.message);
      }
    }
  };

  function resetForm() {
    setEmail('');
    setPassword('');
    setEmailErr('');
    setPasswdErr('');
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#e7c8f7', dark: '#1D3D47' }}
      headerImage={<Image source={require('@/assets/images/KantoKittensCover.png')} style={styles.reactLogo} />}>
      <SafeAreaView style={styles2.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles2.container}>
          <View style={styles2.mainContainer}>
            <View style={styles2.itemCenter}>
              <RNText style={styles2.titleText}>Please Login</RNText>
            </View>
            <TextInput
              mode="outlined"
              label="Email"
              placeholder="Email"
              value={email}
              onChangeText={changeEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              ref={emailEl}
            />
            <RNText style={{ color: 'red' }}>{emailErr}</RNText>
            <TextInput
              mode="outlined"
              label="Password"
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={changePasswd}
              ref={passwdEl}
            />
            <RNText style={{ color: 'red' }}>{passwdErr}</RNText>
            <View style={styles2.itemCenter}>
              <Button
                mode="text"
                uppercase={false}
                onPress={() => router.push('/(auth)/forgotpassword' as Href)}
              >
                Forgot Password?
              </Button>
            </View>
            <View style={[styles2.itemLeft]}>
              <Button
                mode="contained"
                style={[styles.button]}
                onPress={handleLogin}
              >
                Log In
              </Button>
              <Button
                mode="contained"
                style={[styles.button]}
                onPress={resetForm}
              >
                Reset
              </Button>
              <Button
                mode="outlined"
                style={[styles.button]}
                onPress={() => router.push('/(auth)/signup' as Href)}
              >
                Sign Up
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
        {inPost && (
          <View style={styles2.loading}>
            <ActivityIndicator size="large" animating={true} color={primaryColor} />
          </View>
        )}
      </SafeAreaView>
    </ParallaxScrollView>
  );
}
const styles = StyleSheet.create({
  reactLogo: {
    // Example: set a fixed aspect ratio and a flexible width
    width: '100%', // 80% of screen width
    height: '100%',
    aspectRatio: 1, // Assumes a square image
    // If you need a specific ratio, e.g., 16:9, use: aspectRatio: 16 / 9,
  },
  button: {
    backgroundColor: 'black'
  },
  buttonText: {
    color: '#D98CBF',
    tintColor: '#D98CBF'
  }
});