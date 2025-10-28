
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
  SignUp: undefined;
  ForgotPassword: { userEmail: string } | undefined; 
  Logout: undefined;
  UserJoin: undefined; // UserJoin screen takes no parameters
};

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
 