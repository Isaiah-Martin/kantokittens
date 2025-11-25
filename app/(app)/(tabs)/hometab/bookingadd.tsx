// app/(app)/(tabs)/hometab/bookingadd.tsx
// Using @react-native-picker/picker alternative

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
// Import the native picker component
import { Picker } from '@react-native-picker/picker';
// Import SafeAreaView from 'react-native-safe-area-context' as recommended by your console logs
import { SafeAreaView } from 'react-native-safe-area-context';


// --- Types ---
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

const BookingAddScreen = () => {
  const [activities] = useState<ActivitySchedule[]>(mockActivities); 
  const [selectedActivityName, setSelectedActivityName] = useState<string | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<string | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const selectedActivity = activities.find(a => a.Activity === selectedActivityName);
  // Removed placeholderProps as the native picker handles placeholders differently
  const primaryColor = '#EBC5F1'; 

  const handleBookingConfirm = async () => {
    if (selectedActivityName && selectedDay && selectedTime) {
      setIsSubmitting(true);
      
      try {
        // Simulate an API call with a delay
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        Alert.alert(
          "Booking Confirmed",
          `You are booked for ${selectedActivityName} on ${selectedDay} at ${selectedTime}.`,
        );

        // Reset the form upon success
        setSelectedActivityName(undefined);
        setSelectedDay(undefined);
        setSelectedTime(undefined);

      } catch (error) {
        Alert.alert("Error", "There was an issue processing your booking. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      Alert.alert("Missing Information", "Please select an activity, day, and time.");
    }
  };


  if (isSubmitting) {
    // Use a dedicated loading container style with centering
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text>Confirming your booking...</Text>
      </View>
    );
  }

  return (
    // Use the correct SafeAreaView from 'react-native-safe-area-context'
    <SafeAreaView style={styles.safeArea}>
      {/* Use ScrollView to ensure content is interactive and scrollable if needed */}
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Text style={styles.title}>Schedule a Booking</Text>

        {/* Activity Picker using Native Picker */}
        <Text style={styles.label}>Choose Activity:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedActivityName}
            onValueChange={(itemValue: string | undefined) => { // Type explicitly for the picker
              setSelectedActivityName(itemValue);
              setSelectedDay(undefined);
              setSelectedTime(undefined);
            }}
          >
            {/* Added a disabled placeholder item at the top */}
            <Picker.Item label="Select an option..." value={undefined} color="#9E9E9E" />
            {activities.map((activity) => (
              <Picker.Item key={activity.Activity} label={activity.Activity} value={activity.Activity} />
            ))}
          </Picker>
        </View>

        {/* Day Picker (conditionally rendered) */}
        {selectedActivityName && (
          <>
            <Text style={styles.label}>Choose Day:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDay}
                onValueChange={(itemValue: string | undefined) => {
                  setSelectedDay(itemValue);
                  setSelectedTime(undefined);
                }}
              >
                <Picker.Item label="Select an option..." value={undefined} color="#9E9E9E" />
                {selectedActivity?.DaysOfWeek.map((day) => (
                  <Picker.Item key={day} label={day} value={day} />
                ))}
              </Picker>
            </View>
          </>
        )}

        {/* Time Picker (conditionally rendered) */}
        {selectedDay && selectedActivityName && (
          <>
            <Text style={styles.label}>Choose Time:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTime}
                onValueChange={(itemValue: string | undefined) => setSelectedTime(itemValue)}
              >
                 <Picker.Item label="Select an option..." value={undefined} color="#9E9E9E" />
                {selectedActivity?.HoursOfDay.map((time) => (
                  <Picker.Item key={time} label={time} value={time} />
                ))}
              </Picker>
            </View>
          </>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title={isSubmitting ? "Submitting..." : "Confirm Booking"}
            onPress={handleBookingConfirm}
            disabled={isSubmitting || !selectedActivityName || !selectedDay || !selectedTime}
            color={primaryColor}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles are adjusted for the native Picker, which doesn't need inputIOS/Android styles
const styles = StyleSheet.create({
  // Use a simple safe area container
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Use a scrollable content container for layout
  scrollContentContainer: {
    flexGrow: 1, // Allows the content to expand and fill the safe area space
    padding: 20,
  },
  // Dedicated style for the full-screen loading indicator
  loadingContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 10, // Adjust positioning within the new layout
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    // The native picker handles its own zIndex internally much better
    // overflow: 'hidden', // Can sometimes cause issues with the picker dropdown modal
    backgroundColor: '#fafafa',
    justifyContent: 'center', // Helps vertically align the picker content
  },
  buttonContainer: {
    marginTop: 20,
    // zIndex is not needed here anymore as the native picker works differently
  },
});

export default BookingAddScreen;
