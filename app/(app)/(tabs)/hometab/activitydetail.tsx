//app/(app)/(tabs)/hometab/ActivityDetail.tsx

import { AuthContext } from '@context/AuthContext';
import { useFirebase } from '@context/FirebaseContext';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ActivityIndicator, Button, MD3LightTheme as DefaultTheme, Switch, TextInput } from 'react-native-paper';
import { getDateString, timezone } from '../../../../lib/utils';
import { Activity, HomeStackParamList, MeetingTarget } from '../../../../navigation/types';
import { styles2 } from '../../../../styles/css';

// Use the correct typed props definition
type ActivityDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'activity-detail'>;


// Renamed function to match common naming conventions if needed, otherwise uses existing name
export default function ReviewActivity({ navigation, route }: ActivityDetailScreenProps) {
  const { user } = useContext(AuthContext);
  const { firestore } = useFirebase(); 
  
  // Ensure we handle cases where route.params or activityObj might be missing
  const { activityObj } = route.params;
  
  const [inEditing, setInEditing] = useState(false);
  const [inPost, setInPost] = useState(false);
  // Type the state as Activity | undefined if it might not be present initially
  const [activity, setActivity] = useState<Activity>(activityObj);
  const [titleerr, setTitleErr] = useState('');
  // Use type any for the ref to avoid RNPaper ref issues we fixed earlier
  const titleEl = useRef<any>(null); 
  const [startDatePicker, setStartDatePicker] = useState(false);
  const [endDatePicker, setEndDatePicker] = useState(false);
  const [dateserr, setDatesErr] = useState('');
  const [errDescr, setErrDescr] = useState<string[]>([]);

  const theme = {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: '#D98CBF',
        },
      };
  
  const primaryColor = theme.colors.primary;

  function adjustErrDescr(){
    // FIX: Add null check before accessing activity.meetingTargets
    if (activity?.meetingTargets) {
      const errDes: string[] = [];
      for (let i = 0; i < activity.meetingTargets.length; i++){
          errDes.push('');
      }
      setErrDescr(errDes);
    }
  }
  
  // ... (Ensure state is initialized correctly at the top of the component)
// const [activity, setActivity] = useState<Activity>(activityObj); 
// ...

  function changeTitle(text: string) {
    const value = text.replace(/<\/?[^>]*>/g, "");
    // FIX: Remove the conditional check. prevState is always an Activity object here.
    setActivity((prevState) => ({...prevState, title: value}));
  }

  function changeStartDate(value: Date) {
    // FIX: Remove the conditional check.
    setActivity((prevState) => ({...prevState, startTime: value.getTime()}));
  }

  function changeEndDate(value: Date) {
    // FIX: Remove the conditional check.
    setActivity((prevState) => ({...prevState, endTime: value.getTime()}));
  }

  function addMeetingTargets() {
    // FIX: The outer 'if (activity)' check is redundant because 'activity' is never undefined.
    // We only need to handle the optional 'meetingTargets' array property within the update logic.

    setActivity((prevState) => {
      // If meetingTargets exists, copy it. Otherwise start a new array.
      const mTargets = prevState.meetingTargets ? [...prevState.meetingTargets] : [];
      mTargets.push({name:'', email: ''});
      return {...prevState, meetingTargets: mTargets};
    });
    
    setErrDescr((prevState) => [...prevState, '']);
  }

  function minusMeetingTargets() {
    // We can assume `activity` exists now
    if (activity.meetingTargets) { // Check if the optional array property is present
      const mTargets = activity.meetingTargets.slice();
      const errDes = errDescr.slice();
      mTargets.pop();
      
      // FIX: The type is now compatible because prevState is guaranteed to be a full Activity
      setActivity((prevState) => ({...prevState, meetingTargets: mTargets}));
      
      errDes.pop();
      setErrDescr(errDes);
    }
  }
function handleMeetingTargetName(text: string, idx: number){
    // 'activity' is now guaranteed to exist. We check if 'meetingTargets' array is present.
    if (activity.meetingTargets) {
      // Use functional update for race condition safety
      setActivity((prevState) => {
        // We can safely use non-null assertion '!' here if logic guarantees it
        const mTargets = [...prevState.meetingTargets!]; 
        mTargets[idx].name = text.replace(/<\/?[^>]*>/g, "");
        return {...prevState, meetingTargets: mTargets};
      });
    }
  }

  function handleMeetingTargetEmail(text: string, idx: number){
    if (activity.meetingTargets) {
      // Use functional update for race condition safety
      setActivity((prevState) => {
        const mTargets = [...prevState.meetingTargets!];
        mTargets[idx].email = text.replace(/<\/?[^>]*>/g, "").trim();
        return {...prevState, meetingTargets: mTargets};
      });
    }
  }
 
  function handleSetErrDescr(descr: string, idx: number){
    if (idx >= errDescr.length){
       return;
    }
    const errDes = [...errDescr]; // Use spread for clean copy
    errDes[idx] = descr;
    setErrDescr(errDes);
  }
  
  function changeSendConfirm(bol: boolean){
    // FIX: Removed the conditional logic. prevState is guaranteed to be type Activity.
    setActivity((prevState) => ({...prevState, sendConfirm: bol}));
  }

  function changeDescription(text: string){
    const value = text.replace(/<\/?[^>]*>/g, "");
    // FIX: Removed the conditional logic.
    setActivity((prevState) => ({...prevState, description: value}));
  }
  function resetErrMsg(){
    setTitleErr('');
    setDatesErr('');
    const errDes = [];
    for (let i = 0; i < errDescr.length; i++){
       errDes.push('');
    }
    setErrDescr(errDes);
  }

function sortOutMeetingTargets() {
    // We assume 'activity' is defined, we just check the optional array property
    if (!activity.meetingTargets || activity.meetingTargets.length === 0){
       return;
    }
    const mTargets: MeetingTarget[] = [];
    const errDes: string[] = []; 
    for (let i = 0; i < activity.meetingTargets.length; i++){
       const currentTarget = activity.meetingTargets[i];
       if (currentTarget.name.trim()){
          if (!currentTarget.email){
             mTargets.push(currentTarget);
             errDes.push('');
          }else{
             const target = mTargets.find(item => item.email === currentTarget.email);
             if (!target){
                mTargets.push(currentTarget);
                errDes.push('');
             }
          }
       }
    }
    
    // FIX: Removed the conditional logic. prevState is guaranteed to be type Activity here.
    setActivity((prevState) => ({...prevState, meetingTargets: mTargets}));
    
    setErrDescr(errDes);
  }


  async function updateGo() {
    try {
      // Assuming sortOutMeetingTargets and firestore are correctly defined/accessible
      // sortOutMeetingTargets(); // Assuming this is defined elsewhere
      setInPost(true);
      
      if (!firestore || !user) {
        console.error("Firestore instance or user is not available.");
        setInPost(false);
        return;
      }
      
      // Get the ID of the activity to update
      const activityId = activity.id;

      // Create a reference to the specific document in the 'schedules' collection
      const scheduleRef = firestore.collection('schedules').doc(activityId);

      // Create an object with the data to be updated
      const updatedData = {
        userName: user?.name, // Use the user object from context
        timezone, // Assuming timezone is defined
        activity: { ...activity },
      };

      // Use `update` to update the document
      await scheduleRef.update(updatedData);

      setInPost(false);

      // After a successful update, handle the client-side data
      const scheduleStore: string | null = await AsyncStorage.getItem('schedule');
      const schedule: Activity[] = scheduleStore ? JSON.parse(scheduleStore) : [];
      const idx = schedule.findIndex(item => item.id === activityId);
      if (idx > -1) {
        const updatedActivity = {
          ...schedule[idx],
          ...updatedData,
        };
        schedule[idx] = updatedActivity;
        await AsyncStorage.setItem('schedule', JSON.stringify(schedule));
      }

      navigation.navigate('index');

    } catch (error) {
      setInPost(false);
      console.error("Error updating document: ", error);
      alert("An error occurred while updating the schedule.");
    }
  }

  function confirmDelete(){
    if (!user){
      return;
    }
    Alert.alert(
      "Delete Activity",
      "Are you sure to delete this scheduled activity?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => deleteActivity() } // Assuming deleteActivity is defined
      ]
    );
  }
  
  async function deleteActivity(){
  try {
    setInPost(true);

    if (!firestore) {
      console.error("Firestore instance is not available.");
      return;
    }

    // Create a document reference to the specific activity using its ID
    const docRef = firestore.collection("schedules").doc(activityObj.id);

    // Use the `delete` method on the document reference to remove the document
    await docRef.delete();

    setInPost(false);

    // Remove the activity from AsyncStorage
    const scheduleStore: string | null = await AsyncStorage.getItem('schedule');
    const schedule: Activity[] = scheduleStore ? JSON.parse(scheduleStore) : [];
    const updatedSchedule = schedule.filter((item) => item.id !== activityObj.id);
    await AsyncStorage.setItem('schedule', JSON.stringify(updatedSchedule));

    navigation.navigate('index');

  } catch(error) {
    setInPost(false);
    console.error("Error deleting activity:", error);
    // You might want to show an alert to the user here
  }
}

  const currTime = (new Date().getTime()) / 1000;   
  if (inEditing && activityObj.startTime >= currTime && activityObj.endTime >= currTime){
  return (
    <SafeAreaView style={styles2.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        scrollEnabled={true}
        style={styles2.scrollView}
        >
          <View style={[styles2.listItem, styles2.itemRight]}>
            <Button icon="close" mode="outlined" style={{marginLeft: 10}} onPress={() => navigation.navigate('index')}>
               Close
            </Button>
          </View> 
          <View>
            <TextInput
              mode='outlined'
              label="Title"
              placeholder="Title"
              value={activity.title}
              onChangeText={text => changeTitle(text)}
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
                {/* Assuming activity.startTime is guaranteed to exist */}
                {getDateString(new Date(activity.startTime*1000))} 
                </Button>
                <Text>--</Text>
                <Button 
                  mode='outlined'
                  color='black'
                  onPress={() => setEndDatePicker(true)}
                  >
                  {/* Assuming activity.endTime is guaranteed to exist */}
                  {getDateString(new Date(activity.endTime*1000))} 
                </Button>
             </View>
             <Text style={{color: 'red'}}>{dateserr}</Text>
             <DateTimePickerModal
                date={new Date(activity.startTime*1000)}
                isVisible={startDatePicker}
                mode="datetime"
                onConfirm={(date) => {changeStartDate(date);setStartDatePicker(false);}}
                onCancel={() => setStartDatePicker(false)}
                />
             <DateTimePickerModal
                date={new Date(activity.endTime*1000)}
                isVisible={endDatePicker}
                mode="datetime"
                onConfirm={(date) => {changeEndDate(date);setEndDatePicker(false);}}
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
                {/* FIX: Use optional chaining ?. before accessing .length */}
                {(activity.meetingTargets?.length ?? 0) > 0 && 
                 <Button 
                   mode='outlined'
                   icon='minus'
                   onPress={() => minusMeetingTargets()}
                 >
                  Reduce
                 </Button>
                }
             </View>
             {/* FIX: Check that meetingTargets exists AND has length before mapping */}
             {activity.meetingTargets && activity.meetingTargets.length > 0 &&
                // We use the non-null assertion operator (!) on activity.meetingTargets 
                // within the value prop access where the error occurs
                activity.meetingTargets.map((item, index) => 
                  <View key={index}>
                     <TextInput
                        mode="flat"
                        label="Name"
                        placeholder="Name"
                        // FIX: Added '!' here
                        value={activity.meetingTargets![index].name} 
                        onChangeText={(text) => handleMeetingTargetName(text, index)}
                      />
                     <TextInput
                        mode="flat"
                        label="Email"
                        placeholder="Email"
                        // FIX: Added '!' here
                        value={activity.meetingTargets![index].email} 
                        onChangeText={(text) => handleMeetingTargetEmail(text, index)}
                        autoCapitalize="none"
                        autoComplete="email"
                        keyboardType="email-address"
                      />
                     <Text style={{color: 'red'}}>{errDescr[index]}</Text> 
                  </View>
                )
             } 
             {/* FIX: Check that meetingTargets exists AND has length before rendering switch */}
             {activity.meetingTargets && activity.meetingTargets.length > 0 &&
             <View style={styles2.itemLeft}>
                <Text>Send Confirmation Emails: </Text>
                {/* FIX: Use nullish coalescing ?? to provide a default boolean if undefined */}
                <Switch value={activity.sendConfirm ?? false} onValueChange={() => changeSendConfirm(!activity.sendConfirm)} /> 
             </View>
             } 
          </View>
          <View style={styles2.listItem}>
            {/* FIX: Use nullish coalescing ?? to provide a default string if undefined */}
            <TextInput
              mode='outlined'
              label="Description"
              placeholder="Description"
              value={activity.description ?? ''}
              multiline={true}
              numberOfLines={5}
              onChangeText={text => changeDescription(text)}
              />
          </View> 
          <View style={[styles2.listItem, styles2.itemLeft]}>
            <Button mode="contained" style={{marginRight: 20}} onPress={() => updateGo()}>
             Go Update
            </Button>
            <Button mode="contained" style={{marginRight: 20}} onPress={() => setActivity(activityObj)}>
             Reset
            </Button>
          </View> 
      {inPost &&
      <View style={styles2.loading}>
        <ActivityIndicator size="large" animating={true} color={primaryColor} />
      </View>
      }
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
  }
  
  return (
    <SafeAreaView style={styles2.container}>
      <KeyboardAvoidingView  
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles2.container}>
        <ScrollView style={styles2.scrollView}>
          <View style={[styles2.listItem, styles2.itemRight]}>
            {activityObj.startTime >= currTime && activityObj.endTime >= currTime &&
              <Button icon="pencil" style={{marginLeft: 10}} mode="outlined" onPress={() => {setInEditing(true); navigation.setOptions({ title: 'Update Scheduled Activity' })}}>
               Edit
              </Button>  
            }
            <Button icon="delete" style={{marginLeft: 10}} mode="outlined" onPress={() => confirmDelete()}>
              Delete
            </Button>  
            <Button icon="close" mode="outlined" style={{marginLeft: 10}} onPress={() => navigation.navigate('index')}>
               Close
            </Button>
          </View> 
          {activityObj &&
          <>
            <View style={styles2.listItem}>
              <Text style={{fontSize: 16}}>{activityObj.title}</Text>
            </View>  
            <View style={styles2.listItem}>
              <Text style={{fontSize: 16}}>{getDateString(new Date(activityObj.startTime*1000))} -- {getDateString(new Date(activityObj.endTime*1000))}</Text>
            </View>
            {activityObj &&
            <>
            {(activityObj.meetingTargets?.length ?? 0) > 0 &&
            <> 
            <View style={styles2.listItem}>
              <Text style={{fontSize: 16, lineHeight: 24}}>Meeting Targets:</Text>
              {/* No changes needed to map signature */}
              {activityObj.meetingTargets!.map((item: MeetingTarget, index: number) =>
              <View key={index} style={styles2.itemLeft}>
                <Text style={{fontSize: 16, lineHeight: 24}}>{item.name}{item.email ? ` - ${item.email}`: ''}    </Text>
                
                {/* FIX 2: This check now works because 'confirm' is in the interface */}
                {item.confirm &&
                <>
                  <MaterialIcons name='check' size={20} /><Text style={{fontSize: 16, lineHeight: 24}}>accepted</Text>
                </> 
                }
              </View>  
              )}
              <View style={styles2.itemLeft}>
                <Text style={{fontSize: 16, lineHeight: 24}}>Send Confirmation Emails: </Text>
                {/* Use nullish coalescing for sendConfirm check */}
                <MaterialIcons name={activityObj.sendConfirm ? 'check-box':'check-box-outline-blank'} size={20} />
              </View>
            </View>
            </>
            }
            </>
            }
            <View>
               <Text>{activityObj.description}</Text>
            </View> 
          </>  
          }
        </ScrollView>
        {inPost &&
          <View style={styles2.loading}>
             <ActivityIndicator size="large" animating={true} color={primaryColor} />
          </View>
        }
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}