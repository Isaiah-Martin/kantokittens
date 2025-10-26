import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// 1. Root Stack: Switches between the Auth and App flows
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppStack: NavigatorScreenParams<AppStackParamList>;
};

// 2. Auth Stack: Contains login/auth screens
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: { userEmail: string } | undefined;
};

// 3. App Stack: Contains the main app screens, including the tabs and standalone screens
export type AppStackParamList = {
  AppTabs: NavigatorScreenParams<AppTabsParamList>;
  Settings: undefined; // A screen that is NOT in the tab bar
};

// 4. App Tabs: Contains the bottom tab bar and its screens
export type AppTabsParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>; // Home tab containing a stack
  Logout: undefined; // A simple tab screen
};

// 5. Home Stack: A stack nested inside the "HomeTab"
export type HomeStackParamList = {
  Home: undefined; // The root of the Home stack
  Booking: undefined;
  AddBooking: undefined;
  Settings: undefined;
  ReviewActivity: undefined;
  ActivityDetail: undefined;
};

// 6. Individual Screen Props
// Props for the Settings screen (part of AppStack)
export type SettingsScreenProps = NativeStackScreenProps<AppStackParamList, 'Settings'>;

// Props for the UserInfo screen (part of HomeStack, which is in AppTabs, which is in AppStack)
// This is where CompositeScreenProps is crucial. It combines the navigation types.
export type UserInfoScreenProps = CompositeScreenProps<
  // Primary: The props for the navigator that directly contains the screen (HomeStack)
  NativeStackScreenProps<HomeStackParamList, 'Settings'>,
  // Secondary: The props for the parent navigators (AppTabs and AppStack)
  CompositeScreenProps<
    BottomTabScreenProps<AppTabsParamList>,
    NativeStackScreenProps<AppStackParamList>
  >
>;