// app/(app)/(tabs)/hometab/bookingadd.tsx

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
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
  const placeholderProps = { label: "Select an option...", value: undefined, color: '#9E9E9E' };
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

  const activityPickerZIndex = 10;
  const dayPickerZIndex = 20;
  const timePickerZIndex = 30;

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

        <Text style={styles.label}>Choose Activity:</Text>
        <View style={[styles.pickerContainer, Platform.OS === 'android' && { zIndex: activityPickerZIndex }]}>
          <RNPickerSelect
            onValueChange={(itemValue) => {
              setSelectedActivityName(itemValue);
              setSelectedDay(undefined);
              setSelectedTime(undefined);
            }}
            value={selectedActivityName} 
            items={activities.map((activity) => ({
              label: activity.Activity,
              value: activity.Activity,
            }))}
            placeholder={placeholderProps}
            style={pickerSelectStyles}
          />
        </View>

        {selectedActivityName && (
          <>
            <Text style={styles.label}>Choose Day:</Text>
            <View style={[styles.pickerContainer, Platform.OS === 'android' && { zIndex: dayPickerZIndex }]}>
              <RNPickerSelect
                onValueChange={(itemValue) => {
                  setSelectedDay(itemValue);
                  setSelectedTime(undefined);
                }}
                value={selectedDay}
                items={selectedActivity?.DaysOfWeek.map((day) => ({
                  label: day,
                  value: day,
                })) || []} 
                placeholder={placeholderProps}
                style={pickerSelectStyles}
              />
            </View>
          </>
        )}

        {selectedDay && selectedActivityName && (
          <>
            <Text style={styles.label}>Choose Time:</Text>
            <View style={[styles.pickerContainer, Platform.OS === 'android' && { zIndex: timePickerZIndex }]}>
              <RNPickerSelect
                onValueChange={(itemValue) => setSelectedTime(itemValue)}
                value={selectedTime}
                items={selectedActivity?.HoursOfDay.map((time) => ({
                  label: time,
                  value: time,
                })) || []} 
                placeholder={placeholderProps}
                style={pickerSelectStyles}
              />
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30, 
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    paddingRight: 30, 
  },
});

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
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  buttonContainer: {
    marginTop: 20,
    zIndex: 0, // Keep zIndex low to not interfere with pickers
  },
});

export default BookingAddScreen;
