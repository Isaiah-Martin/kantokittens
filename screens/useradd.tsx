import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from 'react-native';
import { ActivityIndicator, Button, MD3LightTheme as DefaultTheme, TextInput } from 'react-native-paper';
import { auth } from '../lib/firebase';
import { addUser } from '../lib/firestore';
import { RootStackParamList } from '../lib/types'; // Assuming this file exists and is correctly defined
import { styles2 } from '../styles/css';

// Use the component's own props type
export type UserJoinScreenProps = NativeStackScreenProps<RootStackParamList, 'UserJoinScreen'>;

export default function UserJoinScreen({ navigation, route }: UserJoinScreenProps) {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [password2, setPassWd2] = useState('');
  const [nameerr, setNameErr] = useState('');
  const [emailerr, setEmailErr] = useState('');
  const [passwderr, setPassWdErr] = useState('');
  const [inPost, setInPost] = useState(false);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#D98CBF',
    },
  };
  
  const primaryColor = theme.colors.primary;

  function changeName(text: string){
    setUser(prevState => ({ ...prevState, name: text }));
  } 

  function changeEmail(text: string){
    setUser(prevState => ({ ...prevState, email: text }));
  } 
  
  function changePasswd(text: string){
    setUser(prevState => ({ ...prevState, password: text }));
  }

  function changePasswd2(text: string){
    setPassWd2(text);
  }

  function resetErrMsg(){
    setNameErr('');
    setEmailErr('');
    setPassWdErr('');
  }

  async function submitForm(){
    resetErrMsg();
    if (!user.name.trim()){
      setNameErr("Please type your name, this field is required!");
      return;
    }
    if (!user.email){
      setEmailErr("Please type your email, this field is required!");
      return;
    }
    if (user.password !== password2){
      setPassWdErr("Passwords do not match!");
      return;
    }

    setInPost(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      await addUser({ name: user.name, email: user.email });
      setInPost(false);
      navigation.navigate('Login');
    } catch (error) {
      setInPost(false);
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          setEmailErr('That email address is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          setEmailErr('That email address is invalid!');
        } else {
          setPassWdErr(error.message)
        }
      } else {
        setPassWdErr('An unexpected error occurred.');
      }
    }
  }

  function resetForm(){
    setUser({ name: '', email: '', password: '' });
    setPassWd2('');
    resetErrMsg();
  }

  return (
    <SafeAreaView style={styles2.container}>
      <KeyboardAvoidingView  
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles2.container}>
            <ScrollView contentContainerStyle={styles2.container}>
          <View style={styles2.loginMain}></View>
          <View style={styles2.mainContainer}>
             <View style={styles2.itemCenter}>
                <Text style={styles2.titleText}>Join to Place Booking</Text>
             </View>
             <TextInput
               mode='outlined'
               label="Name"
               placeholder="Name*"
               value={user.name}
               onChangeText={text => changeName(text)}
              />
             <Text style={{color: 'red'}}>{nameerr}</Text> 
             <TextInput
               mode='outlined'
               label="Email"
               placeholder="Email*"
               value={user.email}
               onChangeText={text => changeEmail(text)}
               autoCapitalize="none"
               autoComplete="email"
               keyboardType="email-address"
              />
             <Text style={{color: 'red'}}>{emailerr}</Text> 
             <TextInput
               mode='outlined'
               label='Password'
               placeholder='Password*'
               secureTextEntry={true}
               value={user.password}
               onChangeText={text => changePasswd(text)}
              />
             <Text style={{color: 'red'}}>{passwderr}</Text> 
             <TextInput
               mode='outlined'
               label='Please type password again'
               placeholder='Please type password again*'
               secureTextEntry={true}
               value={password2}
               onChangeText={text => changePasswd2(text)}
              />
              <View style={[styles2.itemLeft, {marginTop: 20}]}>
                 <Button mode="contained" style={{marginRight: 20}} onPress={() => submitForm()}>
                  Sign Up
                 </Button>
                 <Button mode="contained" style={{marginRight: 20}} onPress={() => resetForm()}>
                   Reset
                 </Button>
                 <Button mode="outlined" style={{marginRight: 20}} onPress={() => navigation.navigate('Login')}>
                  Log In
                 </Button>
              </View>
          </View>
           </ScrollView>
      </KeyboardAvoidingView>
      {inPost &&
        <View style={styles2.loading}>
          <ActivityIndicator size="large" animating={true} color={primaryColor} />
        </View>
      }
    </SafeAreaView>
  );

}