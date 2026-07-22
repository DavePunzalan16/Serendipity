'use client';

import { useState } from 'react';
import Button from '../ui/Button';

/**
 * FollowButton — Follow/unfollow button with loading state.
 */
export interface FollowButtonProps {
  isFollowing: boolean;
  onToggle: (following: boolean) => Promise<void>;
  className?: string;
}

export default function FollowButton({ isFollowing: initial, onToggle, className = '' }: FollowButtonProps) {
  const [following, setFollowing] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const newState = !following;
    setFollowing(newState);
    setLoading(true);
    try {
      await onToggle(newState);
    } catch {
      setFollowing(!newState); // revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={following ? 'secondary' : 'primary'}
      size="sm"
      loading={loading}
      onClick={handleClick}
      className={className}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}
