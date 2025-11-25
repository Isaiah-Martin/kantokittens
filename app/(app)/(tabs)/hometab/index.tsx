//app/(app)/(tabs)/hometab/index.tsx
import { AuthContext } from '@context/AuthContext';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Alert, Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define the brand colors
const backgroundColor = '#EBC5F1'; // A light purple color matching the image background
const textColor = '#CC3399'; // (used for general text)
const buttonColor = '#000000'; // Black button

// Assuming your image is in the assets/images folder
const logoImage = require('../../../../assets/images/KantoKittens.png');

// Get screen width for responsive sizing
const screenWidth = Dimensions.get('window').width;

export default function HomePage() {
  const router = useRouter();
  
  // Explicitly cast the result of useContext to 'any' to resolve TypeScript errors
  const { user, logOut } = useContext(AuthContext) as any; 

  const handleBookingPress = () => {
    // Use the correct public path for your deeply nested booking.tsx file
    router.push({ pathname: '/hometab/booking', params: { date: '2025-10-26' } });
  };

  const handleLogoutPress = async () => {
    if (logOut) {
      try {
        await logOut();
        console.log("User logged out successfully.");
      } catch (error) {
        console.error("Logout failed:", error);
        Alert.alert("Logout Failed", "Could not log out at this time.");
      }
    } else {
      console.warn("Logout function is not available in AuthContext.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header View for Title and Logo */}
      <View style={styles.header}>
        {/* Image in the top right corner */}
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.contentArea}>
        {user ? (
          <Text style={styles.welcomeText}>Welcome back, {user.email}!</Text>
        ) : (
          <Text style={styles.instructionText}>Select the button below to return to booking</Text>
        )}
        
        {/* Go to Booking Button */}
        <TouchableOpacity style={styles.button} onPress={handleBookingPress}>
          <Text style={styles.buttonText}>Go to Booking</Text>
        </TouchableOpacity>
        
        {/* Logout Button (Now styled as the main button) */}
        <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={handleLogoutPress}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor, // Updated background color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Aligns logo to the right
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    width: '100%',
  },
  logo: {
    width: screenWidth * 0.37, // Size for presence
    height: screenWidth * 0.45, 
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
    backgroundColor: buttonColor, // Black button
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: textColor, // Text color on the black button
    fontSize: 18,
    fontWeight: '600',
  },
});
