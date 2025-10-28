import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text as RNText,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import { ActivityIndicator, Button, TextInput, useTheme } from 'react-native-paper';
import { useFirebase } from '../../context/FirebaseContext';
import { addUser } from '../../lib/firestore'; // Assuming this has been updated
import { User } from '../../navigation/types'; // Import the User type
import { styles2 } from '../../styles/css'; // Assuming styles are exported

export default function SignUp() {
  const router = useRouter();
  const { auth, firestore } = useFirebase();
  const theme = useTheme();
  const primaryColor = theme.colors.primary;

  const [user, setUser] = useState<Omit<User, 'uid' | 'email'> & { email: string, password: string }>({
    name: '',
    email: '',
    password: '',
  });
  const [password2, setPassWd2] = useState('');
  const [nameerr, setNameErr] = useState('');
  const [emailerr, setEmailErr] = useState('');
  const [passwderr, setPassWdErr] = useState('');
  const [inPost, setInPost] = useState(false);

  function changeName(text: string) {
    setUser((prevState) => ({ ...prevState, name: text }));
  }

  function changeEmail(text: string) {
    setUser((prevState) => ({ ...prevState, email: text }));
  }

  function changePasswd(text: string) {
    setUser((prevState) => ({ ...prevState, password: text }));
  }

  function changePasswd2(text: string) {
    setPassWd2(text);
  }

  function resetErrMsg() {
    setNameErr('');
    setEmailErr('');
    setPassWdErr('');
  }

async function submitForm() {
    resetErrMsg();
    if (user.name != undefined && !user.name.trim()) {
      setNameErr('Please type your name, this field is required!');
      return;
    }
    if (!user.email) {
      setEmailErr('Please type your email, this field is required!');
      return;
    }
    if (user.password !== password2) {
      setPassWdErr('Passwords do not match!');
      return;
    }
    if (!auth || !firestore) {
      // Handle case where Firebase is not yet initialized
      return;
    }

    setInPost(true);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(user.email, user.password);
      const newUser: User = {
        uid: userCredential.user.uid,
        name: user.name,
        email: user.email,
      };
      await addUser(firestore, newUser);

      setInPost(false);
      // Cast the path string to Href to resolve the type error
      router.replace('/(app)' as Href); 
    } catch (error: any) {
      setInPost(false);
      if (error.code === 'auth/email-already-in-use') {
        setEmailErr('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        setEmailErr('That email address is invalid!');
      } else {
        setPassWdErr(error.message);
      }
    }
  }

  function resetForm() {
    setUser({ name: '', email: '', password: '' });
    setPassWd2('');
    resetErrMsg();
  }

  return (
    <SafeAreaView style={styles2.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles2.container}>
        <ScrollView contentContainerStyle={styles2.container}>
          <View style={styles2.loginMain}></View>
          <View style={styles2.mainContainer}>
            <View style={styles2.itemCenter}>
              <RNText style={styles2.titleText}>Join to Place Booking</RNText>
            </View>
            <TextInput
              mode="outlined"
              label="Name"
              placeholder="Name*"
              value={user.name}
              onChangeText={changeName}
            />
            <RNText style={{ color: 'red' }}>{nameerr}</RNText>
            <TextInput
              mode="outlined"
              label="Email"
              placeholder="Email*"
              value={user.email}
              onChangeText={changeEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
            />
            <RNText style={{ color: 'red' }}>{emailerr}</RNText>
            <TextInput
              mode="outlined"
              label="Password"
              placeholder="Password*"
              secureTextEntry={true}
              value={user.password}
              onChangeText={changePasswd}
            />
            <RNText style={{ color: 'red' }}>{passwderr}</RNText>
            <TextInput
              mode="outlined"
              label="Please type password again"
              placeholder="Please type password again*"
              secureTextEntry={true}
              value={password2}
              onChangeText={changePasswd2}
            />
            <View style={[styles2.itemLeft, { marginTop: 20 }]}>
              <Button mode="contained" style={{ marginRight: 20 }} onPress={submitForm}>
                Sign Up
              </Button>
              <Button mode="contained" style={{ marginRight: 20 }} onPress={resetForm}>
                Reset
              </Button>
              <Button
                mode="outlined"
                style={{ marginRight: 20 }}
                onPress={() => router.replace('/(auth)/login' as Href)}
              >
                Log In
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {inPost && (
        <View style={styles2.loading}>
          <ActivityIndicator size="large" animating={true} color={primaryColor} />
        </View>
      )}
    </SafeAreaView>
  );
}
