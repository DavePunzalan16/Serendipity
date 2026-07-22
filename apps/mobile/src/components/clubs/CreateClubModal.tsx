/**
 * CreateClubModal — Modal with form inputs for creating a new club.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export interface CreateClubFormData {
  /** Club name */
  name: string;
  /** Club description */
  description: string;
  /** Whether the club is private */
  isPrivate: boolean;
}

export interface CreateClubModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when the modal is dismissed */
  onDismiss: () => void;
  /** Callback when the form is submitted */
  onSubmit: (data: CreateClubFormData) => void;
  /** Whether the submit action is loading */
  loading?: boolean;
}

/**
 * CreateClubModal renders a form inside a modal for club creation.
 */
export default function CreateClubModal({
  visible,
  onDismiss,
  onSubmit,
  loading = false,
}: CreateClubModalProps): JSX.Element {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), isPrivate });
  };

  const handleDismiss = () => {
    setName('');
    setDescription('');
    setIsPrivate(false);
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleDismiss}
      accessibilityViewIsModal
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.title}>Create a Club</Text>

            {/* Club Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Club Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter club name"
                placeholderTextColor="#374151"
                maxLength={50}
                accessibilityLabel="Club name"
              />
            </View>

            {/* Description */}
            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="What's this club about?"
                placeholderTextColor="#374151"
                multiline
                numberOfLines={3}
                maxLength={200}
                accessibilityLabel="Club description"
              />
            </View>

            {/* Privacy Toggle */}
            <TouchableOpacity
              style={styles.toggle}
              onPress={() => setIsPrivate(!isPrivate)}
              accessibilityRole="switch"
              accessibilityState={{ checked: isPrivate }}
            >
              <Text style={styles.toggleLabel}>Private Club</Text>
              <View style={[styles.switch, isPrivate && styles.switchActive]}>
                <View
                  style={[styles.switchThumb, isPrivate && styles.switchThumbActive]}
                />
              </View>
            </TouchableOpacity>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleDismiss}
                accessibilityRole="button"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, !name.trim() && styles.submitDisabled]}
                onPress={handleSubmit}
                disabled={!name.trim() || loading}
                accessibilityRole="button"
              >
                <Text style={styles.submitText}>
                  {loading ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 26, 0.9)',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E2E8F0',
    textAlign: 'center',
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E2E8F0',
  },
  input: {
    backgroundColor: '#0A0F1A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#E2E8F0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E2E8F0',
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#374151',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: '#00D26A',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#00D26A',
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0F1A',
  },
});
