'use client';

import JoinClubButton from './JoinClubButton';

/**
 * ClubDetailPage — Full club view with header, description,
 * member list, club feed preview, and club leaderboard placeholder.
 */
export interface ClubMember {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

export interface ClubDetailPageProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members?: ClubMember[];
  joined?: boolean;
  coverEmoji?: string;
  onJoinToggle?: (clubId: string, joined: boolean) => void;
  className?: string;
}

const PLACEHOLDER_MEMBERS: ClubMember[] = [
  { id: '1', displayName: 'Alex Rivera' },
  { id: '2', displayName: 'Jordan Lee' },
  { id: '3', displayName: 'Sam Chen' },
  { id: '4', displayName: 'Taylor Kim' },
  { id: '5', displayName: 'Morgan Wu' },
];

export default function ClubDetailPage({
  id,
  name,
  description,
  memberCount,
  members = PLACEHOLDER_MEMBERS,
  joined = false,
  coverEmoji = '🚶',
  onJoinToggle,
  className = '',
}: ClubDetailPageProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="card-3d rounded-xl border border-dark-gray/40 bg-surface p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
              {coverEmoji}
            </span>
            <div>
              <h2 className="font-body text-xl font-bold text-white">{name}</h2>
              <p className="font-body text-sm text-offwhite/50">{memberCount} members</p>
            </div>
          </div>
          <JoinClubButton clubId={id} initialJoined={joined} onToggle={onJoinToggle} />
        </div>
        <p className="mt-4 font-body text-sm leading-relaxed text-offwhite/70">{description}</p>
      </div>

      {/* Members */}
      <div className="card-3d rounded-xl border border-dark-gray/40 bg-surface p-5">
        <h3 className="mb-3 font-body text-sm font-semibold text-white">Members</h3>
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated font-body text-xs font-bold text-primary">
                {member.displayName.charAt(0)}
              </div>
              <span className="font-body text-sm text-offwhite">{member.displayName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Club Feed placeholder */}
      <div className="card-3d rounded-xl border border-dark-gray/40 bg-surface p-5">
        <h3 className="mb-3 font-body text-sm font-semibold text-white">Club Feed</h3>
        <p className="font-body text-xs text-offwhite/50">
          Recent walks and activity from club members will appear here.
        </p>
      </div>

      {/* Club Leaderboard placeholder */}
      <div className="card-3d rounded-xl border border-dark-gray/40 bg-surface p-5">
        <h3 className="mb-3 font-body text-sm font-semibold text-white">
          <span className="text-gradient">Club Leaderboard</span>
        </h3>
        <p className="font-body text-xs text-offwhite/50">
          Top club members this week will appear here.
        </p>
      </div>
    </div>
  );
}
