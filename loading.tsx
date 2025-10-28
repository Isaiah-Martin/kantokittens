// screens/LoadingScreen.tsx
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { styles2 } from './styles/css';

export default function LoadingScreen() {
  return (
    <ParallaxScrollView
          headerBackgroundColor={{ light: '#e7c8f7', dark: '#1D3D47' }}
          headerImage={
            <Image
              source={require('./assets/images/KantoKittens.png')}
              style={styles.reactLogo}
            />
          }>
          <ThemedView style={styles2.container}>
            <ThemedText type="title" style={styles.latoFont3}>Kanto Kittens</ThemedText>
            <ThemedText type="subtitle" style={styles.latoFont3}>Loading....</ThemedText>
          </ThemedView>
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
    width: 1
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
    padding: 0,
    margin: 0,
  },
});
