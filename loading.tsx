// screens/LoadingScreen.tsx
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper'; // Import ActivityIndicator from react-native-paper
import { ThemedText } from './components/themed-text'; // Adjust import path if needed
import { ThemedView } from './components/themed-view'; // Adjust import path if needed
import { styles2 } from './styles/css'; // Assuming this path is correct

export default function LoadingScreen() {
  return (
    <ThemedView style={[styles2.container, styles.loadingContainer]}>
      <Image
        source={require('../assets/images/KantoKittens.png')} // Corrected relative path
        style={styles.logo}
        contentFit="contain"
      />
      <View style={styles.textContainer}>
        <ThemedText type="title" style={styles.titleText}>Kanto Kittens</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitleText}>Loading....</ThemedText>
      </View>
      <ActivityIndicator size="large" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20, // Add spacing between elements
  },
  logo: {
    height: 178,
    width: 290,
  },
  textContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Georgia', // Ensure font is correct
    fontSize: 24,
  },
  subtitleText: {
    fontFamily: 'Georgia', // Ensure font is correct
    fontSize: 18,
    fontWeight: 'light',
    marginTop: 5,
  },
});
