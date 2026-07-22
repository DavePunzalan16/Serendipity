/** Shows generated recovery codes with copy button. */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Button } from '../ui';

export interface RecoveryCodeDisplayProps {
  codes: string[];
  onDone?: () => void;
}

export default function RecoveryCodeDisplay({
  codes,
  onDone,
}: RecoveryCodeDisplayProps): JSX.Element {
  const handleCopyAll = async () => {
    await Clipboard.setStringAsync(codes.join('\n'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recovery Codes</Text>
      <Text style={styles.subtitle}>
        Save these codes in a secure place. Each code can only be used once if you lose access to your authenticator.
      </Text>

      <View style={styles.codesContainer}>
        {codes.map((code, index) => (
          <View key={code} style={styles.codeRow}>
            <Text style={styles.codeIndex}>{index + 1}.</Text>
            <Text style={styles.codeText}>{code}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.copyButton}
        onPress={handleCopyAll}
        accessibilityRole="button"
        accessibilityLabel="Copy all recovery codes"
      >
        <Text style={styles.copyText}>📋 Copy All</Text>
      </TouchableOpacity>

      {onDone && (
        <View style={styles.doneWrapper}>
          <Button title="I've Saved These Codes" onPress={onDone} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#C7C7C7',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  codesContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#484848',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  codeIndex: {
    fontSize: 13,
    color: '#484848',
    width: 24,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  copyButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#C3B1FF',
    marginBottom: 24,
  },
  copyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C3B1FF',
  },
  doneWrapper: {
    marginTop: 8,
  },
});
