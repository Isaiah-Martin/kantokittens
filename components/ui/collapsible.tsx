import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

type CollapsibleProps = PropsWithChildren & { 
    title: string;
    backgroundColor?: string; 
};

export function Collapsible({ 
    children, 
    title, 
    backgroundColor 
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  const customBackgroundStyle = backgroundColor ? { backgroundColor } : null;
  // Define the desired arrow color explicitly
  const arrowColor = '#FCFBF6'; 

  return (
    // Apply the custom background style to the outer ThemedView
    <ThemedView style={customBackgroundStyle}>
      <TouchableOpacity
        style={[styles.heading, customBackgroundStyle]}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          // Set the color explicitly to the desired hex value
          color={arrowColor} 
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      
      {isOpen && (
        // Apply the custom background style to the content container
        <ThemedView style={[styles.content, customBackgroundStyle]}>{children}</ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    // Reduced padding slightly from the previous version to decrease overall spacing
    padding: 8, 
  },
  content: {
    // Reduced spacing here as well
    marginLeft: 24,
    padding: 1, 
  },
});
