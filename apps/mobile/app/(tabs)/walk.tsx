import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

interface WalkStop {
  id: string;
  name: string;
  description: string;
  type: string;
}

interface GeneratedWalk {
  title: string;
  duration: string;
  distance: string;
  stops: WalkStop[];
}

const DURATION_OPTIONS: { label: string; minutes: number }[] = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "60 min", minutes: 60 },
  { label: "90 min", minutes: 90 },
];

const VIBE_TAGS: string[] = [
  "Chill",
  "Artsy",
  "Historic",
  "Nature",
  "Foodie",
  "Nighttime",
  "Adventurous",
  "Scenic",
  "Urban",
  "Cozy",
  "Surprise Me",
];

const MOCK_WALK: GeneratedWalk = {
  title: "Hidden Art Trail",
  duration: "35 min",
  distance: "1.9 km",
  stops: [
    {
      id: "s1",
      name: "The Painted Alley",
      description: "A narrow lane covered in vibrant street murals",
      type: "🎨",
    },
    {
      id: "s2",
      name: "Café Obscura",
      description: "Tiny espresso spot with rotating local art displays",
      type: "☕",
    },
    {
      id: "s3",
      name: "River Bend Overlook",
      description: "A quiet bench with a view of the old stone bridge",
      type: "🌉",
    },
    {
      id: "s4",
      name: "The Book Garden",
      description: "An open-air reading nook hidden behind the library",
      type: "📚",
    },
  ],
};

export default function WalkGenerationScreen(): JSX.Element {
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [generatedWalk, setGeneratedWalk] = useState<GeneratedWalk | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleVibe = (vibe: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setGeneratedWalk(MOCK_WALK);
      setIsGenerating(false);
    }, 2000);
  };

  const handleReset = () => {
    setGeneratedWalk(null);
    setSelectedVibes([]);
    setSelectedDuration(30);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Generate a Walk</Text>
        <Text style={styles.headerSubtitle}>
          Choose your time and vibe to start exploring
        </Text>

        {!generatedWalk ? (
          <>
            {/* Duration Picker */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Duration</Text>
              <View style={styles.durationRow}>
                {DURATION_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.minutes}
                    style={[
                      styles.durationChip,
                      selectedDuration === option.minutes &&
                        styles.durationChipActive,
                    ]}
                    onPress={() => setSelectedDuration(option.minutes)}
                  >
                    <Text
                      style={[
                        styles.durationChipText,
                        selectedDuration === option.minutes &&
                          styles.durationChipTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Vibe Tags Multi-select */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vibes</Text>
              <Text style={styles.sectionHint}>
                Select one or more (optional)
              </Text>
              <View style={styles.vibeGrid}>
                {VIBE_TAGS.map((vibe) => (
                  <TouchableOpacity
                    key={vibe}
                    style={[
                      styles.vibeTag,
                      selectedVibes.includes(vibe) && styles.vibeTagActive,
                    ]}
                    onPress={() => toggleVibe(vibe)}
                  >
                    <Text
                      style={[
                        styles.vibeTagText,
                        selectedVibes.includes(vibe) &&
                          styles.vibeTagTextActive,
                      ]}
                    >
                      {vibe}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              style={[
                styles.generateButton,
                isGenerating && styles.generateButtonDisabled,
              ]}
              onPress={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator color="#0A0A0A" size="small" />
              ) : (
                <Text style={styles.generateButtonText}>Generate Walk</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          /* Generated Walk Result */
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>{generatedWalk.title}</Text>
              <View style={styles.resultMeta}>
                <Text style={styles.resultMetaText}>
                  🚶 {generatedWalk.duration}
                </Text>
                <Text style={styles.resultMetaText}>
                  📍 {generatedWalk.distance}
                </Text>
                <Text style={styles.resultMetaText}>
                  📌 {generatedWalk.stops.length} stops
                </Text>
              </View>
            </View>

            <View style={styles.stopsContainer}>
              <Text style={styles.stopsTitle}>Your stops</Text>
              {generatedWalk.stops.map((stop, index) => (
                <View key={stop.id} style={styles.stopItem}>
                  <View style={styles.stopNumber}>
                    <Text style={styles.stopNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stopContent}>
                    <View style={styles.stopHeader}>
                      <Text style={styles.stopEmoji}>{stop.type}</Text>
                      <Text style={styles.stopName}>{stop.name}</Text>
                    </View>
                    <Text style={styles.stopDescription}>
                      {stop.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Walk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.regenerateButton}
                onPress={handleReset}
              >
                <Text style={styles.regenerateButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E0031",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#C7C7C7",
    marginBottom: 32,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 13,
    color: "#C7C7C7",
    marginBottom: 12,
  },
  durationRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  durationChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#484848",
  },
  durationChipActive: {
    backgroundColor: "#C3B1FF",
    borderColor: "#C3B1FF",
  },
  durationChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#C7C7C7",
  },
  durationChipTextActive: {
    color: "#0A0A0A",
    fontWeight: "700",
  },
  vibeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  vibeTag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#484848",
  },
  vibeTagActive: {
    backgroundColor: "#2A1A3E",
    borderColor: "#C3B1FF",
  },
  vibeTagText: {
    fontSize: 14,
    color: "#C7C7C7",
    fontWeight: "500",
  },
  vibeTagTextActive: {
    color: "#C3B1FF",
    fontWeight: "600",
  },
  generateButton: {
    backgroundColor: "#C3B1FF",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A0A0A",
    textTransform: "uppercase",
  },
  resultContainer: {
    marginTop: 8,
  },
  resultHeader: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  resultMeta: {
    flexDirection: "row",
    gap: 16,
  },
  resultMetaText: {
    fontSize: 14,
    color: "#C7C7C7",
  },
  stopsContainer: {
    marginBottom: 24,
  },
  stopsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  stopItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stopNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#C3B1FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stopNumberText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0A0A0A",
  },
  stopContent: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 14,
  },
  stopHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  stopEmoji: {
    fontSize: 18,
  },
  stopName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  stopDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#C7C7C7",
  },
  resultActions: {
    gap: 12,
  },
  startButton: {
    backgroundColor: "#C3B1FF",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A0A0A",
    textTransform: "uppercase",
  },
  regenerateButton: {
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#484848",
  },
  regenerateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#C7C7C7",
  },
});
