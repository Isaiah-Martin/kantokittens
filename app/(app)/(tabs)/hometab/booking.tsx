// app/(app)/(tabs)/hometab/booking.tsx

import { AuthContext } from '@context/AuthContext';
import { useFirebase } from '@context/FirebaseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseFirestoreTypes, collection, getDocs } from '@react-native-firebase/firestore';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useContext, useState } from 'react';
// Import necessary components for UI
import { ActivityIndicator, Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { User } from '../../../../navigation/types';

interface Activity {
  date: number; // Example property
  // Add other properties of a booking here
}

type Firestore = FirebaseFirestoreTypes.Module;

// Define the brand colors
const backgroundColor = '#EBC5F1'; // A light purple color matching the image background
const textColor = '#CC3399'; // Kitten text
const buttonColor = '#000000'; // Black button

// Assuming your image is in the assets/images folder
const logoImage = require('../../../../assets/images/KantoKittens.png');

// Get screen width for responsive sizing
const screenWidth = Dimensions.get('window').width;

// Functions moved outside the component (omitted for brevity, assume they are still above the component)
async function fetchSchedule(firestore: Firestore, localSchedule: Activity[], appUser: User, setActivities: React.Dispatch<React.SetStateAction<Activity[]>>) {
  if (!firestore || !appUser?.uid) return;
  
  try {
    const scheduleRef = collection(firestore, 'schedules', appUser.uid, 'activities');
    const querySnapshot = await getDocs(scheduleRef);
    const newSchedule: Activity[] = [];

    querySnapshot.forEach((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
      const activityData = doc.data();
      if (activityData) {
        newSchedule.push(activityData as Activity);
      }
    });

    setActivities(newSchedule);

    await AsyncStorage.setItem('schedule', JSON.stringify(newSchedule));
    await AsyncStorage.setItem('fetchtime', (new Date().getTime() / 1000).toString());
  } catch (e) {
    console.error("Error fetching schedule from Firestore:", e);
  }
}

async function retrieveSchedule(firestore: Firestore, user: User, setActivities: React.Dispatch<React.SetStateAction<Activity[]>>) {
  console.log(`Retrieving schedule for user: ${user.uid}`);
  try {
    const userId = await AsyncStorage.getItem('schedule_userid') || '';
    let schedule: Activity[];
    if (user?.uid && userId !== user.uid) {
      await AsyncStorage.removeItem('schedule');
      await AsyncStorage.removeItem('schedule_recent');
      await AsyncStorage.removeItem('fetchtime');
      await AsyncStorage.setItem('schedule_userid', user.uid);
      schedule = [];
    } else {
      const scheduleStore: string | null = await AsyncStorage.getItem('schedule');
      schedule = scheduleStore ? JSON.parse(scheduleStore) : [];
    }
    setActivities(schedule);

    const currTime = new Date().getTime() / 1000;
    const fetchTimeStore: string | null = await AsyncStorage.getItem('fetchtime');
    const fetchTime = fetchTimeStore ? parseFloat(fetchTimeStore) : 0;
    if ((currTime - fetchTime) > 10 * 60) {
      await fetchSchedule(firestore, schedule, user, setActivities);
    }
  } catch (e) {
    console.error(e);
  }
}

export default function Booking() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const { firestore } = useFirebase();
  const bookingId = typeof params.bookingId === 'string' ? params.bookingId : null;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        setLoading(true);
        if (user?.uid && firestore) {
          await retrieveSchedule(firestore, user, setActivities);
        }
        if (isActive) {
           setLoading(false);
        }
      };
      fetchData();
      return () => {
        isActive = false;
      };
    }, [user, firestore])
  );
  
 const handleSchedulePress = () => {
  console.log("Navigating to scheduling page...");
  // Use the correct path based on your file structure
  router.push('/hometab/bookingadd'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header View for Title and Logo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking Details</Text>
        {/* Image in the top right corner */}
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.contentArea}>
        
        {/* Display User Data */}
        <View style={styles.userInfo}>
          <Text style={styles.text}>Logged in as:</Text>
          <Text style={styles.emailText}>{user ? user.email : 'Guest'}</Text>
        </View>

        {/* Display Bookings or No Bookings message */}
        <View style={styles.bookingStatusArea}>
          {loading ? (
            <ActivityIndicator size="large" color={textColor} />
          ) : activities.length > 0 ? (
            // Render list of bookings here (placeholder)
            <Text style={styles.text}>You have {activities.length} upcoming bookings.</Text>
          ) : (
            <View style={styles.noBookingsContainer}>
              <Text style={styles.noBookingsText}>No bookings yet.</Text>
              <TouchableOpacity style={styles.button} onPress={handleSchedulePress}>
                <Text style={styles.buttonText}>Schedule a Booking</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    width: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: textColor, // White text
  },
  logo: {
    width: screenWidth * 0.3, // Made the logo larger (30% of screen width)
    height: screenWidth * 0.3, // Maintain aspect ratio
  },
  contentArea: {
    flex: 1,
    padding: 20,
    // Center content if needed, but flex: 1 helps it fill the space
  },
  userInfo: {
    marginBottom: 20,
    padding: 10,
    // Adjusted border color to be visible on the new background
    borderColor: textColor, 
    borderWidth: 1,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: textColor, // White text
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: textColor, // White text
  },
  bookingStatusArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBookingsContainer: {
    alignItems: 'center',
  },
  noBookingsText: {
    fontSize: 18,
    color: textColor, // White text
    marginBottom: 15,
  },
  button: {
    backgroundColor: buttonColor, // Black button background
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: textColor, // White text
    fontSize: 18,
    fontWeight: '600',
  },
});
