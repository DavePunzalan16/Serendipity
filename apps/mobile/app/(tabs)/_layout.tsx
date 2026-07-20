import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout(): JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#C3B1FF",
        tabBarInactiveTintColor: "#C7C7C7",
        tabBarStyle: {
          backgroundColor: "#1A1A1A",
          borderTopColor: "#484848",
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === "ios" ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarLabel: "Feed",
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarLabel: "Discover",
        }}
      />
      <Tabs.Screen
        name="walk"
        options={{
          title: "Walk",
          tabBarLabel: "Walk",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}
