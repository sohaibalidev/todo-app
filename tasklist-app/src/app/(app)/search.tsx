import { View, Text, StyleSheet } from "react-native";

export default function SearchTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🔍 Search Tab</Text>
      <Text style={styles.subtext}>Task search will go here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: "#666",
  },
});
