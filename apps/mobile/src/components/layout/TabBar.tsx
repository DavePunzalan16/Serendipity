/** Custom bottom tab bar with 4 tabs: Feed, Discover, Walk, Profile. */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

export type TabName = 'feed' | 'discover' | 'walk' | 'profile';

export interface TabBarProps {
  currentTab: TabName;
  onTabPress: (tab: TabName) => void;
}

interface TabItem {
  name: TabName;
  label: string;
  icon: string;
}

const tabs: TabItem[] = [
  { name: 'feed', label: 'Feed', icon: '📰' },
  { name: 'discover', label: 'Discover', icon: '🔍' },
  { name: 'walk', label: 'Walk', icon: '🚶' },
  { name: 'profile', label: 'Profile', icon: '👤' },
];

export default function TabBar({ currentTab, onTabPress }: TabBarProps): JSX.Element {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onTabPress(tab.name)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#484848',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    height: Platform.OS === 'ios' ? 88 : 64,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C7C7C7',
  },
  activeLabel: {
    color: '#C3B1FF',
  },
});
