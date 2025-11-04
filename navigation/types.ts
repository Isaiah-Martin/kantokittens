// navigation/types.ts
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// --- 1. Root Stack: Switches between the Auth and App flows ---
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppStack: NavigatorScreenParams<AppStackParamList>;
};

// --- 2. Auth Stack: Contains login/auth screens ---
export type AuthStackParamList = {
  login: undefined;
  'sign-up': undefined;
  'forgot-password': { userEmail: string } | undefined;
  logout: undefined;
  'user-join': undefined; // user-join screen takes no parameters
};

// --- 3. App Stack: Contains the main app screens, including the tabs and standalone screens ---
export type AppStackParamList = {
  AppTabs: NavigatorScreenParams<AppTabsParamList>;
  settings: undefined; // A screen that is NOT in the tab bar
};

// --- 4. App Tabs: Contains the bottom tab bar and its screens ---
export type AppTabsParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>; // Home tab containing a stack
  logout: undefined; // A simple tab screen
};

// --- 5. Home Stack: A stack nested inside the "HomeTab" ---
export type HomeStackParamList = {
  index: object | undefined; // The root of the Home stack
  booking: undefined;
  'add-booking': undefined;
  settings: undefined;
  'review-activity': undefined;
  'activity-detail': undefined;
};


// --- 6. Individual Screen Props for Type Safety (Advanced) ---
// Props for the Settings screen (part of AppStack)
export type SettingsScreenProps = NativeStackScreenProps<AppStackParamList, 'settings'>;

// Props for the ActivityDetail screen (part of HomeStack)
export type ActivityDetailScreenProps = CompositeScreenProps<
  // Primary: The props for the navigator that directly contains the screen (HomeStack)
  NativeStackScreenProps<HomeStackParamList, 'activity-detail'>,
  // Secondary: The props for the parent navigators (AppTabs and AppStack)
  CompositeScreenProps<
    BottomTabScreenProps<AppTabsParamList>,
    NativeStackScreenProps<AppStackParamList>
  >
>;


// --- Data Models and Interfaces ---

export interface UserJwtPayload {
    uid: string;
}

export interface ActivityJwtPayload {
    uid: string;
    id: string;
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

export type ActivityDetailType = Activity & ActivityUser;

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

// --- Auth Context Interface ---
export interface User {
  uid: string;
  email: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}
