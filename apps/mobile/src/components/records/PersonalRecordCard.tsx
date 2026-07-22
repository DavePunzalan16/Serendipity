/**
 * PersonalRecordCard — Displays a single personal record with record type, value, and date achieved.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface PersonalRecordCardProps {
  /** Record type label (e.g. "Longest Walk", "Fastest Pace") */
  recordType: string;
  /** Record value (e.g. "15.2 km", "6:30 /km") */
  value: string;
  /** Date the record was achieved */
  date: string;
  /** Optional icon/emoji displayed with the record */
  icon?: string;
}

/**
 * PersonalRecordCard renders a single personal record entry.
 */
export default function PersonalRecordCard({
  recordType,
  value,
  date,
  icon = '🏆',
}: PersonalRecordCardProps): JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.content}>
        <Text style={styles.recordType}>{recordType}</Text>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  recordType: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00D26A',
  },
  date: {
    fontSize: 12,
    color: '#E2E8F0',
    marginTop: 2,
  },
});
