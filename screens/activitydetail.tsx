import React, { useRef, useState } from 'react';
//import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { useAuth } from '../context/AuthContext';
import { firestore } from '../lib/firebase';
import { getDateString, timezone } from '../lib/utils';
import { Activity, MeetingTarget, UserContextType } from '../navigation/RootStackParamList';
import { styles2 } from '../styles/css';

export default function ReviewActivity({ navigation, route }: {navigation: any; route: any;}) {
  const userContext: UserContextType =  useAuth();
  const { activityObj } = route.params || {};
  const [inEditing, setInEditing] = useState(false);
  const [inPost, setInPost] = useState(false);
  const [activity, setActivity] = useState<Activity>(activityObj);
  const [titleerr, setTitleErr] = useState('');
  const titleEl = useRef(null);
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
  
      // To get a specific color, access the `colors` property on the theme
      const primaryColor = theme.colors.primary;

  function adjustErrDescr(){
    const errDes: string[] = [];
    for (let i = 0; i < activity.meetingTargets.length; i++){
        errDes.push('');
    }
    setErrDescr(errDes);
  }
  
  function changeTitle(text: string) {
    const value = text.replace(/<\/?[^>]*>/g, "");
    setActivity((prevState) => ({...prevState, title: value}));
  }

  function changeStartDate(value: Date) {
    setActivity((prevState) => ({...prevState, startTime: value.getTime()/1000}));
  }

  function changeEndDate(value: Date) {
    setActivity((prevState) => ({...prevState, endTime: value.getTime()/1000}));
  }

  function addMeetingTargets() {
    const mTargets = activity.meetingTargets.slice();
    mTargets.push({name:'', email: ''});
    setActivity((prevState) => ({...prevState, meetingTargets: mTargets}));
    setErrDescr((prevState) => [...prevState, '']);
  }

  function minusMeetingTargets() {
    const mTargets = activity.meetingTargets.slice();
    const errDes = errDescr.slice();
    mTargets.pop();
    setActivity((prevState) => ({...prevState, meetingTargets: mTargets}));
    errDes.pop();
    setErrDescr(errDes);
  }

  function handleMeetingTargetName(text: string, idx: number){
    const mTargets = activity.meetingTargets.slice();
    mTargets[idx].name = text.replace(/<\/?[^>]*>/g, "");
    setActivity((prevState) => ({...prevState, meetingTargets: mTargets}));
  }

  function handleMeetingTargetEmail(text: string, idx: number){
    const mTargets = activity.meetingTargets.slice();
    mTargets[idx].email = text.replace(/<\/?[^>]*>/g, "").trim();
    setActivity((prevState) => ({...prevState, meetingTargets: mTargets}));
  }
 
  function handleSetErrDescr(descr: string, idx: number){
    if (idx>= errDescr.length){
       return;
    }
    const errDes = errDescr.slice();
    errDes[idx] = descr;
    setErrDescr(errDes);
  }
  
  function changeSendConfirm(bol: boolean){
    setActivity((prevState) => ({...prevState, sendConfirm: bol}));
  }

  function changeDescription(text: string){
    const value = text.replace(/<\/?[^>]*>/g, "");
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
    if (!activity.meetingTargets.length){
       return;
    }
    const mTargets: MeetingTarget[] = [];
    const errDes = [];
    for (let i = 0; i < activity.meetingTargets.length; i++){
       if (activity.meetingTargets[i].name.trim()){
          if (!activity.meetingTargets[i].email){
             mTargets.push(activity.meetingTargets[i]);
             errDes.push('');
          }else{
             const target = mTargets.find(item => item.email == activity.meetingTargets[i].email);
             if (!target){
                mTargets.push(activity.meetingTargets[i]);
                errDes.push('');
             }
          }
       }
    }
    setActivity((prevState) => ({...prevState, meetingTargets: mTargets}));
    setErrDescr(errDes);
  }  

  async function updateGo() {
  try {
    sortOutMeetingTargets();
    setInPost(true);

    // Get the ID of the activity to update
    const activityId = activity.id;

    // Create a reference to the specific document in the 'schedules' collection
    const scheduleRef = firestore().collection('schedules').doc(activityId);

    // Create an object with the data to be updated
    const updatedData = {
      userName: userContext.user?.name,
      timezone,
      activity: { ...activity }, // Make sure to use the latest state or a copy
      // You can also add specific fields from activityObj here
    };

    // Use `update` to update the document
    await scheduleRef.update(updatedData);

    setInPost(false);

    // After a successful update, handle the client-side data
    const scheduleStore: string | null = await AsyncStorage.getItem('schedule');
    const schedule: Activity[] = scheduleStore ? JSON.parse(scheduleStore) : [];
    const idx = schedule.findIndex(item => item.id === activityId);
    if (idx > -1) {
      // Create a new updated activity object based on the local state
      const updatedActivity = {
        ...schedule[idx],
        ...updatedData,
        // Ensure you have a complete, updated activity object here.
      };
      schedule[idx] = updatedActivity;
      await AsyncStorage.setItem('schedule', JSON.stringify(schedule));
    }

    navigation.navigate('Scheduler');

  } catch (error) {
    setInPost(false);
    console.error("Error updating document: ", error);
    alert("An error occurred while updating the schedule.");
  }
}

    function confirmDelete(){
      if (!userContext){
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
          { text: "Yes", onPress: () => deleteActivity() }
        ]
      );
    }
  
  async function deleteActivity(){
  try {
    setInPost(true);

    // Create a document reference to the specific activity using its ID
    const docRef = firestore().collection("schedules").doc(activityObj.id);

    // Use the `delete` method on the document reference to remove the document
    await docRef.delete();

    setInPost(false);

    // Remove the activity from AsyncStorage
    const scheduleStore: string | null = await AsyncStorage.getItem('schedule');
    const schedule: Activity[] = scheduleStore ? JSON.parse(scheduleStore) : [];
    const updatedSchedule = schedule.filter((item) => item.id !== activityObj.id);
    await AsyncStorage.setItem('schedule', JSON.stringify(updatedSchedule));

    navigation.navigate('Scheduler');

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
            <Button icon="close" mode="outlined" style={{marginLeft: 10}} onPress={() => navigation.navigate('Scheduler')}>
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
                {getDateString(new Date(activity.startTime*1000))} 
                </Button>
                <Text>--</Text>
                <Button 
                  mode='outlined'
                  color='black'
                  onPress={() => setEndDatePicker(true)}
                  >
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
                {activity.meetingTargets.length > 0 &&
                 <Button 
                   mode='outlined'
                   icon='minus'
                   onPress={() => minusMeetingTargets()}
                 >
                  Reduce
                 </Button>
                }
             </View>
             {activity.meetingTargets.length > 0 &&
                activity.meetingTargets.map((item, index) => 
                  <View key={index}>
                     <TextInput
                        mode="flat"
                        label="Name"
                        placeholder="Name"
                        value={activity.meetingTargets[index].name}
                        onChangeText={(text) => handleMeetingTargetName(text, index)}
                      />
                     <TextInput
                        mode="flat"
                        label="Email"
                        placeholder="Email"
                        value={activity.meetingTargets[index].email}
                        onChangeText={(text) => handleMeetingTargetEmail(text, index)}
                        autoCapitalize="none"
                        autoComplete="email"
                        keyboardType="email-address"
                      />
                     <Text style={{color: 'red'}}>{errDescr[index]}</Text> 
                  </View>
                )
             } 
             {activity.meetingTargets.length > 0 &&
             <View style={styles2.itemLeft}>
                <Text>Send Confirmation Emails: </Text>
                <Switch value={activity.sendConfirm} onValueChange={() => changeSendConfirm(!activity.sendConfirm)} /> 
             </View>
             } 
          </View>
          <View style={styles2.listItem}>
            <TextInput
              mode='outlined'
              label="Description"
              placeholder="Description"
              value={activity.description}
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
  
  return (userContext &&
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
            <Button icon="close" mode="outlined" style={{marginLeft: 10}} onPress={() => navigation.navigate('Scheduler')}>
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
            {activityObj.meetingTargets.length > 0 &&
            <> 
            <View style={styles2.listItem}>
              <Text style={{fontSize: 16, lineHeight: 24}}>Meeting Targets:</Text>
              {activityObj.meetingTargets.map((item: MeetingTarget, index: number) =>
              <View key={index} style={styles2.itemLeft}>
                <Text style={{fontSize: 16, lineHeight: 24}}>{item.name}{item.email ? ` - ${item.email}`: ''}    </Text>
                {item.confirm &&
                <>
                  <MaterialIcons name='check' size={20} /><Text style={{fontSize: 16, lineHeight: 24}}>accepted</Text>
                </> 
                }
              </View>  
              )}
              <View style={styles2.itemLeft}>
                <Text style={{fontSize: 16, lineHeight: 24}}>Send Confirmation Emails: </Text><MaterialIcons name={activityObj.sendConfirm ? 'check-box':'check-box-outline-blank'} size={20} />
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