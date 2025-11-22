// app/(auth)/login.tsx (Layout Fix Applied)

import ParallaxScrollView from '@/components/parallax-scroll-view';
import validator from 'email-validator';
import { Href, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper';
// SafeAreaView is fine, but we will use minimal styles on the View below
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
// styles2 import is currently unused in this version
// import { styles2 } from '../../styles/css';


export default function Login() {
    const router = useRouter();
    const { login, loading } = useContext(AuthContext); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const theme = useTheme();
    const primaryColor = theme.colors.primary;

    const handleLogin = async () => {
        setErrorMsg(''); 

        if (!validator.validate(email)) {
            setErrorMsg('Please provide a valid email');
            return;
        }

        if (!password) {
            setErrorMsg('Password cannot be empty');
            return;
        }
        
        try {
            await login(email, password);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email') {
                setErrorMsg('Incorrect email or password.');
            } else if (error.message.includes('Network error')) {
                setErrorMsg('Network error. Please check your connection.');
            } else {
                setErrorMsg('Login failed: ' + error.message);
            }
        }
    };

    function resetForm() {
        setEmail('');
        setPassword('');
        setErrorMsg('');
    }

    const isUIDisabled = loading;
    
    console.log("Rendering Login screen."); 

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#e7c8f7', dark: '#1D3D47' }}
            headerImage={<Image source={require('@/assets/images/KantoKittensCover.png')} style={styles.reactLogo} />}
        >
            {/* Using simple inline styles to avoid external CSS conflicts */}
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View style={{ gap: 16 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text>Please Login</Text>
                        </View>
                        <TextInput
                            mode="outlined"
                            label="Email"
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoComplete="email"
                            keyboardType="email-address"
                            disabled={isUIDisabled}
                        />
                        <TextInput
                            mode="outlined"
                            label="Password"
                            placeholder="Password"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                            style={{marginTop: 10}}
                            disabled={isUIDisabled}
                        />

                        {!!errorMsg && <Text style={{ color: 'red', marginTop: 10 }}>{errorMsg}</Text>}
                        
                        <View style={{ alignItems: 'center' }}>
                            <Button
                                mode="text"
                                uppercase={false}
                                onPress={() => router.push('/(auth)/forgotpassword' as Href)}
                                disabled={isUIDisabled}
                            >
                                Forgot Password?
                            </Button>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                            <Button
                                mode="contained"
                                style={[styles.button]}
                                onPress={handleLogin}
                                disabled={isUIDisabled}
                                loading={isUIDisabled}
                            >
                                Log In
                            </Button>
                            <Button
                                mode="contained"
                                style={[styles.button]}
                                onPress={resetForm}
                                disabled={isUIDisabled}
                            >
                                Reset
                            </Button>
                            <Button
                                mode="outlined"
                                style={[styles.button]}
                                onPress={() => router.push('/(auth)/signup' as Href)}
                                disabled={isUIDisabled}
                            >
                                Sign Up
                            </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                {isUIDisabled && (
                  <View style={{ /* simple loading styles if needed */ }}>
                      <ActivityIndicator size="large" animating={true} color={primaryColor} />
                  </View>
                )}
            </SafeAreaView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    reactLogo: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    button: {
        backgroundColor: 'black',
        // marginTop removed, using gap/margin on parent view
    },
    buttonText: {
        color: '#D98CBF',
        tintColor: '#D98CBF'
    }
});
