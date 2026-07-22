/** 2-column grid of walk cards using FlatList numColumns=2. */
import React from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import type { Walk } from '@wander/shared-types';
import { Chip } from '../ui';

export interface WalkGridProps {
  walks: Walk[];
  onWalkPress?: (walkId: string) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 10;
const CARD_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_PADDING * 2 - CARD_GAP) / 2;

export default function WalkGrid({
  walks,
  onWalkPress,
}: WalkGridProps): JSX.Element {
  return (
    <FlatList
      data={walks}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => onWalkPress?.(item.id)}
          activeOpacity={0.8}
          accessibilityLabel={`Walk: ${item.title}`}
        >
          {item.photos[0] && (
            <Image
              source={{ uri: item.photos[0].url }}
              style={styles.thumbnail}
              accessibilityLabel={`Photo from ${item.title}`}
            />
          )}
          <View style={styles.cardBody}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.meta}>
              {item.distance_km.toFixed(1)} km • {item.duration_minutes} min
            </Text>
            {item.vibe_tags.length > 0 && (
              <View style={styles.tagsRow}>
                {item.vibe_tags.slice(0, 2).map((tag) => (
                  <Chip key={tag} label={tag} />
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No walks yet</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: CARD_PADDING,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#484848',
  },
  cardBody: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#C7C7C7',
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#484848',
  },
});
