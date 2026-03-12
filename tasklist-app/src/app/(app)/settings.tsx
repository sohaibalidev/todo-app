import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import { useAuth } from "../../context/auth-context";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

type UserMetadata = {
  full_name?: string;
  avatar_url?: string;
  picture?: string;
};

export default function SettingsTab() {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const metadata = user?.user_metadata as UserMetadata | undefined;

  const avatar = metadata?.avatar_url || metadata?.picture || null;
  const name = metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initial = metadata?.full_name?.[0] || user?.email?.[0] || "U";

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

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert(
      "Notifications",
      `Notifications ${!notificationsEnabled ? "enabled" : "disabled"}`
    );
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all local data. Your tasks and projects in the cloud will remain. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => Alert.alert("Success", "Local data cleared"),
        },
      ]
    );
  };

  const handleFeedback = () => {
    Alert.alert("Feedback", "Thanks for your feedback! 📧 support@taskapp.com");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileSection}>
        <View style={styles.profileIcon}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.initial}>{initial.toUpperCase()}</Text>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Feather name="bell" size={20} color="#007AFF" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <TouchableOpacity onPress={handleNotificationToggle}>
            <Feather
              name={notificationsEnabled ? "toggle-right" : "toggle-left"}
              size={24}
              color={notificationsEnabled ? "#007AFF" : "#8E8E93"}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Feather name="moon" size={20} color="#007AFF" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Text style={styles.comingSoon}>Coming Soon</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
          <View style={styles.settingLeft}>
            <Feather name="trash-2" size={20} color="#FF3B30" />
            <Text style={[styles.settingText, styles.warningText]}>Clear Local Data</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Feather name="help-circle" size={20} color="#007AFF" />
            <Text style={styles.settingText}>Help & FAQ</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleFeedback}>
          <View style={styles.settingLeft}>
            <Feather name="message-square" size={20} color="#007AFF" />
            <Text style={styles.settingText}>Send Feedback</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#8E8E93" />
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Feather name="info" size={20} color="#8E8E93" />
            <Text style={styles.settingText}>Version</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Feather name="log-out" size={20} color="#FF3B30" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>TaskApp © 2026</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 30
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF4",
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  initial: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#8E8E93",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF4",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: "#000000",
  },
  warningText: {
    color: "#FF3B30",
  },
  comingSoon: {
    fontSize: 14,
    color: "#8E8E93",
    fontStyle: "italic",
  },
  versionText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 32,
    marginHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  signOutText: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "500",
  },
  footer: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 24,
    marginBottom: 16,
  },
});