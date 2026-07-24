import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Wander",
  slug: "wander",
  version: "2.0.0",
  orientation: "portrait",
  icon: "./assets/WandererIcon.png",
  userInterfaceStyle: "dark",
  scheme: "wander",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#1E0031",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.wander.app",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "Wander uses your location to generate personalized walking routes and track your progress during walks.",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "Wander needs background location access to track your walk progress even when the app is in the background.",
      NSCameraUsageDescription:
        "Wander uses your camera to capture photos during walks.",
    },
    associatedDomains: ["applinks:wander.app"],
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/WandererIcon.png",
      backgroundColor: "#1E0031",
    },
    package: "com.wander.app",
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
      "CAMERA",
    ],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [{ scheme: "https", host: "wander.app", pathPrefix: "/" }],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  plugins: [
    "expo-router",
    "expo-location",
    "expo-camera",
    "expo-notifications",
    "expo-secure-store",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "your-eas-project-id",
    },
  },
});
