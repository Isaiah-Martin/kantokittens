// app/(tabs)/hometab/index.tsx
import { AuthContext } from '@context/AuthContext';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, Text, View } from 'react-native';

export default function HomePage() {
  const router = useRouter();
  const { user } = useContext(AuthContext); // Access the user from the context


  return (
    <View>
      {user ? (
        <Text>Welcome back, {user.email}!</Text>
      ) : (
        <Text>Select the button below to return to booking</Text>
      )}
      <Button
        title="Go to Booking"
        onPress={() => router.push({ pathname: './booking', params: { date: '2025-10-26' } })}
      />
    </View>
  );
}
