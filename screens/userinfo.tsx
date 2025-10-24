import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { updatePassword, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import passwordValidator from 'password-validator';
import React, { useCallback, useRef, useState } from 'react';
import { TextInput as RNTextInput, SafeAreaView, Text, View } from 'react-native';
import { Button, MD3LightTheme as DefaultTheme, TextInput as PaperTextInput } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../lib/firebase';
import { User } from '../lib/types'; // Import your User type
import { RootStackParamList } from '../navigation/RootStackParamList'; // Assuming your param list type
import { styles2 } from '../styles/css';

type UserInfoScreenProps = NativeStackScreenProps<RootStackParamList, 'UserInfo'>;

export default function UserInfo({ navigation }: { navigation: any}) {
    const { user, loading, login } = useAuth(); // Get user and login from context
    const [name, setName] = useState<string>('');
    const [nameErr, setNameErr] = useState<string>('');
    const nameEl = useRef<RNTextInput | null>(null);
    const [passwd, setPasswd] = useState('');
    const [passwdErr, setPasswdErr] = useState('');
    const passwdEl = useRef<RNTextInput | null>(null);
    const [updateName, setUpdateName] = useState(false);
    const [updatePasswd, setUpdatePasswd] = useState(false);
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
      setPasswd('');
      setPasswdErr('');
      setUpdateName(false);
      setUpdatePasswd(false);
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

      if (!auth.currentUser) {
        setNameErr("Not authenticated. Please log in again.");
        return;
      }
      
      setInPost(true);
      try {
        if (!auth.currentUser || !user.uid) { // <-- Explicitly check for user.uid
            throw new Error("Not authenticated or UID is missing.");
        }

        if (!user.uid) { // <-- Ensure UID is not empty
            throw new Error("User ID is missing.");
        }

        // Update Firebase Auth display name
        await updateProfile(auth.currentUser!, { displayName: name.trim() });
        
        // Update Firestore document
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { name: name.trim() });
        
        //  Update Firebase Auth display name
        await updateProfile(auth.currentUser, { displayName: name.trim() });

        // Update context with new user data
        const updatedUser = { ...user, name: name.trim() } as User;
        if(updatedUser.password){
          await login(updatedUser.name, updatedUser.password); // Assuming login function updates context user state
        }
        setUpdateName(false);
        
      } catch (error) {
        console.error("Error updating name:", error);
        setNameErr("Failed to update name. Please try again.");
      } finally {
        setInPost(false);
      }
    }

    async function submitPasswdUpdate() {
      if (!user || inPost) return;

      setPasswdErr('');
      if (!passwd) {
         setPasswdErr("Please type your password, this field is required!");
         passwdEl.current?.focus();
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

      if (!schema.validate(passwd)) {
          setPasswdErr("The password you typed is not secured enough. It must have both uppercase and lowercase letters and a minimum of 2 digits.");
          passwdEl.current?.focus();
          return;
      }
      
      setInPost(true);
      try {
        // Update Firebase Auth password
        await updatePassword(auth.currentUser!, passwd);
        setUpdatePasswd(false);
      } catch (error) {
        console.error("Error updating password:", error);
        setPasswdErr("Failed to update password. Please try again.");
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
         {!updatePasswd ? (
           <Button onPress={() => setUpdatePasswd(true)}>Update Password</Button>
         ) : (
           <View>
             <PaperTextInput
               label="New Password"
               value={passwd}
               onChangeText={setPasswd}
               secureTextEntry
               error={!!passwdErr}
               style={styles2.input}
               ref={passwdEl}
             />
             {!!passwdErr && <Text style={styles2.errorText}>{passwdErr}</Text>}
             <Button onPress={submitPasswdUpdate} disabled={inPost} loading={inPost}>Save</Button>
             <Button onPress={() => setUpdatePasswd(false)}>Cancel</Button>
           </View>
         )}
       </View>
     </SafeAreaView>
    );
}
