'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Stop {
  id: string;
  name: string;
  description: string;
  order: number;
}

interface Comment {
  id: string;
  username: string;
  text: string;
  createdAt: string;
}

interface WalkData {
  id: string;
  title: string;
  narrative: string;
  distance: string;
  duration: string;
  vibeTags: string[];
  stops: Stop[];
  comments: Comment[];
  likes: number;
  liked: boolean;
  author: { username: string; avatar: string };
}

export default function WalkDetailPage() {
  const params = useParams<{ walkId: string }>();
  const router = useRouter();
  const [walk, setWalk] = useState<WalkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    async function fetchWalk() {
      try {
        setLoading(true);
        const res = await fetch(`/api/walk/${params.walkId}`);
        if (!res.ok) throw new Error('Failed to load walk');
        const data = await res.json();
        setWalk(data);
        setLiked(data.liked);
        setLikeCount(data.likes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchWalk();
  }, [params.walkId]);

  function handleLike() {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  }

  function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    // In a real app this would POST to the API
    setCommentText('');
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !walk) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-400">{error || 'Walk not found'}</p>
        <button
          onClick={() => router.back()}
          className="rounded-full bg-primary px-6 py-2 font-body text-sm font-bold uppercase text-black"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-primary transition-opacity hover:opacity-80"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Walk Title & Author */}
      <div>
        <h1 className="font-display text-4xl text-white md:text-5xl">{walk.title}</h1>
        <p className="mt-1 text-sm text-offwhite">by @{walk.author.username}</p>
      </div>

      {/* Walk Stats */}
      <div className="flex flex-wrap gap-3">
        <span className="rounded-full border border-dark-gray bg-surface px-4 py-1.5 text-sm font-body text-offwhite">
          {walk.distance}
        </span>
        <span className="rounded-full border border-dark-gray bg-surface px-4 py-1.5 text-sm font-body text-offwhite">
          {walk.duration}
        </span>
        {walk.vibeTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-body font-medium text-primary"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Route Map Placeholder */}
      <div className="flex h-64 items-center justify-center rounded-xl border border-dark-gray bg-surface md:h-80">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="mt-2 text-sm text-offwhite">Route map loads here</p>
        </div>
      </div>

      {/* Stop List */}
      <section>
        <h2 className="font-display text-2xl text-white">Stops</h2>
        <div className="mt-4 space-y-3">
          {walk.stops.map((stop, i) => (
            <div
              key={stop.id}
              className="flex items-start gap-4 rounded-lg border border-dark-gray bg-surface p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-black">
                {i + 1}
              </div>
              <div>
                <h3 className="font-body text-base font-medium text-white">{stop.name}</h3>
                <p className="mt-1 text-sm text-offwhite">{stop.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative */}
      <section>
        <h2 className="font-display text-2xl text-white">Narrative</h2>
        <p className="mt-3 font-body text-base leading-relaxed text-offwhite">
          {walk.narrative}
        </p>
      </section>

      {/* Photo Gallery Placeholder */}
      <section>
        <h2 className="font-display text-2xl text-white">Photos</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="flex aspect-square items-center justify-center rounded-lg border border-dark-gray bg-surface"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dark-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* Like Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold uppercase transition-colors ${
            liked
              ? 'border-primary bg-primary text-black'
              : 'border-dark-gray bg-surface text-offwhite hover:border-primary hover:text-primary'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={liked ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {liked ? 'Liked' : 'Like'}
        </button>
        <span className="text-sm text-offwhite">{likeCount} likes</span>
      </div>

      {/* Comment Thread */}
      <section>
        <h2 className="font-display text-2xl text-white">Comments</h2>

        {/* Comment Input */}
        <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-lg border border-dark-gray bg-surface px-4 py-2.5 text-sm text-white placeholder-offwhite/50 outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold uppercase text-black transition-opacity hover:opacity-90"
          >
            Post
          </button>
        </form>

        {/* Comments List */}
        <div className="mt-4 space-y-3">
          {walk.comments.length === 0 ? (
            <p className="text-sm text-offwhite/70">No comments yet. Be the first!</p>
          ) : (
            walk.comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-dark-gray bg-surface p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">@{comment.username}</span>
                  <span className="text-xs text-offwhite/50">{comment.createdAt}</span>
                </div>
                <p className="mt-1 text-sm text-offwhite">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
