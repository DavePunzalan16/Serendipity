/** "Follow wanderers to see walks" empty state with discover link. */
import React from 'react';
import { EmptyState } from '../ui';

export interface FeedEmptyStateProps {
  onDiscover?: () => void;
}

export default function FeedEmptyState({
  onDiscover,
}: FeedEmptyStateProps): JSX.Element {
  return (
    <EmptyState
      icon="🚶"
      title="No walks in your feed yet"
      subtitle="Follow wanderers to see their walks here"
      actionLabel="Discover Wanderers"
      onAction={onDiscover}
    />
  );
}
