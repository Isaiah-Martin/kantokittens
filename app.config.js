// app.config.js
module.exports = ({ config }) => {
  const newConfig = { ...config };
  newConfig.ios = {
    ...newConfig.ios,
    // Use the EAS secret in builds, local file for prebuild
    googleServicesFile: process.env.GOOGLE_SERVICES_PLIST || './GoogleService-Info.plist',
  };
  newConfig.android = {
    ...newConfig.android,
    // Use the EAS secret in builds, local file for prebuild
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
  };
  return newConfig;
};
