// app.config.js
module.exports = ({ config }) => {
  const newConfig = { ...config };
  newConfig.ios = {
    ...newConfig.ios,
    googleServicesFile: process.env.GOOGLE_SERVICES_PLIST,
  };
  newConfig.android = {
    ...newConfig.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
  };
  return newConfig;
};
