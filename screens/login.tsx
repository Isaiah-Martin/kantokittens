import ParallaxScrollView from '@/components/parallax-scroll-view';
import { secureLogin } from '@/lib/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import validator from 'email-validator';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { ActivityIndicator, Button, MD3LightTheme, TextInput } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { AuthStackParamList } from '../navigation/RootStackParamList'; // Update the import path
import { styles2 } from '../styles/css';
const { width: screenWidth } = Dimensions.get('window');

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function Login({ route, navigation }: LoginScreenProps) {
 const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwdErr, setPasswdErr] = useState('');
  const [inPost, setInPost] = useState(false);
  const emailEl = useRef<RNTextInput | null>(null);
  const passwdEl = useRef<RNTextInput | null>(null);
  const initialState = {
      email: '',
      password: ''
  };
  const [user, setUser] = useState(initialState);

  function changeEmail(text: string){
    const value = text.trim().replace(/<\/?[^>]*>/g, "");
    setUser(prevState => ({ ...prevState, email: value }));
  } 

  function changePasswd(text: string){
    const value = text.trim().replace(/<\/?[^>]*>/g, "");
    setUser(prevState => ({ ...prevState, password: value }));
  }

  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#D98CBF',
    },
  };

  // To get a specific color, access the `colors` property on the theme
  const primaryColor = theme.colors.primary;
  
  const handleLogin = async () => {
    setEmailErr('');
    setPasswdErr('');
    setInPost(true);

    if (!validator.validate(user.email)) {
      setEmailErr('Please provide a valid email');
      setInPost(false);
      return;
    }

    if (!user.password) {
      setPasswdErr('Password cannot be empty');
      setInPost(false);
      return;
    }
 
    try {
      // Call the login function from the AuthContext with local state variables
      await secureLogin(user.email,user.password); 
      // The AuthContext will handle state updates and the AppNavigator will handle navigation automatically
    } catch (error: any) {
    setInPost(false);
    if (error.message.includes('account')) {
        setEmailErr(error.message);
        emailEl.current?.focus();
    } else if (error.message.includes('password')) {
        setPasswdErr(error.message);
        passwdEl.current?.focus();
    } else if (error.message.includes('Network error')) {
        // Display a network-specific error message
        setEmailErr(error.message);
    } else {
        console.error('Login failed:', error);
    }
  };}

  function resetErrMsg(){
    setEmailErr('');
    setPasswdErr('');
  }

  function resetForm(){
    setUser(initialState);
    resetErrMsg();
  }

  return (
    <ParallaxScrollView
          headerBackgroundColor={{ light: '#e7c8f7', dark: '#1D3D47' }}
          headerImage={<Image source={require('@/assets/images/KantoKittens.png')} style={styles.reactLogo} />}>
          <SafeAreaView style={styles2.container}>
      <KeyboardAvoidingView  
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles2.container}>
          <View style={styles2.mainContainer}>
             <View style={styles2.itemCenter}>
                <Text style={styles2.titleText}>Please Login</Text>
             </View>
             <TextInput
               mode='outlined'
               label="Email"
               placeholder="Email"
               value={user.email}
               onChangeText={text => changeEmail(text)}
               autoCapitalize="none"
               autoComplete="email"
               keyboardType="email-address"
               ref={emailEl}
              />
             <Text style={{color: 'white'}}>{emailErr}</Text> 
             <TextInput
               mode='outlined'
               label='Password'
               placeholder='Password'
               secureTextEntry={true}
               value={user.password}
               onChangeText={text => changePasswd(text)}
               ref={passwdEl}
              />
             <Text style={{color: 'white'}}>{passwdErr}</Text> 
             <View style={styles2.itemCenter}>
                <Button mode="text" uppercase={false} onPress={() => {if (user && user.email) {navigation.navigate('ForgotPassword', { userEmail: user.email });} else {navigation.navigate('ForgotPassword'); }}}>
                   Forgot Password?
                 </Button>
              </View>
              <View style={[styles2.itemLeft]}>
                 <Button mode="contained" style={[ styles.button ]} labelStyle={styles.buttonText} onPress={() => handleLogin()}>
                   Log In
                 </Button>
                 <Button mode="contained" style={[ styles.button ]} labelStyle={styles.buttonText} onPress={() => resetForm()}>
                   Reset
                 </Button>
                 <Button mode="outlined" style={[ styles.button ]} labelStyle={styles.buttonText}onPress={() => navigation.navigate('UserJoin')}>
                   Sign Up
                 </Button>
              </View>
          </View>
      </KeyboardAvoidingView>
      {inPost &&
        <View style={styles2.loading}>
          <ActivityIndicator size="large" animating={true} color={primaryColor} />
        </View>
      }
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