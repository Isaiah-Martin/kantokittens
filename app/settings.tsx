import { useFocusEffect, useRouter } from 'expo-router';
import passwordValidator from 'password-validator';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { TextInput as RNTextInput, SafeAreaView, Text, View } from 'react-native';
import { Button, TextInput as PaperTextInput, useTheme } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { useFirebase } from '../context/FirebaseContext';
import { styles2 } from '../styles/css';

export default function Settings() {
  const router = useRouter();
  const { user, login, logout } = useContext(AuthContext); // Get from AuthContext
  const { auth, firestore } = useFirebase(); // Get from FirebaseContext

  const [name, setName] = useState<string>('');
  const [nameErr, setNameErr] = useState<string>('');
  const nameEl = useRef<RNTextInput | null>(null);
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const passwordEl = useRef<RNTextInput | null>(null);
  const [updateName, setUpdateName] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [inPost, setInPost] = useState(false);

  const theme = useTheme();
  const primaryColor = theme.colors.primary;

  useFocusEffect(
    useCallback(() => {
      backToInitial();
      if (user) {
        setName(user.name || '');
      }
    }, [user])
  );

  function backToInitial() {
    setName('');
    setNameErr('');
    setPassword('');
    setPasswordErr('');
    setUpdateName(false);
    setUpdatePassword(false);
    setInPost(false);
  }

  async function submitNameUpdate() {
    if (!user || !auth || !firestore || inPost) return;

    setNameErr('');
    if (!name.trim()) {
      setNameErr("Please type your name, this field is required!");
      nameEl.current?.focus();
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setNameErr("Not authenticated. Please log in again.");
      return;
    }

    setInPost(true);
    try {
      if (!currentUser.uid) {
        throw new Error("User ID is missing.");
      }

      await currentUser.updateProfile({ displayName: name.trim() });
      const userDocRef = firestore.collection('users').doc(currentUser.uid);
      await userDocRef.update({ name: name.trim() });
      setUpdateName(false);
    } catch (error) {
      console.error("Error updating name:", error);
      setNameErr("Failed to update name. Please try again.");
    } finally {
      setInPost(false);
    }
  }

  async function submitPasswordUpdate() {
    if (!user || !auth || inPost) return;

    setPasswordErr('');
    if (!password) {
      setPasswordErr("Please type your password, this field is required!");
      passwordEl.current?.focus();
      return;
    }

    let schema = new passwordValidator();
    schema
      .is().min(8)
      .is().max(100)
      .has().uppercase()
      .has().lowercase()
      .has().digits(2)
      .has().not().spaces();

    if (!schema.validate(password)) {
      setPasswordErr("The password you typed is not secured enough. It must have both uppercase and lowercase letters and a minimum of 2 digits.");
      passwordEl.current?.focus();
      return;
    }

    setInPost(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Not authenticated. Please log in again.');
      }
      await currentUser.updatePassword(password);
      setUpdatePassword(false);
    } catch (error: any) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/requires-recent-login') {
        setPasswordErr('This operation requires recent authentication. Please log out and log back in before changing your password.');
      } else {
        setPasswordErr('Failed to update password. Please try again.');
      }
    } finally {
      setInPost(false);
    }
  }

  if (!user) {
    return <Text>User not logged in.</Text>;
  }

  return (
    <SafeAreaView style={styles2.container}>
      <View style={styles2.loginMain}>
        <Text>Current Name: {user.name}</Text>
        {!updateName ? (
          <Button onPress={() => setUpdateName(true)}>Update Name</Button>
        ) : (
          <View>
            <PaperTextInput
              label="New Name"
              value={name}
              onChangeText={setName}
              error={!!nameErr}
              style={styles2.input}
              ref={nameEl}
            />
            {!!nameErr && <Text style={styles2.errorText}>{nameErr}</Text>}
            <Button onPress={submitNameUpdate} disabled={inPost} loading={inPost}>Save</Button>
            <Button onPress={() => setUpdateName(false)}>Cancel</Button>
          </View>
        )}
        {!updatePassword ? (
          <Button onPress={() => setUpdatePassword(true)}>Update Password</Button>
        ) : (
          <View>
            <PaperTextInput
              label="New Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={!!passwordErr}
              style={styles2.input}
              ref={passwordEl}
            />
            {!!passwordErr && <Text style={styles2.errorText}>{passwordErr}</Text>}
            <Button onPress={submitPasswordUpdate} disabled={inPost} loading={inPost}>Save</Button>
            <Button onPress={() => setUpdatePassword(false)}>Cancel</Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
