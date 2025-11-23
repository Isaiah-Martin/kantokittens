// app.config.js
// This line loads variables from your .env file into process.env (for local use)
import 'dotenv/config';

export default ({ config }) => {
  // Define variables for clarity and use in conditional checks
  const iosGoogleServicesFile = process.env.GOOGLE_SERVICES_PLIST;
  const androidGoogleServicesFile = process.env.GOOGLE_SERVICES_FILE;

  // Build the configuration object conditionally
  const newConfig = {
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
        projectId: "550817e5-f337-497e-9073-5bf83bb53762"
      }
    },
    // --- NATIVE CONFIGURATION BLOCKS (Using conditional spread syntax) ---
    android: {
      ...config.android,
      // Only add the googleServicesFile property if the env var is defined
      ...(androidGoogleServicesFile && { googleServicesFile: androidGoogleServicesFile }),
    },
    ios: {
      ...config.ios,
      // Only add the googleServicesFile property if the env var is defined
      ...(iosGoogleServicesFile && { googleServicesFile: iosGoogleServicesFile }),
    },
    // ------------------------------------
  };

  return newConfig;
};
