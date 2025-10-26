import { NavigatorScreenParams } from '@react-navigation/native';
import { AppTabsParamList } from './AppTabsParamList'; // Create this file as described below

export interface UserJwtPayload {
    uid: string;
}

export interface ActivityJwtPayload {
    uid: string;
    id: string;
}

// Define types for the authentication stack screens
export type AuthStackParamList = {
  Login: undefined;
  UserJoin: undefined;
  ForgotPassword: { userEmail: string } | undefined; 
  LogoutScreen: undefined;
  LoginScreen: undefined;
  UserJoinScreen: undefined; // UserJoin screen takes no parameters
};

// Define types for the main app stack, which contains the tabs
export type AppStackParamList = {
  AppTabs: NavigatorScreenParams<AppTabsParamList>;
  // ... other app stack screens if any
  Home: undefined; // Home screen takes no parameters
  BookingScreen: undefined;
  AddBooking: undefined;
  UserInfoScreen: undefined;
  LogoutScreen: undefined;
  ActivityDetail: undefined;
  LoginedStack: undefined;
  Logout: undefined;
};

// Define the list of screens and their parameters
export type RootStackParamList = {
  Home: undefined; // Home screen takes no parameters
  UserJoinScreen: undefined; // UserJoin screen takes no parameters
  ForgotPassword: { userEmail: string } | undefined;
  BookingScreen: undefined;
  AddBooking: undefined;
  UserInfoScreen: undefined;
  LogoutScreen: undefined;
  LoginScreen: undefined;
  ActivityDetail: undefined;
  LoginedStack: undefined;
  Login: undefined;
  Logout: undefined;
  // The 'AuthStack' screen's params are the param list of the auth stack
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  // The 'AppStack' screen's params are the param list of the main app stack
  AppStack: NavigatorScreenParams<AppStackParamList>; 
};

export interface UserData {
    uid: string;
    email: string;
    name: string;
    password: string;
    created: string;
    token: string;
}

export interface UserContextType {
    isLoggedIn: boolean; 
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}


export interface User {
    uid?: string;
    email?: string;
    name?: string;
    token?: string;
    logintime?: number;
}

export interface Activity {
    id: string;
    title: string;
    startTime: number;
    endTime: number;
    meetingTargets: MeetingTarget[];
    sendConfirm: boolean;
    description: string;
    created: string;
    removed?: boolean; 
}

export interface MeetingTarget {
    name: string;
    email: string;
    send?: boolean;
    confirm?: boolean;
}

export interface ActivityUser {
    uid: string;
    userName: string;
}

export type ActivityDetail = Activity & ActivityUser;

export interface Activities {
    result: Activity[];
    removedact: string[];
}

export interface UserUpdate{
    user_update: number;
}

export interface AcceptInvitation{
    accept_invitation: number;
}

export interface RemoveDone{
    remove_done: number;
}

export interface NoAccount{
    no_account: number;
}

export interface PasswdErr{
    password_error: number;
}

export interface NoAuthorization{
    no_authorization: number;
}

export interface DuplicateEmail{
    duplicate_email: number;
}

export interface NoMeeting{
    no_meeting: number;
}

export interface AppointPeriod {
    startTime: number;
    endTime: number;
}

export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}
 