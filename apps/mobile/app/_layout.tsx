import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout(): JSX.Element {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#1E0031" },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="walk/[walkId]"
          options={{
            headerShown: true,
            headerTitle: "Walk",
            headerStyle: { backgroundColor: "#1E0031" },
            headerTintColor: "#FFFFFF",
          }}
        />
        <Stack.Screen
          name="u/[username]"
          options={{
            headerShown: true,
            headerTitle: "Profile",
            headerStyle: { backgroundColor: "#1E0031" },
            headerTintColor: "#FFFFFF",
          }}
        />
      </Stack>
    </>
  );
}
