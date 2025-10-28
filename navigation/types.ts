// navigation/types.ts

import type { NavigatorScreenParams } from '@react-navigation/native';

// The root of your app
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppStack: NavigatorScreenParams<AppStackParamList>;
};

// Screens for unauthenticated users
export type AuthStackParamList = {
  login: undefined;
  'sign-up': undefined;
  'forgot-password': { userEmail: string } | undefined;
};

// Screens for authenticated users
export type AppStackParamList = {
  AppTabs: NavigatorScreenParams<AppTabsParamList>;
  settings: undefined;
};

// Screens in the tab bar
export type AppTabsParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  logout: undefined;
};

export type HomeStackParamList = {
  index: object | undefined;
  booking: { [key: string]: string | undefined } | undefined; // Use a more appropriate type for search params
  'add-booking': object | undefined;
  settings: object | undefined;
  'review-activity': object | undefined;
  'activity-detail': object | undefined;
};

export interface User {
  uid: string;
  email: string;
  name?: string;
}

// Define the type for the AuthContext value
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}