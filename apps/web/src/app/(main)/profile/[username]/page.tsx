'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  joinDate: string;
  followers: number;
  following: number;
  isOwnProfile: boolean;
  isFollowing: boolean;
  stats: {
    totalWalks: number;
    totalDistance: string;
    favoriteVibes: string[];
  };
  walks: {
    id: string;
    title: string;
    distance: string;
    duration: string;
    vibeTags: string[];
    likes: number;
  }[];
}

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch(`/api/profile/${params.username}`);
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setProfile(data);
        setIsFollowing(data.isFollowing);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [params.username]);

  function handleFollowToggle() {
    setIsFollowing(!isFollowing);
    if (profile) {
      setProfile({
        ...profile,
        followers: isFollowing ? profile.followers - 1 : profile.followers + 1,
      });
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-400">{error || 'Profile not found'}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-surface text-3xl font-bold text-primary">
          {profile.displayName.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="font-display text-3xl text-white md:text-4xl">
            {profile.displayName}
          </h1>
          <p className="mt-0.5 text-sm text-primary">@{profile.username}</p>
          {profile.bio && (
            <p className="mt-2 max-w-lg font-body text-base text-offwhite">
              {profile.bio}
            </p>
          )}
          <p className="mt-2 text-xs text-offwhite/60">
            Joined {profile.joinDate}
          </p>

          {/* Follower counts */}
          <div className="mt-3 flex justify-center gap-6 sm:justify-start">
            <div className="text-center">
              <span className="block text-lg font-bold text-white">{profile.followers}</span>
              <span className="text-xs text-offwhite">Followers</span>
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold text-white">{profile.following}</span>
              <span className="text-xs text-offwhite">Following</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          {profile.isOwnProfile ? (
            <a
              href="/settings"
              className="rounded-full border border-dark-gray px-5 py-2 text-sm font-bold uppercase text-offwhite transition-colors hover:border-primary hover:text-primary"
            >
              Edit Profile
            </a>
          ) : (
            <button
              onClick={handleFollowToggle}
              className={`rounded-full px-6 py-2 text-sm font-bold uppercase transition-colors ${
                isFollowing
                  ? 'border border-primary bg-transparent text-primary hover:bg-primary/10'
                  : 'bg-primary text-black hover:opacity-90'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-dark-gray bg-surface p-5 text-center">
          <span className="block font-display text-3xl text-white">
            {profile.stats.totalWalks}
          </span>
          <span className="mt-1 text-xs uppercase tracking-wide text-offwhite">
            Total Walks
          </span>
        </div>
        <div className="rounded-xl border border-dark-gray bg-surface p-5 text-center">
          <span className="block font-display text-3xl text-white">
            {profile.stats.totalDistance}
          </span>
          <span className="mt-1 text-xs uppercase tracking-wide text-offwhite">
            Total Distance
          </span>
        </div>
        <div className="rounded-xl border border-dark-gray bg-surface p-5 text-center">
          <div className="flex flex-wrap justify-center gap-1.5">
            {profile.stats.favoriteVibes.map((vibe) => (
              <span
                key={vibe}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {vibe}
              </span>
            ))}
          </div>
          <span className="mt-2 block text-xs uppercase tracking-wide text-offwhite">
            Favorite Vibes
          </span>
        </div>
      </div>

      {/* Walk Grid */}
      <section>
        <h2 className="font-display text-2xl text-white">Public Walks</h2>

        {profile.walks.length === 0 ? (
          <p className="mt-4 text-sm text-offwhite/70">
            No public walks yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {profile.walks.map((walk) => (
              <a
                key={walk.id}
                href={`/walk/${walk.id}`}
                className="block rounded-xl border border-dark-gray bg-surface p-4 transition-colors hover:border-primary/40"
              >
                <h3 className="font-body text-base font-medium text-white">
                  {walk.title}
                </h3>
                <p className="mt-1 text-xs text-offwhite">
                  {walk.distance} · {walk.duration}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {walk.vibeTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-2 block text-xs text-offwhite/60">
                  {walk.likes} likes
                </span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
