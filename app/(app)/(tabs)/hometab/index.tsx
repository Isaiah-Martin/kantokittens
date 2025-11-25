// app/(tabs)/hometab/index.tsx
import { AuthContext } from '@context/AuthContext';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define the brand color
const primaryColor = '#D98CBF';
const textColor = '#333333';
const secondaryColor = '#FFFFFF';

export default function HomePage() {
  const router = useRouter();
  const { user } = useContext(AuthContext); 

  const handleBookingPress = () => {
    // FIX: Use the correct public path for your deeply nested booking.tsx file
    router.push({ pathname: '/hometab/booking', params: { date: '2025-10-26' } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentArea}>
        {user ? (
          <Text style={styles.welcomeText}>Welcome back, {user.email}!</Text>
        ) : (
          <Text style={styles.instructionText}>Select the button below to return to booking</Text>
        )}

        {/* Using TouchableOpacity for a custom styled button */}
        <TouchableOpacity style={styles.button} onPress={handleBookingPress}>
          <Text style={styles.buttonText}>Go to Booking</Text>
        </TouchableOpacity>
        
        {/* Added placeholder for a second button/navigation item for demonstration */}
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => console.log('Site map DNE clicked')}>
          <Text style={styles.buttonTextSecondary}>Sitemap (Page DNE)</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: secondaryColor,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: textColor,
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: textColor,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: secondaryColor,
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSecondary: {
    marginTop: 20,
    padding: 10,
  },
  buttonTextSecondary: {
    color: primaryColor,
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});
