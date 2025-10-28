// app.config.js

export default ({ config }) => {
  return {
    ...config,
    // Add Firebase configuration to the android and ios sections
    android: {
      ...config.android,
      // Fallback to local file in development, use the EAS secret in builds
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
    },
    ios: {
      ...config.ios,
      // Fallback to local file in development, use the EAS secret in builds
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST || './GoogleService-Info.plist',
    },
  };
};
