/**
 * ClubDetailPage — ScrollView-based club detail view with header, members section, and embedded leaderboard.
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import JoinClubButton from './JoinClubButton';

export interface ClubMember {
  /** Unique member ID */
  id: string;
  /** Display name */
  name: string;
  /** Avatar URI */
  avatarUrl: string;
}

export interface ClubDetailPageProps {
  /** Club display name */
  name: string;
  /** Club description */
  description: string;
  /** Club banner/avatar URI */
  avatarUrl?: string;
  /** Number of members */
  memberCount: number;
  /** Sample members to display */
  members: ClubMember[];
  /** Whether the user has joined */
  isJoined: boolean;
  /** Callback for join/leave toggle */
  onJoinToggle: () => void;
  /** Optional children to render below (e.g. leaderboard) */
  children?: React.ReactNode;
}

/**
 * ClubDetailPage renders the full club detail with header, members, and slot for leaderboard.
 */
export default function ClubDetailPage({
  name,
  description,
  avatarUrl,
  memberCount,
  members,
  isJoined,
  onJoinToggle,
  children,
}: ClubDetailPageProps): JSX.Element {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        {avatarUrl && (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        )}
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.memberCount}>{memberCount} members</Text>
        <JoinClubButton isJoined={isJoined} onToggle={onJoinToggle} />
      </View>

      {/* Members Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Members</Text>
        <View style={styles.membersRow}>
          {members.slice(0, 8).map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <Image
                source={{ uri: member.avatarUrl }}
                style={styles.memberAvatar}
              />
              <Text style={styles.memberName} numberOfLines={1}>
                {member.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Children slot for leaderboard or other content */}
      {children && <View style={styles.section}>{children}</View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1A',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#374151',
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
  },
  memberCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00E5FF',
  },
  section: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  membersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  memberItem: {
    alignItems: 'center',
    width: 56,
    gap: 4,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
  },
  memberName: {
    fontSize: 10,
    color: '#E2E8F0',
    textAlign: 'center',
  },
});
