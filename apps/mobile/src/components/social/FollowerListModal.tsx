/** Modal showing list of followers. */
import React from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { User } from '@wander/shared-types';
import { Modal, Avatar } from '../ui';

export interface FollowerListModalProps {
  visible: boolean;
  onClose: () => void;
  followers: Pick<User, 'id' | 'username' | 'display_name' | 'avatar_url'>[];
  onUserPress?: (userId: string) => void;
}

export default function FollowerListModal({
  visible,
  onClose,
  followers,
  onUserPress,
}: FollowerListModalProps): JSX.Element {
  return (
    <Modal visible={visible} onClose={onClose} title="Followers">
      <FlatList
        data={followers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              onUserPress?.(item.id);
              onClose();
            }}
            accessibilityLabel={`View ${item.display_name}'s profile`}
          >
            <Avatar uri={item.avatar_url ?? undefined} initials={item.display_name[0]} size="sm" />
            <View style={styles.info}>
              <Text style={styles.displayName}>{item.display_name}</Text>
              <Text style={styles.username}>@{item.username}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No followers yet</Text>
          </View>
        }
        style={styles.list}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  list: {
    maxHeight: 400,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#484848',
  },
  info: {
    flex: 1,
  },
  displayName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 13,
    color: '#C7C7C7',
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#484848',
  },
});
