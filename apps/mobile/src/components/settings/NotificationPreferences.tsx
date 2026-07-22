/**
 * Toggle switches for each notification type.
 * Allows users to configure which notifications they receive.
 */
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export interface NotificationType {
  /** Unique key for the notification type */
  key: string;
  /** Display label */
  label: string;
  /** Description of what this notification covers */
  description: string;
  /** Whether it's currently enabled */
  enabled: boolean;
}

export interface NotificationPreferencesProps {
  /** Available notification types with their current state */
  notifications: NotificationType[];
  /** Callback when a notification toggle changes */
  onToggle: (key: string, enabled: boolean) => void;
}

/**
 * NotificationPreferences renders a list of toggle switches
 * for each available notification type.
 */
export default function NotificationPreferences({
  notifications,
  onToggle,
}: NotificationPreferencesProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notifications</Text>
      <View style={styles.section}>
        {notifications.map((notification, index) => (
          <View key={notification.key}>
            {index > 0 && <View style={styles.divider} />}
            <View style={styles.row}>
              <View style={styles.rowContent}>
                <Text style={styles.label}>{notification.label}</Text>
                <Text style={styles.description}>{notification.description}</Text>
              </View>
              <Switch
                value={notification.enabled}
                onValueChange={(value) => onToggle(notification.key, value)}
                trackColor={{ false: '#484848', true: '#C3B1FF' }}
                thumbColor={notification.enabled ? '#FFFFFF' : '#C7C7C7'}
                accessibilityLabel={`Toggle ${notification.label} notifications`}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 12,
    color: '#C7C7C7',
  },
  divider: {
    height: 1,
    backgroundColor: '#484848',
    marginHorizontal: 16,
  },
});
