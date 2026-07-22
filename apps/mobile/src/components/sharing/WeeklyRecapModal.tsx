/**
 * WeeklyRecapModal — Modal displaying a summary of the user's weekly walking stats.
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export interface WeeklyRecapStats {
  /** Total distance this week */
  totalDistance: string;
  /** Total walks completed */
  totalWalks: number;
  /** Total duration */
  totalDuration: string;
  /** Total steps */
  totalSteps: string;
  /** Streak count */
  streakDays: number;
  /** Percentage change from last week */
  changeFromLastWeek?: string;
}

export interface WeeklyRecapModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Weekly stats data */
  stats: WeeklyRecapStats;
  /** Week label (e.g. "Jan 8 - Jan 14") */
  weekLabel: string;
  /** Callback to dismiss */
  onDismiss: () => void;
  /** Callback to share */
  onShare?: () => void;
}

/**
 * WeeklyRecapModal renders a weekly summary with animated entry.
 */
export default function WeeklyRecapModal({
  visible,
  stats,
  weekLabel,
  onDismiss,
  onShare,
}: WeeklyRecapModalProps): JSX.Element {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible, slideAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>Weekly Recap</Text>
            <Text style={styles.weekLabel}>{weekLabel}</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{stats.totalDistance}</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{stats.totalWalks}</Text>
                <Text style={styles.statLabel}>Walks</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{stats.totalDuration}</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{stats.totalSteps}</Text>
                <Text style={styles.statLabel}>Steps</Text>
              </View>
            </View>

            {/* Streak */}
            <View style={styles.streakRow}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>
                {stats.streakDays} day streak
              </Text>
            </View>

            {stats.changeFromLastWeek && (
              <Text style={styles.change}>{stats.changeFromLastWeek} vs last week</Text>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              {onShare && (
                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={onShare}
                  accessibilityRole="button"
                >
                  <Text style={styles.shareText}>Share</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.dismissBtn}
                onPress={onDismiss}
                accessibilityRole="button"
              >
                <Text style={styles.dismissText}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 26, 0.9)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#374151',
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E2E8F0',
    textAlign: 'center',
  },
  weekLabel: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCell: {
    width: '47%',
    backgroundColor: '#0A0F1A',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00D26A',
  },
  statLabel: {
    fontSize: 11,
    color: '#374151',
    textTransform: 'uppercase',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  streakEmoji: {
    fontSize: 20,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00E5FF',
  },
  change: {
    fontSize: 13,
    color: '#00D26A',
    textAlign: 'center',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  shareBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#00D26A',
    alignItems: 'center',
  },
  shareText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0F1A',
  },
  dismissBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
});
