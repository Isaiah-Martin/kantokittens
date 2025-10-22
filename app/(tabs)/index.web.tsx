// index.web.tsx
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style = {{backgroundColor: "light: '#e7c8f7', dark: '#1D3D47'" }}>
      <Text>Kanto Kittens</Text> {/* Use a text fallback for web */}
    </View>
  );
}