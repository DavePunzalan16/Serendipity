/**
 * ScrollView of StopCards with progress indicators.
 * Renders the full list of walk stops with visual connection lines.
 */
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import type { Stop } from '@wander/shared-types';
import StopCard from './StopCard';

export interface StopListProps {
  /** Array of stops to display */
  stops: Stop[];
  /** ID of the current active stop */
  currentStopId?: string;
  /** Callback when a stop card is pressed */
  onStopPress?: (stop: Stop) => void;
}

/**
 * StopList renders a scrollable list of StopCards connected by
 * progress indicator lines showing walk progression.
 */
export default function StopList({
  stops,
  currentStopId,
  onStopPress,
}: StopListProps): JSX.Element {
  const sortedStops = [...stops].sort((a, b) => a.order_index - b.order_index);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {sortedStops.map((stop, index) => (
        <View key={stop.id}>
          {index > 0 && (
            <View style={styles.connector}>
              <View
                style={[
                  styles.connectorLine,
                  stop.visited && styles.connectorLineVisited,
                ]}
              />
            </View>
          )}
          <StopCard
            stop={stop}
            isCurrent={stop.id === currentStopId}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 8,
    gap: 0,
  },
  connector: {
    alignItems: 'flex-start',
    paddingLeft: 21,
    height: 20,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#484848',
  },
  connectorLineVisited: {
    backgroundColor: '#4CAF50',
  },
});
