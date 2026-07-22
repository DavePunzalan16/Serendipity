/**
 * Confirmation modal for swapping a stop.
 * Shows current stop info and asks for confirmation before swap.
 */
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { Stop } from '@wander/shared-types';

export interface SwapStopModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** The stop being swapped */
  stop: Stop | null;
  /** Callback to confirm swap */
  onConfirm: () => void;
  /** Callback to cancel */
  onCancel: () => void;
  /** Whether the swap is in progress */
  loading?: boolean;
}

/**
 * SwapStopModal presents a confirmation dialog before swapping
 * a walk stop with an AI-generated alternative.
 */
export default function SwapStopModal({
  visible,
  stop,
  onConfirm,
  onCancel,
  loading = false,
}: SwapStopModalProps): JSX.Element {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Swap Stop?</Text>
          {stop && (
            <Text style={styles.description}>
              Replace "{stop.name}" with a new AI-suggested stop?
            </Text>
          )}
          <Text style={styles.hint}>
            The new stop will be nearby and match your walk vibes.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.disabled]}
              onPress={onConfirm}
              disabled={loading}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={styles.confirmText}>
                {loading ? 'Swapping…' : 'Swap'}
              </Text>
            </TouchableOpacity>
          </View>
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
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#C7C7C7',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    color: '#484848',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#484848',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C7C7C7',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: '#C3B1FF',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  disabled: {
    opacity: 0.5,
  },
});
