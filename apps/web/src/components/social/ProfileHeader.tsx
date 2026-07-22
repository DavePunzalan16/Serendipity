import type { Profile } from '@wander/shared-types';
import Avatar from '../ui/Avatar';

/**
 * ProfileHeader — Profile info display with avatar, name, bio, and vibes.
 */
export interface ProfileHeaderProps {
  profile: Profile;
  className?: string;
}

export default function ProfileHeader({ profile, className = '' }: ProfileHeaderProps) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <Avatar
        src={profile.avatar_url}
        alt={profile.display_name || profile.username}
        size="xl"
      />
      <h1 className="mt-4 font-body text-xl font-semibold text-white">
        {profile.display_name}
      </h1>
      <p className="font-body text-sm text-offwhite/70">@{profile.username}</p>

      {profile.bio && (
        <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-offwhite/80">
          {profile.bio}
        </p>
      )}

      {profile.favorite_vibes.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {profile.favorite_vibes.map((vibe) => (
            <span
              key={vibe}
              className="rounded-full bg-primary/10 px-3 py-1 font-body text-xs font-medium text-primary"
            >
              {vibe}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
