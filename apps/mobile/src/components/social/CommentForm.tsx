/** Text input with submit button for new comment. */
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface CommentFormProps {
  onSubmit: (text: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export default function CommentForm({
  onSubmit,
  loading = false,
  placeholder = 'Add a comment…',
}: CommentFormProps): JSX.Element {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor="#6B6B6B"
        multiline
        maxLength={500}
        editable={!loading}
        accessibilityLabel="Comment text"
      />
      <TouchableOpacity
        style={[styles.submitButton, (!text.trim() || loading) && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={!text.trim() || loading}
        accessibilityRole="button"
        accessibilityLabel="Post comment"
      >
        <Text style={styles.submitText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#484848',
    backgroundColor: '#1A1A1A',
  },
  input: {
    flex: 1,
    backgroundColor: '#1E0031',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#FFFFFF',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#484848',
  },
  submitButton: {
    backgroundColor: '#C3B1FF',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  submitDisabled: {
    opacity: 0.4,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A0A',
  },
});
