'use client';

import ClubCard from './ClubCard';

/**
 * ClubList — Grid of ClubCards showing available clubs.
 */
export interface ClubListEntry {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  joined?: boolean;
  coverEmoji?: string;
}

export interface ClubListProps {
  clubs?: ClubListEntry[];
  onJoinToggle?: (clubId: string, joined: boolean) => void;
  className?: string;
}

const PLACEHOLDER_CLUBS: ClubListEntry[] = [
  { id: '1', name: 'Morning Walkers', description: 'Early risers who love catching the sunrise on their walks. We meet virtually every morning.', memberCount: 128, coverEmoji: '🌅' },
  { id: '2', name: 'Urban Explorers', description: 'Discover hidden gems and new routes in your city. Share your best finds!', memberCount: 256, coverEmoji: '🏙️' },
  { id: '3', name: 'Dog Walk Squad', description: 'Walking with our furry friends. Share pics of your pup on your routes.', memberCount: 89, coverEmoji: '🐕' },
  { id: '4', name: 'Weekend Warriors', description: 'Long weekend walks only. Going the distance every Saturday and Sunday.', memberCount: 195, coverEmoji: '⛰️' },
  { id: '5', name: 'Night Owls', description: 'Evening and night walkers. City lights and quiet streets.', memberCount: 67, coverEmoji: '🌙' },
  { id: '6', name: 'Park Runners', description: 'Transitioning from running to walking? This club is for you.', memberCount: 142, coverEmoji: '🌳' },
];

export default function ClubList({
  clubs = PLACEHOLDER_CLUBS,
  onJoinToggle,
  className = '',
}: ClubListProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {clubs.map((club) => (
        <ClubCard
          key={club.id}
          id={club.id}
          name={club.name}
          description={club.description}
          memberCount={club.memberCount}
          joined={club.joined}
          coverEmoji={club.coverEmoji}
          onJoinToggle={onJoinToggle}
        />
      ))}
    </div>
  );
}
