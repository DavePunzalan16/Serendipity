/**
 * YearInReviewPage — ScrollView year-in-review page showing annual stats sections.
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export interface YearHighlight {
  /** Highlight label */
  label: string;
  /** Highlight value */
  value: string;
  /** Optional emoji */
  icon?: string;
}

export interface YearInReviewPageProps {
  /** Year (e.g. 2024) */
  year: number;
  /** Total distance walked during the year */
  totalDistance: string;
  /** Total walks completed */
  totalWalks: number;
  /** Total hours walked */
  totalHours: string;
  /** Longest single walk */
  longestWalk: string;
  /** Most active month */
  mostActiveMonth: string;
  /** Array of highlight stats */
  highlights: YearHighlight[];
}

/**
 * YearInReviewPage renders a scrollable year-in-review with multiple stat sections.
 */
export default function YearInReviewPage({
  year,
  totalDistance,
  totalWalks,
  totalHours,
  longestWalk,
  mostActiveMonth,
  highlights,
}: YearInReviewPageProps): JSX.Element {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.yearText}>{year}</Text>
        <Text style={styles.heroTitle}>Year in Review</Text>
        <Text style={styles.heroSubtitle}>Your walking journey this year</Text>
      </View>

      {/* Primary Stats */}
      <View style={styles.section}>
        <View style={styles.primaryGrid}>
          <View style={styles.primaryCard}>
            <Text style={styles.primaryValue}>{totalDistance}</Text>
            <Text style={styles.primaryLabel}>Total Distance</Text>
          </View>
          <View style={styles.primaryCard}>
            <Text style={styles.primaryValue}>{totalWalks}</Text>
            <Text style={styles.primaryLabel}>Total Walks</Text>
          </View>
          <View style={styles.primaryCard}>
            <Text style={styles.primaryValue}>{totalHours}</Text>
            <Text style={styles.primaryLabel}>Hours Walking</Text>
          </View>
        </View>
      </View>

      {/* Records */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Records</Text>
        <View style={styles.recordRow}>
          <Text style={styles.recordLabel}>Longest Walk</Text>
          <Text style={styles.recordValue}>{longestWalk}</Text>
        </View>
        <View style={styles.recordRow}>
          <Text style={styles.recordLabel}>Most Active Month</Text>
          <Text style={styles.recordValue}>{mostActiveMonth}</Text>
        </View>
      </View>

      {/* Highlights */}
      {highlights.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Highlights</Text>
          {highlights.map((item, index) => (
            <View key={index} style={styles.highlightRow}>
              {item.icon && <Text style={styles.highlightIcon}>{item.icon}</Text>}
              <View style={styles.highlightContent}>
                <Text style={styles.highlightLabel}>{item.label}</Text>
                <Text style={styles.highlightValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1A',
  },
  content: {
    paddingBottom: 48,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 4,
  },
  yearText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#00D26A',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#374151',
  },
  section: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 4,
  },
  primaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  primaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#00D26A',
  },
  primaryLabel: {
    fontSize: 10,
    color: '#374151',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  recordLabel: {
    fontSize: 14,
    color: '#E2E8F0',
  },
  recordValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00E5FF',
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  highlightIcon: {
    fontSize: 22,
  },
  highlightContent: {
    flex: 1,
    gap: 2,
  },
  highlightLabel: {
    fontSize: 13,
    color: '#374151',
  },
  highlightValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E2E8F0',
  },
});
