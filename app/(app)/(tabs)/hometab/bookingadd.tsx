// app/(app)/(tabs)/hometab/bookingadd.tsx

import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';

// Define the type for an activity item
interface ActivitySchedule {
  Activity: string;
  DaysOfWeek: string[];
  HoursOfDay: string[];
}

// --- MOCK DATA SOURCE ---
const mockActivities: ActivitySchedule[] = [
  { "Activity": "Yoga", "DaysOfWeek": ["Monday", "Wednesday", "Thursday", "Saturday"], "HoursOfDay": ["09:00", "11:00", "15:00"] },
  { "Activity": "Cat Playtime", "DaysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "HoursOfDay": ["13:00", "14:00", "15:00", "16:00"] },
  { "Activity": "Movie Night", "DaysOfWeek": ["Wednesday", "Friday", "Saturday"], "HoursOfDay": ["19:00"] },
  { "Activity": "Coffee Study Session", "DaysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "HoursOfDay": ["09:00", "10:00", "11:00", "13:00", "14:00"] }
];

// --- FIREBASE INTEGRATION NOTE ---
// (Note remains here as a comment for future implementation)

const BookingAddScreen = () => {
  const [activities, setActivities] = useState<ActivitySchedule[]>(mockActivities);
  const [selectedActivityName, setSelectedActivityName] = useState<string | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<string | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false); 

  // Find the currently selected activity object based on the name
  const selectedActivity = activities.find(a => a.Activity === selectedActivityName);

  // Set initial default selections upon data load if needed
  useEffect(() => {
    // Only set a default if we haven't selected one yet and activities exist
    if (activities.length > 0 && selectedActivityName === undefined) {
      setSelectedActivityName(activities[0].Activity);
    }
  }, [activities, selectedActivityName]);


  const handleBookingConfirm = () => {
    if (selectedActivityName && selectedDay && selectedTime) {
      Alert.alert(
        "Booking Confirmed",
        `You are booked for ${selectedActivityName} on ${selectedDay} at ${selectedTime}.`,
        [
          { 
            text: "OK", 
            onPress: () => {
              router.back(); 
            } 
          }
        ]
      );
      // In a real app, you would send this booking data to Firebase/backend here
    } else {
      Alert.alert("Missing Information", "Please select an activity, day, and time.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text>Loading activities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule a Booking</Text>

      {/* Activity Picker */}
      <Text style={styles.label}>Choose Activity:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedActivityName}
          // Explicitly type itemValue as a string or undefined for TypeScript compliance
          onValueChange={(itemValue: string | undefined) => {
            setSelectedActivityName(itemValue);
            // Reset day and time when activity changes
            setSelectedDay(undefined);
            setSelectedTime(undefined);
          }}>
          {activities.map((activity) => (
            <Picker.Item key={activity.Activity} label={activity.Activity} value={activity.Activity} />
          ))}
        </Picker>
      </View>

      {/* Day Picker (conditionally rendered) */}
      {selectedActivity && (
        <>
          <Text style={styles.label}>Choose Day:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDay}
              // Explicitly type itemValue as a string or undefined
              onValueChange={(itemValue: string | undefined) => {
                setSelectedDay(itemValue);
                // Reset time when day changes
                setSelectedTime(undefined);
              }}>
              <Picker.Item label="Select a Day" value={undefined} enabled={false} />
              {selectedActivity.DaysOfWeek.map((day) => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>
          </View>
        </>
      )}

      {/* Time Picker (conditionally rendered) */}
      {selectedDay && selectedActivity && (
        <>
          <Text style={styles.label}>Choose Time:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTime}
              // Explicitly type itemValue as a string or undefined
              onValueChange={(itemValue: string | undefined) => setSelectedTime(itemValue)}>
              <Picker.Item label="Select a Time" value={undefined} enabled={false} />
              {selectedActivity.HoursOfDay.map((time) => (
                <Picker.Item key={time} label={time} value={time} />
              ))}
            </Picker>
          </View>
        </>
      )}

      <Button
        title="Confirm Booking"
        onPress={handleBookingConfirm}
        disabled={!selectedActivityName || !selectedDay || !selectedTime}
      />
    </View>
  );
};

const primaryColor = '#EBC5F1';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
});

export default BookingAddScreen;
