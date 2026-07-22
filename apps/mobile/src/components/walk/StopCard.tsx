/**
 * Single stop info card for active walk view.
 * Displays stop name, description, and visited status.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Stop } from '@wander/shared-types';

export interface StopCardProps {
  /** The stop data */
  stop: Stop;
  /** Whether this stop is the current active stop */
  isCurrent?: boolean;
}

/**
 * StopCard renders a single walk stop with its name, description,
 * and a visual indicator for visited/current status.
 */
export default function StopCard({ stop, isCurrent = false }: StopCardProps): JSX.Element {
  return (
    <View
      style={[styles.card, isCurrent && styles.cardCurrent]}
      accessibilityLabel={`Stop: ${stop.name}, ${stop.visited ? 'visited' : 'not visited'}`}
    >
      <View style={styles.header}>
        <View style={[styles.indicator, stop.visited && styles.indicatorVisited]} />
        <Text style={[styles.name, stop.visited && styles.nameVisited]}>
          {stop.name}
        </Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {stop.description}
      </Text>
      {stop.visited && stop.visited_at && (
        <Text style={styles.visitedAt}>
          Visited {new Date(stop.visited_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#484848',
  },
  cardCurrent: {
    borderColor: '#C3B1FF',
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#484848',
    backgroundColor: 'transparent',
  },
  indicatorVisited: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  nameVisited: {
    color: '#C7C7C7',
  },
  description: {
    fontSize: 13,
    color: '#C7C7C7',
    lineHeight: 18,
    paddingLeft: 22,
  },
  visitedAt: {
    fontSize: 11,
    color: '#484848',
    paddingLeft: 22,
  },
});
