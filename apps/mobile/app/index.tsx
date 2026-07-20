import { Redirect } from "expo-router";

export default function Index(): JSX.Element {
  // TODO: Check auth state and redirect accordingly
  // For now, redirect to the main tabs
  return <Redirect href="/(tabs)/feed" />;
}
