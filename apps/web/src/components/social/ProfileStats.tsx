import Card from '../ui/Card';

/**
 * ProfileStats — Stats cards grid showing profile metrics.
 */
export interface ProfileStatsProps {
  totalWalks: number;
  totalDistanceKm: number;
  followerCount: number;
  followingCount: number;
  className?: string;
}

export default function ProfileStats({
  totalWalks,
  totalDistanceKm,
  followerCount,
  followingCount,
  className = '',
}: ProfileStatsProps) {
  const stats = [
    { label: 'Walks', value: totalWalks },
    { label: 'Distance', value: `${totalDistanceKm.toFixed(1)}km` },
    { label: 'Followers', value: followerCount },
    { label: 'Following', value: followingCount },
  ];

  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${className}`}>
      {stats.map((stat) => (
        <Card key={stat.label} className="text-center">
          <p className="font-body text-lg font-bold text-primary">{stat.value}</p>
          <p className="font-body text-xs text-offwhite/60">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
