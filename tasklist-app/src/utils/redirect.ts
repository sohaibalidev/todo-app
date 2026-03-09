import { Platform } from "react-native";
import * as Linking from "expo-linking";
import Constants from "expo-constants";

export const getRedirectUrl = (): string => {
  // For development builds, we'll use a custom URL that we'll intercept
  if (__DEV__) {
    // Use a URL with a .com domain that we'll handle locally
    return "https://tasklistapp.com/auth/callback";
  }

  // For production, use the app scheme
  return Linking.createURL("/auth/callback");
};

export const isRedirectUrl = (url: string): boolean => {
  // Check if this is our redirect URL
  if (__DEV__) {
    return url.startsWith("https://tasklistapp.com/auth/callback");
  }
  return url.startsWith(Linking.createURL("/auth/callback"));
};
