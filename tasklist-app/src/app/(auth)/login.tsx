import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../../context/auth-context";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

export default function LoginScreen() {
  const { signInWithGoogle, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Feather name="check-circle" size={80} color="#007AFF" />
        <Text style={styles.title}>Tasklist App</Text>
        <Text style={styles.subtitle}>Organize your tasks efficiently</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.googleButton, isLoading && styles.disabledButton]}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Feather name="chrome" size={24} color="#fff" />
            <Text style={styles.buttonText}>Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.debugText}>
        Status: {isLoading ? "Signing in..." : "Ready to sign in"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    flex: 1,
  },
  debugText: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    marginBottom: 10,
  },
});
