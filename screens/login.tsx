import { NativeStackScreenProps } from '@react-navigation/native-stack';
import validator from 'email-validator';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { ActivityIndicator, Button, MD3LightTheme, TextInput } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { secureLogin } from '../lib/firestore';
import { RootStackParamList } from '../navigation/RootStackParamList'; // Assuming this file exists and is correctly defined
import { styles2 } from '../styles/css';

// Define the component's props using NativeStackScreenProps
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwdErr, setPassWdErr] = useState('');
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
    setPassWdErr('');
    setInPost(true);

    if (!validator.validate(email)) {
      setEmailErr('Please provide a valid email');
      setInPost(false);
      return;
    }

    if (!password) {
      setPassWdErr('Password cannot be empty');
      setInPost(false);
      return;
    }

    try {
      const firestoreUser = await secureLogin(user.email, user.password);
    } catch (error) {
      console.error(error);
      setPassWdErr('Invalid email or password');
    } finally {
      setInPost(false);
    }
  };

  function resetErrMsg(){
    setEmailErr('');
    setPassWdErr('');
  }

  function resetForm(){
    setUser(initialState);
    resetErrMsg();
  }

  return (
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
             <Text style={{color: primaryColor}}>{emailErr}</Text> 
             <TextInput
               mode='outlined'
               label='Password'
               placeholder='Password'
               secureTextEntry={true}
               value={user.password}
               onChangeText={text => changePasswd(text)}
               ref={passwdEl}
              />
             <Text style={{color: primaryColor}}>{passwdErr}</Text> 
             <View style={styles2.itemCenter}>
                <Button mode="text" uppercase={false} onPress={() => navigation.navigate('ForgotPasswd', {userEmail: user.email})}>
                   Forgot Password?
                 </Button>
              </View>
              <View style={[styles2.itemLeft, {marginTop: 15}]}>
                 <Button mode="contained" style={{marginRight: 20, backgroundColor: primaryColor}} onPress={() => handleLogin()}>
                   Log In
                 </Button>
                 <Button mode="contained" style={{marginRight: 20, backgroundColor: primaryColor}} onPress={() => resetForm()}>
                   Reset
                 </Button>
                 <Button mode="outlined" style={{marginRight: 20, backgroundColor: primaryColor}} onPress={() => navigation.navigate('UserJoin')}>
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
  );
}