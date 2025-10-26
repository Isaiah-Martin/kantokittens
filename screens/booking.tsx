import AsyncStorage from '@react-native-async-storage/async-storage';
import { Timestamp } from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button, Switch } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { firestore } from '../lib/firebase';
import { getDateString } from '../lib/utils';
import { Activity, User, UserContextType } from '../navigation/RootStackParamList';
import { styles2 } from '../styles/css';

export default function Bookings({ navigation, route }: { navigation: any; route: any}) {
  const userContext: UserContextType =  useAuth()
  const [initial, setInitial] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currActivities, setCurrActivities] = useState<Activity[]>([]);
  const currDate = new Date();
  currDate.setHours(0, 0, 0, 0);
  const currNextDate = new Date(currDate.getTime() + 24 * 60 * 60 * 1000 -1);
  const [startDate, setStartDate] = useState(currDate);
  const [startDatePicker, setStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(currNextDate);
  const [endDatePicker, setEndDatePicker] = useState(false);
  const [selectRange, setSelectRange] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (userContext && userContext.user){
         retrieveSchedule(userContext.user);
      }
    }, [navigation, userContext])
  );

  async function retrieveSchedule(user: User){
    try {
      const userId = await AsyncStorage.getItem('schedule_userid') || '';
      let schedule: Activity[];
      if (user.uid && userId !== user.uid){
         await AsyncStorage.removeItem('schedule');
         await AsyncStorage.removeItem('schedule_recent');
         await AsyncStorage.removeItem('fetchtime');
         await AsyncStorage.setItem('schedule_userid', user.uid);
         schedule = [];
      }else{
         //Set activites from AsyncStorage.getItem('schedule')
         const scheduleStore: string | null = await AsyncStorage.getItem('schedule');
         schedule = scheduleStore ? JSON.parse(scheduleStore): [];
      }
      setActivities(schedule);
      //Fetch recent data from database
      const currTime = new Date().getTime() / 1000;
      const fetchTimeStore: string | null = await AsyncStorage.getItem('fetchtime');
      const fetchTime = fetchTimeStore ? parseFloat(fetchTimeStore): 0;
      if ((currTime - fetchTime) > 10 * 60){
        fetchSchedule(schedule, user);
      }
    }catch(e){
      console.error(e);
    }
  }
  
  async function fetchSchedule(sch: Activity[], user: User) {
    try {
    const userId = user.uid;
    if (!userId) {
      console.error("User ID is missing.");
      return;
    }
    
    // Get the timestamp of the last fetch from local storage
    const scheduleRecent = await AsyncStorage.getItem(`schedule_recent_${userId}`);

    const activitiesRef = firestore().collection('activities');
    let q = activitiesRef.where('ownerId', '==', userId);

    if (scheduleRecent) {
      // Create a Timestamp object from the stored string for the query
      const lastFetchTimestamp = Timestamp.fromMillis(parseInt(scheduleRecent, 10));
      q = q.where('created', '>', lastFetchTimestamp);
    }
    
    // Always order by 'created' to ensure consistency
    q = q.orderBy('created');

    const querySnapshot = await q.get();
    const result: Activity[] = [];
    let recent = scheduleRecent || '';

    for (const doc of querySnapshot.docs) {
      const data = doc.data(); // Get data without immediate cast

      // Filter for active documents
      // Ensure 'removed' exists before checking
      if (data && !data.removed) { 
        result.push({
          ...data,
          id: doc.id,
          // Convert timestamp back to a valid type if necessary for Activity
          created: data.created?.toDate(),
        } as Activity);
      }

      // Update the `recent` variable with the latest created timestamp
      if (data.created instanceof Timestamp) { // Use instanceof to be sure
        const createdTimestamp = data.created.toMillis().toString();
        if (createdTimestamp > recent) {
          recent = createdTimestamp;
        }
      }
    }

    // Merge the new data with the existing data
    let schdl = [...sch];

    for (const item of result) {
      const idx = schdl.findIndex((itm) => itm.id === item.id);
      if (idx > -1) {
        schdl[idx] = item;
      } else {
        schdl.push(item);
      }
    }
    
    // Filter out removed items before updating state and storage
    schdl = schdl.filter(item => !item.removed);
    
    // Update state and AsyncStorage
    setActivities(schdl); // Assuming `setActivities` is a state setter function
    await AsyncStorage.setItem(`schedule_${userId}`, JSON.stringify(schdl));

    if (recent) {
      await AsyncStorage.setItem(`schedule_recent_${userId}`, recent);
    }
    
    // Set a general fetch time
    const fetchTime = new Date().getTime();
    await AsyncStorage.setItem(`fetchtime_${userId}`, fetchTime.toString());

  } catch (e) {
    console.error(e);
  }
}

  function changeSelectRange(value: boolean){
     if (value){
        setSelectRange(value); 
     }else{
        setSelectRange(value); 
        setEndDate(new Date(startDate.getTime() + 24 * 60 * 60 * 1000 -1));
     }
  }

  function handleStartDateConfirm(date: Date){
     date.setHours(0, 0, 0, 0);
     if (selectRange){
        if (date > endDate){
           const startTime = new Date(endDate.getTime());
           startTime.setHours(0, 0, 0, 0);
           const endTime = new Date(date.getTime() + 24 * 60 * 60 * 1000 - 1);
           setStartDate(startTime);
           setEndDate(endTime);
        }else{
          setStartDate(date);
        }
    }else{
        setStartDate(date);
        setEndDate(new Date(date.getTime() + 24 * 60 * 60 * 1000 -1));
     }
     setStartDatePicker(false);
  }
  
  function handleEndDateConfirm(date: Date){
    date.setHours(0, 0, 0, 0);
    if (date < startDate){
       const endTime = new Date(startDate.getTime() + 24 * 60 * 60 * 1000 - 1);
       setStartDate(date);
       setEndDate(endTime);
    }else{
       setEndDate(new Date(date.getTime() + 24 * 60 * 60 * 1000 -1));
    }
    setEndDatePicker(false);
  }
  
  return (userContext &&
    <SafeAreaView style={styles2.container}>
      <KeyboardAvoidingView  
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles2.container}>
        <ScrollView style={styles2.scrollView}>
          <View style={[styles2.listItem,{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
            <Button icon="plus" mode="contained" onPress={() => navigation.navigate('Add')}>Activity</Button>           
            <View style={styles2.itemLeft}>  
              <Switch value={selectRange} onValueChange={() => changeSelectRange(!selectRange)} />
              <Text> Select Date Ranges</Text>
            </View> 
          </View>
          <View style={styles2.listItem}>
            {selectRange &&
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Button 
                mode='outlined'
                color='black'
                onPress={() => setStartDatePicker(true)}
                >
                {startDate.toDateString()}              
              </Button>
              <Text>--</Text>          
              <Button 
                mode='outlined'
                color='black'
                onPress={() => setEndDatePicker(true)}
                >
                {endDate.toDateString()}              
              </Button>
            </View>
            }
            {!selectRange &&
            <View style={styles2.itemCenter}>
              <Button 
                mode='outlined'
                color='black'
                onPress={() => setStartDatePicker(true)}
                >
                {startDate.toDateString()}              
              </Button>
            </View>
            }
            <DateTimePickerModal
               date={startDate}
               isVisible={startDatePicker}
               mode="date"
               onConfirm={(date) => handleStartDateConfirm(date)}
               onCancel={() => setStartDatePicker(false)}
            />
            <DateTimePickerModal
               date={endDate}
               isVisible={endDatePicker}
               mode="date"
               onConfirm={(date) => handleEndDateConfirm(date)}
               onCancel={() => setEndDatePicker(false)}
            />
          </View>
          {currActivities.length > 0 &&
             currActivities.map((item) =>
             (
              <View key={item.id}>
                <TouchableHighlight onPress={() => navigation.navigate('ActivityDetail',{activityObj: item})}>
                  <View style={styles2.itemActivity}>
                    <Text style={styles2.textActivity}>{item.title}</Text>
                    <Text style={styles2.textActivity}>{getDateString(new Date(item.startTime*1000))} -- {getDateString(new Date(item.endTime*1000))}</Text>
                  </View>
                </TouchableHighlight>
                <View style={styles2.spaceActivity}>
                </View>
              </View>
             ))
          }
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}