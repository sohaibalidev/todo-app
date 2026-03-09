import { useEffect } from "react";
import { View, ActivityIndicator, Text, Button } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/auth-context";

export default function Index() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log("Index useEffect - Auth state:", { user, isLoading });
    
    if (!isLoading) {
      if (user) {
        console.log("User found, redirecting to app");
        router.replace("/(app)");
      } else {
        console.log("No user, redirecting to login");
        router.replace("/(auth)/login");
      }
    }
  }, [user, isLoading]);

  // Manual navigation option
  const goToLogin = () => {
    router.push("/(auth)/login");
  };

  // Show what's happening for debugging
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 20 }}>isLoading: {isLoading ? "true" : "false"}</Text>
      <Text>user: {user ? user.email : "null"}</Text>
      <Button title="Go to Login Manually" onPress={goToLogin} />
    </View>
  );
}