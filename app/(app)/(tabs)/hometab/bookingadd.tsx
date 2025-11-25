// app/(app)/(tabs)/hometab/bookingadd.tsx
// Using @react-native-picker/picker alternative

import { Picker } from '@react-native-picker/picker';
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
  // We initialize the state variables with the *first* available mock data
  const [activities] = useState<ActivitySchedule[]>(mockActivities); 
  const [selectedActivityName, setSelectedActivityName] = useState<string | undefined>(mockActivities[0]?.Activity);
  const [selectedDay, setSelectedDay] = useState<string | undefined>(mockActivities[0]?.DaysOfWeek[0]);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(mockActivities[0]?.HoursOfDay[0]);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Now, selectedActivity will always have a value initially
  const selectedActivity = activities.find(a => a.Activity === selectedActivityName);
  const primaryColor = '#4A3728'; // A dark brown for consistency

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

        // We can choose not to reset the form here if we want to immediately book another time for the same choices
        // setSelectedActivityName(undefined);
        // setSelectedDay(undefined);
        // setSelectedTime(undefined);

      } catch (error) {
        Alert.alert("Error", "There was an issue processing your booking. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // This alert should ideally never show up now that states are initialized
      Alert.alert("Missing Information", "Please select an activity, day, and time.");
    }
  };


  if (isSubmitting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text>Confirming your booking...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Text style={styles.title}>Schedule a Booking</Text>

        {/* Activity Picker - Always visible */}
        <Text style={styles.label}>Choose Activity:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedActivityName}
            onValueChange={(itemValue: string | undefined) => {
              // When activity changes, we reset dependent selections to the first available options
              setSelectedActivityName(itemValue);
              const newActivity = activities.find(a => a.Activity === itemValue);
              setSelectedDay(newActivity?.DaysOfWeek[0] || undefined);
              setSelectedTime(newActivity?.HoursOfDay[0] || undefined);
            }}
          >
            {activities.map((activity) => (
              <Picker.Item key={activity.Activity} label={activity.Activity} value={activity.Activity} color={"#4A3728"}/>
            ))}
          </Picker>
        </View>

        {/* Horizontal layout for Day and Time Pickers */}
        <View style={styles.horizontalPickerRow}>
          
          {/* Day Picker - Always visible (if activity is selected, which it is by default) */}
          <View style={styles.pickerColumn}>
            <Text style={styles.label}>Choose Day:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDay}
                onValueChange={(itemValue: string | undefined) => {
                  setSelectedDay(itemValue);
                }}
              >
                {/* Use the currently selected activity's days */}
                {selectedActivity?.DaysOfWeek.map((day) => (
                  <Picker.Item key={day} label={day} value={day} color={"#4A3728"}/>
                )) || []}
              </Picker>
            </View>
          </View>
          
          {/* Time Picker - Always visible (if activity is selected) */}
          <View style={styles.pickerColumn}>
            <Text style={styles.label}>Choose Time:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTime}
                onValueChange={(itemValue: string | undefined) => setSelectedTime(itemValue)}
              >
                {/* Use the currently selected activity's hours */}
                {selectedActivity?.HoursOfDay.map((time) => (
                  <Picker.Item key={time} label={time} value={time} color={"#4A3728"}/>
                )) || []}
              </Picker>
            </View>
          </View>
        </View>

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FCFBF6', // Using the off-white background color
  },
  scrollContentContainer: {
    flexGrow: 1, 
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FCFBF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 10, 
    color: '#4A3728', // Dark text color
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    // marginTop removed from label here as it's handled by padding/margins of containers
    color: '#4A3728',
    fontWeight: '500',
  },
  // New style to wrap the two bottom pickers horizontally
  horizontalPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  // New style for individual columns in the horizontal row
  pickerColumn: {
    flex: 1, // Ensures even distribution of space
    marginHorizontal: 5, // Adds a little spacing between the columns
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#4A3728', // Darker border
    borderRadius: 8,
    // marginBottom removed here because it's inside the horizontal row
    backgroundColor: '#FFFFFF', // White background for pickers
    justifyContent: 'center',
    overflow: 'hidden',
    height: 60, // Standardize height for horizontal alignment
  },
  buttonContainer: {
    marginTop: 30, // Add more margin above the button now that pickers are horizontal
  },
});

export default BookingAddScreen;
