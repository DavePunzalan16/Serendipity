/**
 * RecordBrokenModal — Celebration modal displayed when the user breaks a personal record.
 * Features a scale-in animation using the React Native Animated API.
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export interface RecordBrokenModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Record type that was broken */
  recordType: string;
  /** New record value */
  newValue: string;
  /** Previous record value */
  previousValue?: string;
  /** Callback to dismiss the modal */
  onDismiss: () => void;
}

/**
 * RecordBrokenModal displays a celebratory animation when a personal record is broken.
 */
export default function RecordBrokenModal({
  visible,
  recordType,
  newValue,
  previousValue,
  onDismiss,
}: RecordBrokenModalProps): JSX.Element {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, scaleAnim]);

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
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.heading}>New Record!</Text>
          <Text style={styles.recordType}>{recordType}</Text>
          <Text style={styles.newValue}>{newValue}</Text>
          {previousValue && (
            <Text style={styles.previous}>Previous: {previousValue}</Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss record celebration"
          >
            <Text style={styles.buttonText}>Awesome!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 26, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#00D26A',
    width: '100%',
    maxWidth: 320,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#00D26A',
  },
  recordType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E2E8F0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  newValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  previous: {
    fontSize: 13,
    color: '#374151',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#00D26A',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A0F1A',
  },
});
