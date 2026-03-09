import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../context/auth-context";
import { Feather } from "@expo/vector-icons";

export default function SettingsTab() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileIcon}>
          <Feather name="user" size={40} color="#fff" />
        </View>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.userId}>User ID: {user?.id?.slice(0, 8)}...</Text>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Feather name="log-out" size={24} color="#FF3B30" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  email: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: "#666",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF3B30",
    gap: 12,
  },
  signOutText: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "600",
  },
});
