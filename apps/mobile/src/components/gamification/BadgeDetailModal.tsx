/**
 * Modal showing badge details including name, description, unlock condition, and progress.
 */
import React from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { Badge } from '@wander/shared-types';

export interface BadgeDetailModalProps {
  /** The badge to display details for */
  badge: Badge | null;
  /** Whether the modal is visible */
  visible: boolean;
  /** Whether the user has unlocked this badge */
  unlocked: boolean;
  /** Unlock condition description */
  unlockCondition?: string;
  /** Progress towards unlock (0-1) */
  progress?: number;
  /** Callback to dismiss */
  onDismiss: () => void;
}

/**
 * BadgeDetailModal shows a full-detail view of a badge including
 * its unlock condition and progress towards earning it.
 */
export default function BadgeDetailModal({
  badge,
  visible,
  unlocked,
  unlockCondition,
  progress = 0,
  onDismiss,
}: BadgeDetailModalProps): JSX.Element {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {badge && (
            <>
              <Image
                source={{ uri: badge.icon_url }}
                style={[styles.badgeImage, !unlocked && styles.locked]}
                resizeMode="cover"
              />
              <Text style={styles.name}>{badge.name}</Text>
              <Text style={styles.description}>{badge.description}</Text>

              {unlockCondition && (
                <View style={styles.conditionRow}>
                  <Text style={styles.conditionLabel}>How to unlock:</Text>
                  <Text style={styles.conditionText}>{unlockCondition}</Text>
                </View>
              )}

              {!unlocked && progress > 0 && (
                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${progress * 100}%` }]}
                    />
                  </View>
                  <Text style={styles.progressLabel}>
                    {Math.round(progress * 100)}% complete
                  </Text>
                </View>
              )}

              {unlocked && badge.earned_at && (
                <Text style={styles.earnedAt}>
                  Earned {new Date(badge.earned_at).toLocaleDateString()}
                </Text>
              )}
            </>
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onDismiss}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 340,
  },
  badgeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#222222',
  },
  locked: {
    opacity: 0.4,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#C7C7C7',
    textAlign: 'center',
    lineHeight: 20,
  },
  conditionRow: {
    width: '100%',
    gap: 4,
    paddingTop: 8,
  },
  conditionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#484848',
    textTransform: 'uppercase',
  },
  conditionText: {
    fontSize: 14,
    color: '#C7C7C7',
  },
  progressSection: {
    width: '100%',
    gap: 6,
    paddingTop: 8,
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
  progressLabel: {
    fontSize: 12,
    color: '#C7C7C7',
  },
  earnedAt: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  closeButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#484848',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C7C7C7',
  },
});
