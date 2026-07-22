import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from "react-native";

interface FeedItem {
  id: string;
  username: string;
  narrative: string;
  vibeTags: string[];
  likeCount: number;
  commentCount: number;
  duration: string;
  distance: string;
  createdAt: string;
}

const PLACEHOLDER_FEED: FeedItem[] = [
  {
    id: "1",
    username: "wanderer_kate",
    narrative:
      "Stumbled upon a hidden courtyard behind the old library. The ivy-covered walls felt like stepping into another era.",
    vibeTags: ["chill", "historic", "hidden gems"],
    likeCount: 24,
    commentCount: 5,
    duration: "45 min",
    distance: "2.3 km",
    createdAt: "2h ago",
  },
  {
    id: "2",
    username: "urban_drift",
    narrative:
      "Night walk through the arts district. Every mural tells a different story under the streetlights.",
    vibeTags: ["artsy", "nighttime", "urban"],
    likeCount: 18,
    commentCount: 3,
    duration: "30 min",
    distance: "1.8 km",
    createdAt: "5h ago",
  },
  {
    id: "3",
    username: "slow_steps",
    narrative:
      "Found a tiny café that only opens on Wednesdays. The barista recommended a trail along the canal I never knew existed.",
    vibeTags: ["cozy", "foodie", "nature"],
    likeCount: 42,
    commentCount: 11,
    duration: "60 min",
    distance: "3.1 km",
    createdAt: "1d ago",
  },
  {
    id: "4",
    username: "mapless_mike",
    narrative:
      "Let the algorithm decide my path today. Ended up at a rooftop garden with a panoramic view of the skyline.",
    vibeTags: ["adventurous", "scenic", "surprise"],
    likeCount: 56,
    commentCount: 8,
    duration: "50 min",
    distance: "2.7 km",
    createdAt: "1d ago",
  },
];

function FeedCard({ item }: { item: FeedItem }): JSX.Element {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.username}>@{item.username}</Text>
          <Text style={styles.timestamp}>{item.createdAt}</Text>
        </View>
      </View>

      <Text style={styles.narrative}>{item.narrative}</Text>

      <View style={styles.tagsRow}>
        {item.vibeTags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statText}>🚶 {item.duration}</Text>
        <Text style={styles.statText}>📍 {item.distance}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setLiked(!liked)}
        >
          <Text style={[styles.actionText, liked && styles.actionTextActive]}>
            {liked ? "♥" : "♡"} {liked ? item.likeCount + 1 : item.likeCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>💬 {item.commentCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>↗ Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyState(): JSX.Element {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🌍</Text>
      <Text style={styles.emptyTitle}>No walks yet</Text>
      <Text style={styles.emptySubtitle}>
        Follow other wanderers or generate your first walk to see content here.
      </Text>
    </View>
  );
}

export default function FeedScreen(): JSX.Element {
  const [refreshing, setRefreshing] = useState(false);
  const [feedData, setFeedData] = useState<FeedItem[]>(PLACEHOLDER_FEED);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate network refresh
    setTimeout(() => {
      setFeedData(PLACEHOLDER_FEED);
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
      </View>
      <FlatList
        data={feedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeedCard item={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#C3B1FF"
            colors={["#C3B1FF"]}
          />
        }
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E0031",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#C3B1FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A0A0A",
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: 12,
    color: "#C7C7C7",
    marginTop: 2,
  },
  narrative: {
    fontSize: 15,
    lineHeight: 22,
    color: "#C7C7C7",
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },
  tag: {
    backgroundColor: "#2A1A3E",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#C3B1FF",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#484848",
  },
  statText: {
    fontSize: 13,
    color: "#C7C7C7",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 8,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: "#C7C7C7",
  },
  actionTextActive: {
    color: "#C3B1FF",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 120,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#C7C7C7",
    textAlign: "center",
    lineHeight: 20,
  },
});
