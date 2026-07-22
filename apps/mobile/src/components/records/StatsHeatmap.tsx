/**
 * StatsHeatmap — Contribution-style grid showing activity intensity per day using colored View cells.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface HeatmapDay {
  /** Date string (e.g. "2024-01-15") */
  date: string;
  /** Intensity level from 0 (none) to 4 (maximum) */
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface StatsHeatmapProps {
  /** Array of day data for the heatmap */
  data: HeatmapDay[];
  /** Number of weeks to display (columns) */
  weeks?: number;
  /** Label above the heatmap */
  label?: string;
}

const INTENSITY_COLORS: Record<number, string> = {
  0: '#111827',
  1: 'rgba(0, 210, 106, 0.2)',
  2: 'rgba(0, 210, 106, 0.4)',
  3: 'rgba(0, 210, 106, 0.7)',
  4: '#00D26A',
};

/**
 * StatsHeatmap renders a GitHub-style contribution grid colored by walking intensity.
 */
export default function StatsHeatmap({
  data,
  weeks = 12,
  label = 'Activity',
}: StatsHeatmapProps): JSX.Element {
  const totalCells = weeks * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day = data[i];
    return day ? day.intensity : 0;
  });

  // Build columns (each column = 7 days)
  const columns: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    columns.push(cells.slice(w * 7, w * 7 + 7));
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.grid}>
        {columns.map((column, colIdx) => (
          <View key={colIdx} style={styles.column}>
            {column.map((intensity, rowIdx) => (
              <View
                key={`${colIdx}-${rowIdx}`}
                style={[
                  styles.cell,
                  { backgroundColor: INTENSITY_COLORS[intensity] },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        {[0, 1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[styles.legendCell, { backgroundColor: INTENSITY_COLORS[level] }]}
          />
        ))}
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    gap: 3,
  },
  column: {
    gap: 3,
  },
  cell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    color: '#374151',
  },
});
