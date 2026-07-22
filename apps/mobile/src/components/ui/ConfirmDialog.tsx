/** Confirmation dialog using the Modal component internally. */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from './Modal';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps): JSX.Element {
  return (
    <Modal visible={visible} onClose={onCancel} title={title}>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          accessibilityRole="button"
        >
          <Text style={styles.cancelText}>{cancelLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            destructive && styles.destructiveButton,
          ]}
          onPress={onConfirm}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.confirmText,
              destructive && styles.destructiveText,
            ]}
          >
            {confirmLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 14,
    color: '#C7C7C7',
    lineHeight: 20,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#484848',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C7C7C7',
  },
  confirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#C3B1FF',
  },
  destructiveButton: {
    backgroundColor: '#FF4444',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  destructiveText: {
    color: '#FFFFFF',
  },
});
