// Environment variable access
const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "";
const FIREBASE_AUTH_DOMAIN = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "";
const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "";
const FIREBASE_STORAGE_BUCKET = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
const FIREBASE_MESSAGING_SENDER_ID = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "";
const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "";
const FIREBASE_MEASUREMENT_ID = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "";

// Get OAuth Client ID from environment variable or set to empty string
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "";

export default {
  owner: "wilby-org",
  name: "Zen",
  slug: "zen-meditation-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#F5F2EB"
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.zenmeditation.app",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#F5F2EB"
    },
    package: "com.zenmeditation.app"
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  // Remove plugins for web version
  plugins: [],
  extra: {
    // Pass environment variables to app
    firebaseApiKey: FIREBASE_API_KEY,
    firebaseAuthDomain: FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: FIREBASE_PROJECT_ID,
    firebaseStorageBucket: FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: FIREBASE_APP_ID,
    firebaseMeasurementId: FIREBASE_MEASUREMENT_ID,
    googleClientId: GOOGLE_CLIENT_ID,
    eas: {
      projectId: "0c429300-5faa-4857-a40e-3510e9cdd0c2"
    }
  }
};