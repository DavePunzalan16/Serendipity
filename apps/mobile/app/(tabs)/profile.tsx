import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";

interface WalkHistoryItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  distance: string;
  vibeTags: string[];
}

interface UserProfile {
  displayName: string;
  username: string;
  bio: string;
  avatarInitial: string;
  stats: {
    totalWalks: number;
    totalDistance: string;
    totalTime: string;
    followers: number;
    following: number;
  };
}

const MOCK_PROFILE: UserProfile = {
  displayName: "Alex Wanderer",
  username: "alex_wanders",
  bio: "Exploring cities one step at a time. Always looking for the path less traveled.",
  avatarInitial: "A",
  stats: {
    totalWalks: 47,
    totalDistance: "128 km",
    totalTime: "36h",
    followers: 182,
    following: 94,
  },
};

const MOCK_HISTORY: WalkHistoryItem[] = [
  {
    id: "h1",
    title: "Sunset Canal Stroll",
    date: "Dec 18, 2024",
    duration: "40 min",
    distance: "2.1 km",
    vibeTags: ["scenic", "chill"],
  },
  {
    id: "h2",
    title: "Market District Wander",
    date: "Dec 15, 2024",
    duration: "55 min",
    distance: "3.0 km",
    vibeTags: ["foodie", "urban"],
  },
  {
    id: "h3",
    title: "Old Town Night Walk",
    date: "Dec 12, 2024",
    duration: "35 min",
    distance: "1.8 km",
    vibeTags: ["historic", "nighttime"],
  },
  {
    id: "h4",
    title: "Riverside Nature Loop",
    date: "Dec 8, 2024",
    duration: "70 min",
    distance: "4.2 km",
    vibeTags: ["nature", "scenic"],
  },
  {
    id: "h5",
    title: "Gallery Hop",
    date: "Dec 5, 2024",
    duration: "45 min",
    distance: "2.4 km",
    vibeTags: ["artsy", "urban"],
  },
];

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}): JSX.Element {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function WalkHistoryCard({ item }: { item: WalkHistoryItem }): JSX.Element {
  return (
    <TouchableOpacity style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>{item.title}</Text>
        <Text style={styles.historyDate}>{item.date}</Text>
      </View>
      <View style={styles.historyMeta}>
        <Text style={styles.historyMetaText}>🚶 {item.duration}</Text>
        <Text style={styles.historyMetaText}>📍 {item.distance}</Text>
      </View>
      <View style={styles.historyTags}>
        {item.vibeTags.map((tag) => (
          <View key={tag} style={styles.historyTag}>
            <Text style={styles.historyTagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen(): JSX.Element {
  const [profile] = useState<UserProfile>(MOCK_PROFILE);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => {} },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WalkHistoryCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>
                  {profile.avatarInitial}
                </Text>
              </View>
              <Text style={styles.displayName}>{profile.displayName}</Text>
              <Text style={styles.usernameText}>@{profile.username}</Text>
              <Text style={styles.bio}>{profile.bio}</Text>

              {/* Social Stats */}
              <View style={styles.socialRow}>
                <Text style={styles.socialText}>
                  <Text style={styles.socialCount}>
                    {profile.stats.followers}
                  </Text>{" "}
                  followers
                </Text>
                <Text style={styles.socialDot}>·</Text>
                <Text style={styles.socialText}>
                  <Text style={styles.socialCount}>
                    {profile.stats.following}
                  </Text>{" "}
                  following
                </Text>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <StatBox label="Walks" value={profile.stats.totalWalks} />
              <StatBox label="Distance" value={profile.stats.totalDistance} />
              <StatBox label="Time" value={profile.stats.totalTime} />
            </View>

            {/* Settings & Logout */}
            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.settingsButton}>
                <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>

            {/* Walk History Header */}
            <View style={styles.historySectionHeader}>
              <Text style={styles.historySectionTitle}>Walk History</Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E0031",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#C3B1FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarLargeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0A0A0A",
  },
  displayName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 14,
    color: "#C3B1FF",
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    color: "#C7C7C7",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  socialText: {
    fontSize: 14,
    color: "#C7C7C7",
  },
  socialCount: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
  socialDot: {
    color: "#484848",
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#C7C7C7",
  },
  actionsSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  settingsButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#484848",
    alignItems: "center",
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#C7C7C7",
  },
  logoutButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  historySectionHeader: {
    marginBottom: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#484848",
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 16,
  },
  historyCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    color: "#C7C7C7",
  },
  historyMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
  },
  historyMetaText: {
    fontSize: 13,
    color: "#C7C7C7",
  },
  historyTags: {
    flexDirection: "row",
    gap: 8,
  },
  historyTag: {
    backgroundColor: "#2A1A3E",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  historyTagText: {
    fontSize: 11,
    color: "#C3B1FF",
    fontWeight: "500",
  },
});
