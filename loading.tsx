// screens/LoadingScreen.tsx
import { Image as ExpoImage } from 'expo-image';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { ThemedText } from './components/themed-text';
import { ThemedView } from './components/themed-view';

const AnimatedExpoImage = Animated.createAnimatedComponent(ExpoImage);

const ROTATION_DURATION = 1000; // 1 second for a full rotation

export default function LoadingScreen() {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: ROTATION_DURATION,
        easing: Easing.linear,
      }),
      -1, // -1 means infinite repeats
      false, // false means it will not reverse the animation
    );
  }, []);

  return (
    <ThemedView style={styles.container}>
      {/* 
        Using AnimatedExpoImage, which combines reanimated and expo-image.
      */}
      <AnimatedExpoImage
        source={require('./assets/images/KantoKittensCover.png')}
        style={[styles.logo, animatedStyle]}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#ffffff',
  },
  logo: {
    height: 178,
    width: 290,
  },
  textContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Georgia',
    fontSize: 24,
  },
  subtitleText: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '300',
    marginTop: 5,
  },
});
