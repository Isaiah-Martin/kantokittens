import { useThemeColor } from '@/hooks/use-theme-color';
import React, { Children } from 'react';
import { Text, View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, children, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  // Wrap any string children in a <Text> component
  const wrappedChildren = Children.map(children, child => {
    if (typeof child === 'string' || typeof child === 'number') {
      return <Text>{child}</Text>;
    }
    return child;
  });

  return (
    <View style={[{ backgroundColor }, style]} {...otherProps}>
      {wrappedChildren}
    </View>
  );
}
