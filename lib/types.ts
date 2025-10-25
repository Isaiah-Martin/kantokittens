export interface UserJwtPayload {
    userId: string;
}

export interface ActivityJwtPayload {
    userId: string;
    id: string;
}

// Define the list of screens and their parameters
export type RootStackParamList = {
  Home: undefined; // Home screen takes no parameters
  UserJoinScreen: undefined; // UserJoin screen takes no parameters
  ForgotPasswd: {userEmail: string};
  BookingScreen: undefined;
  AddBooking: undefined;
  UserInfo: undefined;
  ActivityDetail: undefined;
  LogoutScreen: undefined;
  LoginScreen: undefined;
  Login: undefined;
  Logout: undefined;
  // Add other screens here
  //Profile: { userId: string }; // Example screen with a parameter
};

// Client-Side Context User Object
export interface User {
  uid?: string; // 
  email: string;
  name: string;
  created?: string; 
}

// This interface defines the contract for your context value.
export interface UserContextType {
  isLoggedIn: boolean;
  user: User | null | undefined; // User is an object or null if not logged in.
  loading: boolean;
  // asynchronous actions available through the context
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface Activity {
    id: string;
    title: string;
    startTime: number;
    endTime: number;
    meetingTargets: MeetingTarget[];
    sendConfirm: boolean;
    description: string;
    created: string; // The Firestore timestamp as a string
}

export interface MeetingTarget {
    name: string;
    email: string;
    send?: boolean;
    confirm?: boolean;
}

export interface ActivityUser {
    userId: string;
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
 