'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import LikeBurst from '../motion/LikeBurst';

export interface FeedItem {
  id: string;
  walkId: string;
  user: {
    username: string;
    avatarUrl: string;
  };
  narrative: string;
  vibeTags: string[];
  stats: {
    distance: string;
    duration: string;
  };
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
}

interface FeedCardProps {
  item: FeedItem;
  onLikeToggle: (walkId: string, liked: boolean) => void;
}

export default function FeedCard({ item, onLikeToggle }: FeedCardProps) {
  const [liked, setLiked] = useState(item.isLiked);
  const [likeCount, setLikeCount] = useState(item.likeCount);
  const [showBurst, setShowBurst] = useState(false);

  const handleLike = useCallback(() => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));

    if (newLiked) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 600);
    }

    onLikeToggle(item.walkId, newLiked);
  }, [liked, item.walkId, onLikeToggle]);

  return (
    <article className="rounded-2xl border border-dark-gray/40 bg-surface p-5 transition-colors hover:border-dark-gray/70">
      {/* Header: avatar + username + timestamp */}
      <div className="mb-4 flex items-center gap-3">
        <Image
          src={item.user.avatarUrl}
          alt={`${item.user.username}'s avatar`}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex-1">
          <Link
            href={`/u/${item.user.username}`}
            className="font-body text-sm font-semibold text-white hover:text-primary transition-colors"
          >
            @{item.user.username}
          </Link>
          <p className="font-body text-xs text-offwhite/60">
            {new Date(item.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Narrative snippet */}
      <Link href={`/walk/${item.walkId}`} className="block">
        <p className="mb-3 font-body text-sm leading-relaxed text-offwhite line-clamp-3">
          {item.narrative}
        </p>
      </Link>

      {/* Vibe tags */}
      {item.vibeTags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {item.vibeTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-3 py-1 font-body text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div className="mb-4 flex gap-4 font-body text-xs text-offwhite/70">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {item.stats.distance}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {item.stats.duration}
        </span>
      </div>

      {/* Actions: like + comment */}
      <div className="flex items-center gap-5 border-t border-dark-gray/30 pt-3">
        <button
          onClick={handleLike}
          className="relative flex items-center gap-1.5 font-body text-sm transition-colors"
          aria-label={liked ? 'Unlike this walk' : 'Like this walk'}
        >
          <motion.svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 ${liked ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-offwhite'}`}
            strokeWidth={2}
            whileTap={{ scale: 1.3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </motion.svg>
          <span className={liked ? 'text-red-400' : 'text-offwhite/70'}>{likeCount}</span>
          <LikeBurst isActive={showBurst} />
        </button>

        <Link
          href={`/walk/${item.walkId}#comments`}
          className="flex items-center gap-1.5 font-body text-sm text-offwhite/70 hover:text-primary transition-colors"
          aria-label={`${item.commentCount} comments`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{item.commentCount}</span>
        </Link>
      </div>
    </article>
  );
}
