/**
 * Celebration animation when a badge is earned.
 * Full-screen animated modal with scale and rotation effects.
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import type { Badge } from '@wander/shared-types';

export interface BadgeUnlockModalProps {
  /** The badge that was earned */
  badge: Badge | null;
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback to dismiss */
  onDismiss: () => void;
}

/**
 * BadgeUnlockModal shows a celebration animation when the user
 * earns a new badge. Displays badge icon, name, and description.
 */
export default function BadgeUnlockModal({
  badge,
  visible,
  onDismiss,
}: BadgeUnlockModalProps): JSX.Element {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.3);
      rotateAnim.setValue(0);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, rotateAnim, opacityAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '-10deg', '0deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }, { rotate }],
            },
          ]}
        >
          <Text style={styles.celebration}>🎊</Text>
          <Text style={styles.title}>Badge Unlocked!</Text>
          {badge && (
            <>
              <View style={styles.badgeCircle}>
                <Text style={styles.badgeIcon}>🏅</Text>
              </View>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
            </>
          )}
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={onDismiss}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.dismissText}>Awesome!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 320,
  },
  celebration: {
    fontSize: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  badgeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  badgeIcon: {
    fontSize: 40,
  },
  badgeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C3B1FF',
  },
  badgeDescription: {
    fontSize: 14,
    color: '#C7C7C7',
    textAlign: 'center',
    lineHeight: 20,
  },
  dismissButton: {
    marginTop: 8,
    backgroundColor: '#C3B1FF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 100,
  },
  dismissText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A0A0A',
    textTransform: 'uppercase',
  },
});
