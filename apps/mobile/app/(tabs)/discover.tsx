import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

interface WalkPreview {
  id: string;
  title: string;
  username: string;
  duration: string;
  distance: string;
  vibeTags: string[];
  stops: number;
}

const VIBE_FILTERS: string[] = [
  "All",
  "Chill",
  "Artsy",
  "Historic",
  "Nature",
  "Foodie",
  "Nighttime",
  "Scenic",
  "Urban",
];

const SAMPLE_PREVIEW: WalkPreview = {
  id: "preview-1",
  title: "Hidden Art Trail",
  username: "wanderer_kate",
  duration: "35 min",
  distance: "1.9 km",
  vibeTags: ["artsy", "urban"],
  stops: 4,
};

export default function DiscoverScreen(): JSX.Element {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedPin, setSelectedPin] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {VIBE_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapText}>Map loads here</Text>
          <Text style={styles.mapSubtext}>
            Tap pins to preview nearby walks
          </Text>
        </View>

        {/* Simulated Pins */}
        <TouchableOpacity
          style={[styles.pin, { top: "30%", left: "40%" }]}
          onPress={() => setSelectedPin(!selectedPin)}
        >
          <Text style={styles.pinEmoji}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pin, { top: "50%", left: "60%" }]}
          onPress={() => setSelectedPin(!selectedPin)}
        >
          <Text style={styles.pinEmoji}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pin, { top: "65%", left: "30%" }]}
          onPress={() => setSelectedPin(!selectedPin)}
        >
          <Text style={styles.pinEmoji}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* Walk Preview Card */}
      {selectedPin && (
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={styles.previewTitleRow}>
              <Text style={styles.previewTitle}>{SAMPLE_PREVIEW.title}</Text>
              <Text style={styles.previewUsername}>
                @{SAMPLE_PREVIEW.username}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedPin(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.previewStats}>
            <Text style={styles.previewStat}>
              🚶 {SAMPLE_PREVIEW.duration}
            </Text>
            <Text style={styles.previewStat}>
              📍 {SAMPLE_PREVIEW.distance}
            </Text>
            <Text style={styles.previewStat}>
              📌 {SAMPLE_PREVIEW.stops} stops
            </Text>
          </View>

          <View style={styles.previewTags}>
            {SAMPLE_PREVIEW.vibeTags.map((tag) => (
              <View key={tag} style={styles.previewTag}>
                <Text style={styles.previewTagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.previewButton}>
            <Text style={styles.previewButtonText}>View Walk</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  filtersContainer: {
    maxHeight: 50,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#484848",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#C3B1FF",
    borderColor: "#C3B1FF",
  },
  filterChipText: {
    fontSize: 14,
    color: "#C7C7C7",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#0A0A0A",
    fontWeight: "700",
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    overflow: "hidden",
    position: "relative",
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  mapText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
    color: "#C7C7C7",
  },
  pin: {
    position: "absolute",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  pinEmoji: {
    fontSize: 24,
  },
  previewCard: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#484848",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  previewTitleRow: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  previewUsername: {
    fontSize: 13,
    color: "#C3B1FF",
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#484848",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  previewStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  previewStat: {
    fontSize: 13,
    color: "#C7C7C7",
  },
  previewTags: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  previewTag: {
    backgroundColor: "#2A1A3E",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  previewTagText: {
    fontSize: 12,
    color: "#C3B1FF",
    fontWeight: "500",
  },
  previewButton: {
    backgroundColor: "#C3B1FF",
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: "center",
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0A0A0A",
    textTransform: "uppercase",
  },
});
