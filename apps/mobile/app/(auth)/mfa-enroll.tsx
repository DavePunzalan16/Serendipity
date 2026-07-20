import { View, Text, StyleSheet } from "react-native";

export default function MfaEnrollScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enable Two-Factor Auth</Text>
      <Text style={styles.subtitle}>
        Scan the QR code with your authenticator app
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
