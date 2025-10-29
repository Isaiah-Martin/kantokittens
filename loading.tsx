// screens/LoadingScreen.tsx
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { ThemedText } from './components/themed-text'; // Assuming this path is correct
import { ThemedView } from './components/themed-view'; // Assuming this path is correct

export default function LoadingScreen() {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('./assets/images/KantoKittensCover.png')} // Use a stable relative path
        style={styles.logo}
        contentFit="contain"
      />
      <View style={styles.textContainer}>
        <ThemedText type="title" style={styles.titleText}>
          Kanto Kittens
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitleText}>
          Loading...
        </ThemedText>
      </View>
      <ActivityIndicator animating={true} size="large" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container fills the entire screen
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20, // Provides spacing between the main elements
    // Set an explicit background color that matches your app's theme.
    // This is the most critical step to prevent a white flash.
    // If your ThemedView handles this, ensure it's not transparent by default.
  },
  logo: {
    height: 178,
    width: 290,
  },
  textContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Georgia', // For this to work without flicker, 'Georgia' must be pre-loaded
    fontSize: 24,
  },
  subtitleText: {
    fontFamily: 'Georgia',
    fontSize: 18,
    // fontWeight 'light' is not a standard value on all platforms.
    // For consistency, use string values like '300' or rely on the font file itself.
    fontWeight: '300',
    marginTop: 5,
  },
});
