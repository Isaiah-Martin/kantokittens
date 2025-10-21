import * as Localization from 'expo-localization';

// Get the first calendar entry from the getCalendars() method
const firstCalendar = Localization.getCalendars()[0];

// The timezone property is on the calendar object, not the main Localization object
const timeZone = firstCalendar.timeZone;

export const timezone: string = firstCalendar.timeZone ?? 'Unknown';

//export const timezone: string = Localization.timezone;

export function getDateString(dateObj: Date){
    return `${dateObj.toLocaleDateString('en-US')} ${dateObj.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}`;
}