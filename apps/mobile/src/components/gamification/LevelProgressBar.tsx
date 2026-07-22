/**
 * XP bar showing current level and progress to next level.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface LevelProgressBarProps {
  /** Current level number */
  level: number;
  /** Current XP within this level */
  currentXP: number;
  /** XP required to reach next level */
  requiredXP: number;
}

/**
 * LevelProgressBar renders the user's current level with a
 * progress bar showing how much XP is needed for the next level.
 */
export default function LevelProgressBar({
  level,
  currentXP,
  requiredXP,
}: LevelProgressBarProps): JSX.Element {
  const progress = requiredXP > 0 ? currentXP / requiredXP : 0;

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityValue={{ now: currentXP, min: 0, max: requiredXP }}
      accessibilityLabel={`Level ${level}, ${currentXP} of ${requiredXP} XP`}
    >
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.{level}</Text>
        </View>
        <Text style={styles.xpText}>
          {currentXP} / {requiredXP} XP
        </Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.nextLevel}>Level {level + 1}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelBadge: {
    backgroundColor: '#C3B1FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  xpText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#C7C7C7',
  },
  barBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#484848',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#C3B1FF',
  },
  nextLevel: {
    fontSize: 11,
    color: '#484848',
    textAlign: 'right',
  },
});
