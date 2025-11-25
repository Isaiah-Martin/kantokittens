import { AuthContext } from '@context/AuthContext';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define the brand color
const primaryColor = '#D98CBF';
const textColor = '#FFFFFF'; // Changed to white
const secondaryColor = '#000000'; // Changed to black

// Assuming your image is in the assets/images folder
const logoImage = require('../../../assets/images/KantoKittens.png');

export default function HomePage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const handleBookingPress = () => {
    // FIX: Use the correct public path for your deeply nested booking.tsx file
    router.push({ pathname: '/hometab/booking', params: { date: '2025-10-26' } });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header View for Title and Logo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kanto Kittens</Text>
        {/* Image in the top right corner */}
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </View>

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
    backgroundColor: primaryColor, // Changed background color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: textColor, // White text
  },
  logo: {
    width: 50, // Adjust size as needed
    height: 50, // Adjust size as needed
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
    color: textColor, // White text
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: textColor, // White text
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: secondaryColor, // Black button
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
    color: textColor, // White text
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSecondary: {
    marginTop: 20,
    padding: 10,
  },
  buttonTextSecondary: {
    color: textColor, // White text
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});
