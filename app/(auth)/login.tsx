import ParallaxScrollView from '@/components/parallax-scroll-view';
import validator from 'email-validator';
import { Href, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { styles2 } from '../../styles/css'; // Assuming styles are exported
// import { useFirebase } from '../../context/FirebaseContext'; // Removed this import; it's handled by AuthContext

export default function Login() {
    const router = useRouter();
    // Destructure login directly from AuthContext; it's guaranteed to be a function there
    const { login, loading } = useContext(AuthContext); 
    // const { auth } = useFirebase(); // No longer needed here
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
        
        // Removed the check for !auth and !login function, as we rely on AuthContext
        // to provide a reliable 'login' function definition.

        try {
            // This calls the guaranteed functional 'login' function from AuthContext
            await login(email, password);
        } catch (error: any) {
            // ... (rest of error handling is fine) ...
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

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#e7c8f7', dark: '#1D3D47' }}
            headerImage={<Image source={require('@/assets/images/KantoKittensCover.png')} style={styles.reactLogo} />}
        >
            <SafeAreaView style={styles2.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles2.container}
                >
                    <View style={styles2.mainContainer}>
                        <View style={styles2.itemCenter}>
                            <Text style={styles2.titleText}>Please Login</Text>
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
                            disabled={isUIDisabled}
                            style={{marginTop: 10}}
                        />

                        {!!errorMsg && <Text style={{ color: 'red', marginTop: 10 }}>{errorMsg}</Text>}
                        
                        <View style={styles2.itemCenter}>
                            <Button
                                mode="text"
                                uppercase={false}
                                onPress={() => router.push('/(auth)/forgotpassword' as Href)}
                                disabled={isUIDisabled}
                            >
                                Forgot Password?
                            </Button>
                        </View>
                        <View style={[styles2.itemLeft]}>
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
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    button: {
        backgroundColor: 'black',
        marginTop: 10,
    },
    buttonText: {
        color: '#D98CBF',
        tintColor: '#D98CBF'
    }
});
