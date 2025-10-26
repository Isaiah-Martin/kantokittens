import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import passwordValidator from 'password-validator';
import React, { useCallback, useRef, useState } from 'react';
import { TextInput as RNTextInput, SafeAreaView, Text, View } from 'react-native';
import { Button, MD3LightTheme as DefaultTheme, TextInput as PaperTextInput } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { auth, firestore } from '../lib/firebase';
import { RootStackParamList } from '../navigation/RootStackParamList'; // Assuming your param list type
import { styles2 } from '../styles/css';
// Correctly define the screen props using NativeStackScreenProps
type UserInfoScreenProps = NativeStackScreenProps<RootStackParamList, 'UserInfoScreen'>;

export default function UserInfo({ navigation, route }: UserInfoScreenProps) {
  const { user, loading, login, logout } = useAuth(); // Assuming useAuth also provides a logout function
    const [name, setName] = useState<string>('');
    const [nameErr, setNameErr] = useState<string>('');
    const nameEl = useRef<RNTextInput | null>(null);
    const [password, setPassword] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const passwordEl = useRef<RNTextInput | null>(null);
    const [updateName, setUpdateName] = useState(false);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [inPost, setInPost] = useState(false);

    const theme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: '#D98CBF',
      },
    };

    useFocusEffect(
      useCallback(() => {
        backToInitial();
        if (user) {
          setName(user.name || ''); // Initialize name state from context user
        }
      }, [user]) // Re-run if user changes
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
    if (!user || inPost) return;

    setNameErr('');
    if (!name.trim()) {
      setNameErr("Please type your name, this field is required!");
      nameEl.current?.focus();
      return;
    }

    // Use the native SDK's auth() to get the current user
    const currentUser = auth().currentUser;
    if (!currentUser) {
      setNameErr("Not authenticated. Please log in again.");
      return;
    }
    
    setInPost(true);
    try {
      // Check for user.uid is a good practice, thoughcurrentUser.uid should be available
      if (!currentUser.uid) {
          throw new Error("User ID is missing.");
      }

      // Update Firebase Auth display name using the native SDK
      await currentUser.updateProfile({ displayName: name.trim() });
      
      // Update Firestore document using the native SDK
      const userDocRef = firestore().collection('users').doc(currentUser.uid);
      await userDocRef.update({ name: name.trim() });
      
      // There was a duplicate updateProfile call, so remove one.
      
      setUpdateName(false);
      
    } catch (error) {
      console.error("Error updating name:", error);
      setNameErr("Failed to update name. Please try again.");
    } finally {
      setInPost(false);
    }
  }

    async function submitPasswordUpdate() {
    if (!user || inPost) return;

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
      const currentUser = auth().currentUser;

      if (!currentUser) {
        throw new Error('Not authenticated. Please log in again.');
      }

      // Update Firebase Auth password using the native SDK's method
      await currentUser.updatePassword(password);
      
      setUpdatePassword(false); // Assuming this state controls the password update form visibility
    } catch (error: any) { // Use 'any' or check for FirebaseError for better type-checking
      console.error('Error updating password:', error);

      // Provide specific error messages to the user
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
      // Handle case where user is not logged in
      return <Text>User not logged in.</Text>;
    }

    return (
     <SafeAreaView style={styles2.container}>
       <View style={styles2.loginMain}>
         {/* Name Update Section */}
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

         {/* Password Update Section */}
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
