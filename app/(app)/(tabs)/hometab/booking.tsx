import { AuthContext } from '@context/AuthContext';
import { useFirebase } from '@context/FirebaseContext'; // Import useFirebase hook
import AsyncStorage from '@react-native-async-storage/async-storage';
// booking.tsx
import { FirebaseFirestoreTypes, collection, getDocs } from '@react-native-firebase/firestore';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useContext, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { User } from '../../../../navigation/types';
import { styles2 } from '../../../../styles/css';

interface Activity {
  // Define your Activity properties here
  date: number; // Example property
}

type Firestore = FirebaseFirestoreTypes.Module;

// Functions moved outside the component
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
    if (user?.uid && userId !== user.uid) { // Use the passed-in user
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
  const [initial, setInitial] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currActivities, setCurrActivities] = useState<Activity[]>([]);
  const currDate = new Date();
  currDate.setHours(0, 0, 0, 0);
  const currNextDate = new Date(currDate.getTime() + 24 * 60 * 60 * 1000 - 1);
  const [startDate, setStartDate] = useState(currDate);
  const [startDatePicker, setStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(currNextDate);
  const [endDatePicker, setEndDatePicker] = useState(false);
  const [selectRange, setSelectRange] = useState(false);

  // useFocusEffect hook for fetching data
  useFocusEffect(
    useCallback(() => {
      if (user?.uid && firestore) {
        retrieveSchedule(firestore, user, setActivities);
      }
    }, [user, firestore, setActivities]) // Depend on user, firestore, and the state setter
  );

  return (
    <SafeAreaView style={styles2.container}>
      <Text>Booking Screen</Text>
      {/* ... other components ... */}
    </SafeAreaView>
  );
}
