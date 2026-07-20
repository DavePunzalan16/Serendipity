import { View, Text, StyleSheet } from "react-native";

export default function MfaChallengeScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Required</Text>
      <Text style={styles.subtitle}>
        Enter the code from your authenticator app
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#C7C7C7",
    textAlign: "center",
  },
});
