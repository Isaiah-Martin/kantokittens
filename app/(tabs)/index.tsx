import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import React from 'react';
import {
  StyleSheet
} from 'react-native';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { AuthProvider, useAuth } from '../../context/AuthContext'; // Adjust path if needed
import { styles2 } from '../../styles/css';
import { AppNavigator } from './Navigation'; // Assuming this is your root navigator

export default function HomeScreen({ navigation }: { navigation: any}) {
const { user, isLoggedIn, logout } = useAuth(); // Consume auth state from context


  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
       primary: '#D98CBF',
    }
   };

  return (
    <AuthProvider>
      <AppNavigator />
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#e7c8f7', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/KantoKittens.png')}
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
          
      <ThemedView style={styles2.statsRowContainerFluid}>
          <ThemedView style={styles2.statsBanner}>
            <ThemedText type="subtitle" style={styles.latoFont}><IconSymbol size={28} name="cat.circle.fill" color={'black'}></IconSymbol></ThemedText>
            <ThemedText type="subtitle" style={styles.latoFont}>Cozy with Cats</ThemedText>
          </ThemedView>
          <ThemedView style={styles2.statsBanner}>
            <ThemedText type="subtitle" style={styles.latoFont}><IconSymbol size={28} name="0.square" color={'black'}></IconSymbol></ThemedText>
            <ThemedText type="subtitle" style={styles.latoFont}>Cafe Setting</ThemedText>
          </ThemedView>
          <ThemedView style={styles2.statsBanner}>
            <ThemedText type="subtitle" style={styles.latoFont}><IconSymbol size={28} name="0.circle" color={'black'}></IconSymbol></ThemedText>
            <ThemedText type="subtitle" style={styles.latoFont}>Community</ThemedText>
          </ThemedView>
      </ThemedView>
        </ParallaxScrollView>
      </AuthProvider>
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
  },
});
