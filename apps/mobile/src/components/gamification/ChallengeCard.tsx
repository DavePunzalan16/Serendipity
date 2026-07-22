/**
 * Active challenge card with title, description, progress bar, and time remaining.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface ChallengeCardProps {
  /** Challenge title */
  title: string;
  /** Challenge description */
  description: string;
  /** Progress value (0-1) */
  progress: number;
  /** Time remaining string (e.g. "2 days left") */
  timeRemaining: string;
  /** Whether the challenge is completed */
  completed?: boolean;
}

/**
 * ChallengeCard renders an active gamification challenge with
 * its progress bar and countdown timer.
 */
export default function ChallengeCard({
  title,
  description,
  progress,
  timeRemaining,
  completed = false,
}: ChallengeCardProps): JSX.Element {
  return (
    <View style={[styles.card, completed && styles.cardCompleted]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {completed && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(progress, 1) * 100}%` },
              completed && styles.progressFillCompleted,
            ]}
          />
        </View>
        <View style={styles.meta}>
          <Text style={styles.percentage}>
            {Math.round(progress * 100)}%
          </Text>
          <Text style={styles.timeRemaining}>{timeRemaining}</Text>
        </View>
      </View>
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
  cardCompleted: {
    borderColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    color: '#C7C7C7',
    lineHeight: 18,
  },
  progressSection: {
    gap: 6,
    paddingTop: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#484848',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#C3B1FF',
  },
  progressFillCompleted: {
    backgroundColor: '#4CAF50',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C3B1FF',
  },
  timeRemaining: {
    fontSize: 12,
    color: '#484848',
  },
});
