import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

// Update the Props type definition to include standard ScrollView props we might want to pass through
type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  // Optionally add specific styles for the content wrapper (the ThemedView)
  contentContainerStyle?: ViewStyle; 
  // Add other standard ScrollView props if needed, e.g., style, indicatorStyle
  style?: ViewStyle;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  contentContainerStyle, // Destructure the new prop
  style, // Destructure the new prop
}: Props) {
  console.log("ParallaxScrollView: Component rendering started."); 

  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  console.log("ParallaxScrollView: Hooks executed, returning JSX."); 

  return (
    <Animated.ScrollView
      ref={scrollRef}
      // Apply the base container styles and any additional style props passed in
      style={[styles.container, { backgroundColor }, style]}
      // Pass the standard 'contentContainerStyle' to the underlying ScrollView via this prop name
      contentContainerStyle={contentContainerStyle} 
      scrollEventThrottle={16}>
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}>
        {headerImage}
      </Animated.View>
      {/* 
        The content wrapper used in the original code. 
        It needs some adjustment to handle the passed 'contentContainerStyle' if we want to use it for padding/gap.
        If you prefer passing it to the Animated.ScrollView directly as the *actual* contentContainerStyle prop, 
        you need to adjust the structure slightly, as the header is typically an absolute positioned element *over* the scroll view's content offset.

        If sticking to the original template's structure (ThemedView acts as the content wrapper):
      */}
      <ThemedView style={[styles.content, contentContainerStyle]}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    padding: 32,
    gap: 8,
    overflow: 'hidden',
    // Note: The ThemedView here is a direct child of the ScrollView, positioned after the Header View. 
    // The library manages the necessary top padding for the ScrollView content automatically somewhere else 
    // or assumes the first child (ThemedView) needs to accommodate the fixed header height.
  },
});
