/**
 * Danger zone section with delete account and confirmation dialog.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';

export interface DangerZoneProps {
  /** User's username for deletion confirmation */
  username: string;
  /** Callback when account deletion is confirmed */
  onDeleteAccount: () => void;
  /** Whether deletion is in progress */
  loading?: boolean;
}

/**
 * DangerZone renders a destructive action section with a delete account
 * button and a confirmation dialog requiring the user to type their username.
 */
export default function DangerZone({
  username,
  onDeleteAccount,
  loading = false,
}: DangerZoneProps): JSX.Element {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const isConfirmed = confirmText === username;

  const handleDelete = () => {
    if (isConfirmed) {
      onDeleteAccount();
      setShowConfirm(false);
      setConfirmText('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Danger Zone</Text>
      <View style={styles.section}>
        <Text style={styles.description}>
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setShowConfirm(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Delete account"
        >
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalDescription}>
              This will permanently delete your account, walks, photos, and all
              data. This cannot be undone.
            </Text>
            <Text style={styles.confirmLabel}>
              Type <Text style={styles.usernameHighlight}>{username}</Text> to
              confirm:
            </Text>
            <TextInput
              style={styles.confirmInput}
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder={username}
              placeholderTextColor="#484848"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Type username to confirm deletion"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowConfirm(false);
                  setConfirmText('');
                }}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmDeleteButton,
                  !isConfirmed && styles.disabled,
                ]}
                onPress={handleDelete}
                disabled={!isConfirmed || loading}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Text style={styles.confirmDeleteText}>
                  {loading ? 'Deleting…' : 'Delete Forever'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4444',
    textTransform: 'uppercase',
  },
  section: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  description: {
    fontSize: 13,
    color: '#C7C7C7',
    lineHeight: 18,
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF4444',
  },
  modalDescription: {
    fontSize: 14,
    color: '#C7C7C7',
    lineHeight: 20,
  },
  confirmLabel: {
    fontSize: 13,
    color: '#C7C7C7',
  },
  usernameHighlight: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  confirmInput: {
    backgroundColor: '#222222',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#484848',
  },
  modalActions: {
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
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: '#FF4444',
    alignItems: 'center',
  },
  confirmDeleteText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.4,
  },
});
