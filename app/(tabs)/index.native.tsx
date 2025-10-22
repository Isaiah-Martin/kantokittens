import ParallaxScrollView from "@../../components/parallax-scroll-view";
import { ThemedText } from '@../../components/themed-text';
import { ThemedView } from '@../../components/themed-view';
import kantoKittensImage from '@/assets/images/KantoKittens.png';
import axios from 'axios';
import { validate as validateAgent } from 'email-validator';
import { Image } from 'expo-image';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet
} from 'react-native';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { UserContext } from '../../components/Context';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { DOMAIN_URL } from '../../lib/constants';
import { User, UserContextType } from '../../lib/types';
import AsyncStorage from '../../node_modules/@react-native-async-storage/async-storage/src';
import { styles2 } from '../../styles/css';
import { useNavigation } from '../../utils/hooks';

export default function HomeScreen({ navigation }: { navigation: any}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState<User>({});
  const initialState = {
      email: '',
      password: ''
  };
  const [user, setUser] = useState(initialState);
  const [emailerr, setEmailErr] = useState('');
  const emailEl = useRef(null);
  const [passwderr, setPassWdErr] = useState('');
  const passwdEl = useRef(null);
  const [inPost, setInPost] = useState(false);

  const navigation2 = useNavigation();

  const login = (user?: User) => {
    if (user){
      setUserData(user);
      if (user.id){
        setLoggedIn(true);
      }
    }
  };
 
  const logout = () => {
    setLoggedIn(false);
    setUserData({});
  };
  
  const userContext: UserContextType = {
    isLoggedIn: loggedIn, 
    user: userData, 
    login: login, 
    logout: logout
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
       primary: '#D98CBF',
    }
   };
    
        // To get a specific color, access the `colors` property on the theme
        const primaryColor = theme.colors.primary;

  function changeEmail(text: string){
    const value = text.trim().replace(/<\/?[^>]*>/g, "");
    setUser(prevState => ({ ...prevState, email: value }));
  } 

  function changePasswd(text: string){
    const value = text.trim().replace(/<\/?[^>]*>/g, "");
    setUser(prevState => ({ ...prevState, password: value }));
  }
  
  function resetErrMsg(){
    setEmailErr('');
    setPassWdErr('');
  }

  async function submitForm(){
    //Reset all the err messages
    resetErrMsg();
    //Check if Email is filled
    if (!user.email){
       setEmailErr("Please type your email, this field is required!");
       (emailEl.current as any).focus();
       return;
    }
    //Validate the email
    if (!validateAgent(user.email)){
        setEmailErr("This email is not a legal email.");
        (emailEl.current as any).focus();
        return;
    }
    //Check if Passwd is filled
    if (!user.password){
        setPassWdErr("Please type your password, this field is required!");
        (passwdEl.current as any).focus();
        return;
    }

    setInPost(true);
    const data = null;
    try {
      const { data } = await axios.post(`${DOMAIN_URL}/api/login`, user);
      setInPost(false);

      if (data.no_account){
        setEmailErr("Sorry, we can't find this account.");
        (emailEl.current as any).focus();
        return;
      }
      if (data.password_error){
          setPassWdErr("Password error");
          (passwdEl.current as any).focus();
          return;
      }
      const {token, ...others} = data;

      const userData = {...others, logintime: Math.round(new Date().getTime() / 1000)};
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await SecureStore.setItemAsync('token', token);
      userContext.login(userData);
      setUser(initialState);
    } catch (error) {
      setInPost(false);
      console.error('API call failed:', error);
    }
  }

  function resetForm(){
    setUser(initialState);
    resetErrMsg();
  }

  useEffect(() => {
    async function fetchUserData() {
      const headers = { authorization: `Bearer ${await SecureStore.getItemAsync('token')}` };
      const { data } = await axios.get(`${DOMAIN_URL}/api/getselfdetail`, { headers: headers });
      const {token, ...others} = data;
      const userData = {...others, logintime: Math.round(new Date().getTime() / 1000)};
      setUserData(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await SecureStore.setItemAsync('token', token);
    }
    
    async function fetchData(){
       const user = await AsyncStorage.getItem('user');
       const userData = user ? JSON.parse(user): {};
       setUserData(userData);
       if (userData.id){
          setLoggedIn(true);
 
          const logintime = userData.logintime || 0;
          const currTime = Math.round(new Date().getTime() / 1000);
          if (currTime > (logintime + 60 * 60 * 24 * 10)){
             fetchUserData();
          }
       }
     }
     fetchData();
  },[]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#e7c8f7', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={kantoKittensImage}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.latoFont3}>Kanto Kittens</ThemedText>
      </ThemedView>
      
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle" style={styles.latoFont}>A Curated Cat Lounge on the Upper East Side</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.latoFont2}>
          Warm cafe where Filipino-inspired drinks and small plates meet a serene cat lounge filled with adoptable rescue cats.
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.latoFont2}>
          Savor thoughtfully sourced flavors, discover artisanal merchandise, and leave with a deeper connection to community and animals.
          </ThemedText>
        </ThemedView>
          
      <ThemedView style={styles.rowContainer}>
        <ThemedView style={styles.stepContainer}>
          <ThemedView style={styles2.statsBanner}>
            <ThemedText type="subtitle" style={styles.latoFont}><IconSymbol size={28} name="cat.circle.fill" color={'black'}></IconSymbol></ThemedText>
            <ThemedText type="subtitle" style={styles.latoFont}>Cozy with Cats</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedView style={styles2.statsBanner}>
            <ThemedText type="subtitle" style={styles.latoFont}><IconSymbol size={28} name="0.square" color={'black'}></IconSymbol></ThemedText>
            <ThemedText type="subtitle" style={styles.latoFont}>Cafe Setting</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedView style={styles2.statsBanner}>
            <ThemedText type="subtitle" style={styles.latoFont}><IconSymbol size={28} name="0.circle" color={'black'}></IconSymbol></ThemedText>
            <ThemedText type="subtitle" style={styles.latoFont}>Community</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
        <UserContext.Provider value={userContext}>
        </UserContext.Provider>
        </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1, // Allows the container to take full height
  },
  latoFont: {
    fontFamily: 'Lato',
    fontSize: 20
  },
  latoFont2: {
    fontFamily: 'Lato',
    fontSize: 20,
    fontWeight: 'light'
  },
  latoFont3: {
    fontFamily: 'Georgia',
    fontSize: 24
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
