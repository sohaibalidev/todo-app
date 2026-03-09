import { useEffect } from "react";
import { Stack, router, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/auth-context";
import { View, ActivityIndicator } from "react-native";

// This component will handle the authentication redirect logic
function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    
    console.log("Navigation check:", { 
      user: !!user, 
      inAuthGroup, 
      segments: segments.join("/") 
    });

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated and not already in auth group
      console.log("Redirecting to login");
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Redirect to app if authenticated and in auth group
      console.log("Redirecting to app");
      router.replace("/(app)");
    }
  }, [user, isLoading, segments]);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}