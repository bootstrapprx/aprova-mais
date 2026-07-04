import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.aprova.mais",
  appName: "Aprova+",
  webDir: "out",

  server: {
    url: process.env.CAPACITOR_SERVER_URL || undefined,
    cleartext: true,
    androidScheme: "https",
  },

  android: {
    buildOptions: {
      keystorePath: process.env.ANDROID_KEYSTORE_PATH || undefined,
      keystorePassword: process.env.ANDROID_KEYSTORE_PASSWORD || undefined,
      keystoreAlias: process.env.ANDROID_KEYSTORE_ALIAS || undefined,
      keystoreAliasPassword:
        process.env.ANDROID_KEYSTORE_ALIAS_PASSWORD || undefined,
    },
  },

  ios: {
    scheme: "Aprova+",
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
    },
  },
};

export default config;
