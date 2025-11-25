// app/(app)/(tabs)/hometab/bookingadd.tsx

// Remove this commented out line if it's still there
// import { Picker } from '@react-native-picker/picker'; 

import React, { useEffect, useState } from 'react';
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
  const [activities, setActivities] = useState<ActivitySchedule[]>(mockActivities);
  const [selectedActivityName, setSelectedActivityName] = useState<string | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<string | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false); 

  const selectedActivity = activities.find(a => a.Activity === selectedActivityName);

  useEffect(() => {
    // It is better to leave this undefined until the user explicitly selects something in this specific component's use case
    // if (activities.length > 0 && selectedActivityName === undefined) {
    //   setSelectedActivityName(activities[0].Activity);
    // }
  }, [activities, selectedActivityName]);


  const handleBookingConfirm = () => {
    if (selectedActivityName && selectedDay && selectedTime) {
      Alert.alert(
        "Booking Confirmed",
        `You are booked for ${selectedActivityName} on ${selectedDay} at ${selectedTime}.`,
      );
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

  // Define a standard placeholder object to use for all pickers
  const placeholderProps = { label: "Select an option...", value: undefined };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule a Booking</Text>

      {/* Activity Picker - Corrected Syntax */}
      <Text style={styles.label}>Choose Activity:</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(itemValue) => {
            setSelectedActivityName(itemValue);
            setSelectedDay(undefined);
            setSelectedTime(undefined);
          }}
          // Use 'value' prop instead of 'selectedValue'
          value={selectedActivityName} 
          // Pass items as an array of {label, value} objects using the 'items' prop
          items={activities.map((activity) => ({
            label: activity.Activity,
            value: activity.Activity,
          }))}
          placeholder={placeholderProps}
        />
      </View>

      {/* Day Picker (conditionally rendered) - Corrected Syntax */}
      {selectedActivity && (
        <>
          <Text style={styles.label}>Choose Day:</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(itemValue) => {
                setSelectedDay(itemValue);
                setSelectedTime(undefined);
              }}
              value={selectedDay}
              items={selectedActivity.DaysOfWeek.map((day) => ({
                label: day,
                value: day,
              }))}
              placeholder={placeholderProps}
            />
          </View>
        </>
      )}

      {/* Time Picker (conditionally rendered) - Corrected Syntax */}
      {selectedDay && selectedActivity && (
        <>
          <Text style={styles.label}>Choose Time:</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(itemValue) => setSelectedTime(itemValue)}
              value={selectedTime}
              items={selectedActivity.HoursOfDay.map((time) => ({
                label: time,
                value: time,
              }))}
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
    paddingHorizontal: 10, // Added padding for better appearance
  },
});

export default BookingAddScreen;
