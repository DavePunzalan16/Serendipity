/** Edit display_name, bio, and favorite_vibes form. */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { VibeTag } from '@wander/shared-types';
import { Input, Button, Chip } from '../ui';

const ALL_VIBES: VibeTag[] = [
  'cozy', 'urban', 'nature', 'historic', 'artsy',
  'foodie', 'nightlife', 'scenic', 'adventure', 'hidden-gems',
];

export interface ProfileEditFormProps {
  initialDisplayName: string;
  initialBio: string;
  initialVibes: VibeTag[];
  onSubmit: (data: { display_name: string; bio: string; favorite_vibes: VibeTag[] }) => void;
  loading?: boolean;
}

export default function ProfileEditForm({
  initialDisplayName,
  initialBio,
  initialVibes,
  onSubmit,
  loading = false,
}: ProfileEditFormProps): JSX.Element {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [vibes, setVibes] = useState<VibeTag[]>(initialVibes);

  const toggleVibe = (vibe: VibeTag) => {
    setVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleSubmit = () => {
    onSubmit({ display_name: displayName.trim(), bio: bio.trim(), favorite_vibes: vibes });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Input
        label="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Your display name"
      />
      <Input
        label="Bio"
        value={bio}
        onChangeText={setBio}
        placeholder="Tell us about yourself"
      />

      <View style={styles.vibesSection}>
        <Text style={styles.vibesLabel}>Favorite Vibes</Text>
        <View style={styles.vibesGrid}>
          {ALL_VIBES.map((vibe) => (
            <Chip
              key={vibe}
              label={vibe}
              selected={vibes.includes(vibe)}
              onPress={() => toggleVibe(vibe)}
            />
          ))}
        </View>
      </View>

      <Button
        title="Save Changes"
        onPress={handleSubmit}
        loading={loading}
        disabled={!displayName.trim()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  vibesSection: {
    marginBottom: 24,
  },
  vibesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#C7C7C7',
    marginBottom: 10,
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
