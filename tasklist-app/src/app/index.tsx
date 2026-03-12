import { useEffect } from "react";
import { View, ActivityIndicator, Text, Button } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/auth-context";

export default function Index() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/(app)");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [user, isLoading]);

  const goToLogin = () => {
    router.push("/(auth)/login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 20 }}>isLoading: {isLoading ? "true" : "false"}</Text>
      <Text>user: {user ? user.email : "null"}</Text>
      <Button title="Go to Login Manually" onPress={goToLogin} />
    </View>
  );
}