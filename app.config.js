// app.config.js
// This line loads variables from your .env file into process.env (for local use)
import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    // Add the 'extra' field to store your public environment variables
    extra: {
      ...config.extra, // Keep any existing extra variables
      EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      EXPO_PUBLIC_FIREBASE_DATABASE_URL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
      eas: {
        projectId: "550817e5-f337-497e-9073-5bf83bb53762" // Replace with your Expo Application Services Project ID
      }
    },
    // --- NATIVE CONFIGURATION BLOCKS ---
    android: {
      // Keep existing android configuration
      ...config.android,
      // Tell the config plugin to look for the file in the GOOGLE_SERVICES_FILE environment variable
      googleServicesFile: process.env.GOOGLE_SERVICES_FILE,
    },
    ios: {
      // Keep existing ios configuration
      ...config.ios,
      // Tell the config plugin to look for the file in the GOOGLE_SERVICES_PLIST environment variable
      // Ensure GOOGLE_SERVICES_PLIST is the exact name of your secret on Expo Dev site
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST,
    },
    // ------------------------------------
  };
};
