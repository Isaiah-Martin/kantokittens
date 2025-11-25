// navigation/types.ts

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Import the correct types for Firebase services
// Use 'any' for flexibility across web/native if type imports are complex
type FirebaseDatabaseInstance = any; 
type FirebaseAuthInstance = any;
type FirebaseFirestoreInstance = any;
type FirebaseAppInstance = any; // <-- ADDED APP TYPE DEFINITION


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
  index: object | undefined; 
  booking: undefined;
  'add-booking': undefined;
  settings: undefined;
  'review-activity': undefined; // Assuming this is also a screen that takes the object
  'activity-detail': { activityObj: Activity }; // <-- FIX THIS LINE
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


// --- Data Models and Interfaces (REVISED SECTION) ---
export interface UserJwtPayload { uid: string; }
export interface ActivityJwtPayload { uid: string; id: string; }

// Defines the structure for meeting attendees
export interface MeetingTarget {
  name: string;
  email: string;
  confirm?: boolean;
}

// Defines the structure for a saved activity/booking
export interface Activity {
  id: string; // Document ID (added for client-side use)
  title: string;
  // Changed from `startDate: Date;` to `startTime: number;` to match your Firestore logic
  startTime: number; 
  // Changed from `endDate: Date;` to `endTime: number;` to match your Firestore logic
  endTime: number;
  // Added optional fields used in the booking form logic
  description?: string;
  sendConfirm?: boolean;
  meetingTargets?: MeetingTarget[];
  timezone?: string;
  ownerId: string; // Added ownerId field
  created: number | string; // Use number (timestamp) or string (ISO string)
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

// --- Firebase Context Interface (UPDATED) ---
// Define the properties expected from the Firebase Context
export interface FirebaseContextProps {
  app: FirebaseAppInstance | null; // <-- ADDED: The 'app' property definition
  auth: FirebaseAuthInstance;
  firestore?: FirebaseFirestoreInstance; // Mark firestore as optional
  database: FirebaseDatabaseInstance | null | undefined; // Add the database property
  isReady: boolean;
}
