/** Full-screen loading spinner with purple background. */
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = 'Loading...',
}: LoadingScreenProps): JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#C3B1FF" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E0031',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#C7C7C7',
  },
});
