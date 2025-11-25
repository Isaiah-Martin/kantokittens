//app/(app)/(tabs)/hometab/bookingadd.tsx
import { Timestamp } from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import validator from 'email-validator';
import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  ActivityIndicator,
  Button,
  MD3LightTheme as DefaultTheme,
  Switch,
  TextInput
} from 'react-native-paper';

import { AuthContext } from '@context/AuthContext';
import { useFirebase } from '@context/FirebaseContext';
import { getDateString, timezone } from '../../../../lib/utils';
import { Activity, HomeStackParamList, MeetingTarget } from '../../../../navigation/types';
import { styles2 } from '../../../../styles/css';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type AddBookingScreenProps = NativeStackScreenProps<HomeStackParamList, 'add-booking'>;


export default function AddBooking({ navigation, route }: AddBookingScreenProps) {
  const { user } = useContext(AuthContext);
  const { firestore } = useFirebase(); 
  
  const [title, setTitle] = useState('');
  const [titleerr, setTitleErr] = useState('');
  
  // FIX 1: Initialize the ref using `as any` to bypass strict type checking
  const titleEl = useRef<any>(null);

  const startTime = new Date();
  const endTime = new Date();
  let startMinutes = Math.ceil((startTime.getMinutes() + 1)/30)*30;
  startTime.setMinutes(startMinutes, 0, 0);
  endTime.setHours(endTime.getHours() + 1, startMinutes, 0, 0);
  const [startDate, setStartDate] = useState(startTime);
  const [startDatePicker, setStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(endTime);
  const [endDatePicker, setEndDatePicker] = useState(false);
  const [dateserr, setDatesErr] = useState('');
  const [meetingTargets, setMeetingTargets] = useState<MeetingTarget[]>([]);
  const [errDescr, setErrDescr] = useState<string[]>([]);
  const [sendConfirm, setSendConfirm] = useState(false);   
  const [description, setDescription] = useState('');
  const [inPost, setInPost] = useState(false);
  
  // FIX: Define the full theme object structure explicitly
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#D98CBF',
    },
  };
  const primaryColor = theme.colors.primary;

  useFocusEffect(useCallback(() => { backToInitial(); }, [navigation]));
  
  function backToInitial(){ /* ... omitted ... */ }
  function addMeetingTargets() { /* ... omitted ... */ }
  function minusMeetingTargets() { /* ... omitted ... */ }
  function handleMeetingTargetName(text: string, idx: number){ /* ... omitted ... */ }
  function handleMeetingTargetEmail(text: string, idx: number){ /* ... omitted ... */ }
  function handleSetErrDescr(descr: string, idx: number){ /* ... omitted ... */ }
  function sortOutMeetingTargets() { /* ... omitted ... */ }
  function resetErrMsg(){ /* ... omitted ... */ }


  async function submitForm(){
    resetErrMsg();
    
    if (!title.trim()){
      setTitle(title.trim());
      setTitleErr("Please type title, this field is required!");
      
      // FIX 2: This focus call now works because the ref type is 'any'
      titleEl.current?.focus(); 
      return;
    }
    
    if (!startDate || !endDate){
       setDatesErr("Please select datetime range, this field is required!");
       return;
    }
    if (startDate >= endDate){
       setDatesErr("Starting time of selected range is later than ending time, please reselect!");
       return;
    }
    const currTime = new Date();
    if (startDate < currTime || endDate < currTime){
       setDatesErr("We can't set the appointment for the previous time.");
       return;
    }
    
    if (meetingTargets.length > 0) {
      for (const [i, target] of meetingTargets.entries()) {
        if (sendConfirm && target.name.trim() && !target.email) {
          handleSetErrDescr('You want to send a confirmation email, please provide the email.', i);
          return; 
        }
        if (target.email && !validator.validate(target.email)) {
          handleSetErrDescr('This email is not valid. Please enter a legal email.', i);
          return; 
        }
      }
    }

    sortOutMeetingTargets(); 
    setInPost(true);

    try {
      if (!user || !user.uid || !firestore) {
        alert("Authentication or Firestore service is unavailable.");
        throw new Error("Service unavailable.");
      }

      const newActivityForFirestore = {
        title: title.trim(),
        startTime: startDate.getTime(), 
        endTime: endDate.getTime(),
        meetingTargets, 
        sendConfirm,
        description,
        timezone,
        ownerId: user.uid, 
        created: Timestamp.now(), 
      };
      
      const docRef = await firestore.collection('activities').add(newActivityForFirestore);
      
      // Assuming 'Activity' interface in types.ts uses 'startTime'/'endTime' numbers
      const newActivityWithId: Activity = {
        id: docRef.id, 
        ...newActivityForFirestore,
        created: new Date().toISOString(), 
      } as Activity; 

      navigation.navigate('index'); 

    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to save booking. Please try again.");
    } finally {
      setInPost(false);
    }
  };

  return (
    <SafeAreaView style={styles2.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        scrollEnabled={true}
        style={styles2.scrollView}
        >
          <View>
            <TextInput
              mode='outlined'
              label="Add Title"
              placeholder="Add Title"
              value={title}
              onChangeText={text => setTitle(text.replace(/<\/?[^>]*>/g, ""))}
              // FIX 3: Assign the 'any' typed ref here
              ref={titleEl}
              />
            <Text style={{color: 'red'}}>{titleerr}</Text> 
          </View>
          <View>
             <Text>You can press the dates to change the time.</Text> 
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Button 
                  mode='outlined'
                  color='black'
                  onPress={() => setStartDatePicker(true)}
                  >
                {startDate ? getDateString(startDate):'No date selected'} 
                </Button>
                <Text>--</Text>
                <Button 
                  mode='outlined'
                  color='black'
                  onPress={() => setEndDatePicker(true)}
                  >
                  {endDate ? getDateString(endDate):'No date selected'} 
                </Button>
             </View>
             <Text style={{color: 'red'}}>{dateserr}</Text> 
             <DateTimePickerModal
                date={startDate}
                isVisible={startDatePicker}
                mode="datetime"
                onConfirm={(date) => {setStartDate(date);setStartDatePicker(false);}}
                onCancel={() => setStartDatePicker(false)}
                />
             <DateTimePickerModal
                date={endDate}
                isVisible={endDatePicker}
                mode="datetime"
                onConfirm={(date) => {setEndDate(date);setEndDatePicker(false);}}
                onCancel={() => setEndDatePicker(false)}
                />
          </View>
          <View style={styles2.listItem}>
             <View style={styles2.itemLeft}>
                <Text style={{fontSize: 20}}>Meeting Targets: </Text>
                <Button 
                  mode='outlined'
                  icon='plus'
                  style={{marginRight: 10}}
                  onPress={() => addMeetingTargets()}
                  >
                Add
                </Button>
                {meetingTargets.length > 0 &&
                 <Button 
                   mode='outlined'
                   icon='minus'
                   onPress={() => minusMeetingTargets()}
                 >
                  Reduce
                 </Button>
                }
             </View>
             {meetingTargets.length > 0 &&
                meetingTargets.map((item, index) => 
                  <View key={index}>
                     <TextInput
                        mode="flat"
                        label="Name"
                        placeholder="Name"
                        value={meetingTargets[index].name}
                        onChangeText={(text) => handleMeetingTargetName(text, index)}
                      />
                     <TextInput
                        mode="flat"
                        label="Email"
                        placeholder="Email"
                        value={meetingTargets[index].email}
                        onChangeText={(text) => handleMeetingTargetEmail(text, index)}
                        autoCapitalize="none"
                        autoComplete="email"
                        keyboardType="email-address"
                      />
                     <Text style={{color: 'red'}}>{errDescr[index]}</Text> 
                  </View>
                )
             } 
             {meetingTargets.length > 0 &&
             <View style={styles2.itemLeft}>
                <Text>Send Confirmation Emails: </Text>
                <Switch value={sendConfirm} onValueChange={() => setSendConfirm(!sendConfirm)} /> 
             </View>
             } 
          </View>
          <View style={styles2.listItem}>
            <TextInput
              mode='outlined'
              label="Description"
              placeholder="Description"
              value={description}
              multiline={true}
              numberOfLines={5}
              onChangeText={text => setDescription(text.replace(/<\/?[^>]*>/g, ""))}
              />
          </View> 
            <Button mode="contained" style={{marginBottom: 20}} onPress={() => submitForm()}>
              Save
            </Button>
      </KeyboardAwareScrollView>
      {inPost &&
      <View style={styles2.loading}>
        <ActivityIndicator size="large" animating={true} color={primaryColor} />
      </View>
      }
    </SafeAreaView>
  );
}