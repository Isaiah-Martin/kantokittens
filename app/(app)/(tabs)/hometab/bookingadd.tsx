// app/(app)/(tabs)/hometab/bookingadd.tsx

import React, { useState } from 'react'; // Removed useEffect as it's no longer necessary
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

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

const BookingAddScreen = () => {
  const [activities] = useState<ActivitySchedule[]>(mockActivities); // 'setActivities' not used after initialization, can be removed
  const [selectedActivityName, setSelectedActivityName] = useState<string | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<string | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false); 

  // Find the currently selected activity object based on the name
  const selectedActivity = activities.find(a => a.Activity === selectedActivityName);

  // The useEffect hook has been removed entirely as it conflicts with interactive UI flow.

  const handleBookingConfirm = () => {
    if (selectedActivityName && selectedDay && selectedTime) {
      Alert.alert(
        "Booking Confirmed",
        `You are booked for ${selectedActivityName} on ${selectedDay} at ${selectedTime}.`,
      );
      // In a real app, you would send this booking data to Firebase/backend here
    } else {
      Alert.alert("Missing Information", "Please select an activity, day, and time.");
    }
  };

  if (loading) {
    // Note: 'primaryColor' is used here but defined after the component.
    // It's technically okay due to hoisting but typically defined before the component function.
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text>Loading activities...</Text>
      </View>
    );
  }

  // Define a standard placeholder object to use for all pickers
  const placeholderProps = { label: "Select an option...", value: undefined };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule a Booking</Text>

      {/* Activity Picker */}
      <Text style={styles.label}>Choose Activity:</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(itemValue) => {
            setSelectedActivityName(itemValue);
            // Reset dependent selections when activity changes
            setSelectedDay(undefined);
            setSelectedTime(undefined);
          }}
          value={selectedActivityName} 
          items={activities.map((activity) => ({
            label: activity.Activity,
            value: activity.Activity,
          }))}
          placeholder={placeholderProps}
        />
      </View>

      {/* Day Picker (conditionally rendered only if an Activity is chosen) */}
      {/* Use optional chaining (?) for robustness when mapping DaysOfWeek */}
      {selectedActivityName && (
        <>
          <Text style={styles.label}>Choose Day:</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(itemValue) => {
                setSelectedDay(itemValue);
                // Reset dependent selections when day changes
                setSelectedTime(undefined);
              }}
              value={selectedDay}
              items={selectedActivity?.DaysOfWeek.map((day) => ({
                label: day,
                value: day,
              })) || []} // Provide empty array fallback
              placeholder={placeholderProps}
            />
          </View>
        </>
      )}

      {/* Time Picker (conditionally rendered only if a Day is chosen) */}
      {selectedDay && selectedActivityName && (
        <>
          <Text style={styles.label}>Choose Time:</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(itemValue) => setSelectedTime(itemValue)}
              value={selectedTime}
              items={selectedActivity?.HoursOfDay.map((time) => ({
                label: time,
                value: time,
              })) || []} // Provide empty array fallback
              placeholder={placeholderProps}
            />
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
    paddingHorizontal: 10, 
  },
});

export default BookingAddScreen;
