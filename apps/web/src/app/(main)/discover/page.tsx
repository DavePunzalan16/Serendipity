'use client';

import { useState, useEffect } from 'react';

interface WalkPreview {
  id: string;
  title: string;
  author: string;
  distance: string;
  duration: string;
  vibeTags: string[];
  likes: number;
}

const VIBE_OPTIONS = [
  'cozy', 'urban', 'nature', 'historic', 'artsy',
  'foodie', 'nightlife', 'scenic', 'adventure', 'hidden-gems',
];

export default function DiscoverPage() {
  const [walks, setWalks] = useState<WalkPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [distance, setDistance] = useState(5);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [selectedWalk, setSelectedWalk] = useState<WalkPreview | null>(null);

  useEffect(() => {
    async function fetchWalks() {
      try {
        setLoading(true);
        // Mock bounding box params — real impl would use map viewport
        const res = await fetch(
          `/api/discover?north=40.8&south=40.7&east=-73.9&west=-74.0`
        );
        if (!res.ok) throw new Error('Failed to load walks');
        const data = await res.json();
        setWalks(data.walks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchWalks();
  }, []);

  function toggleVibe(vibe: string) {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  }

  const filteredWalks = walks.filter((w) => {
    if (selectedVibes.length === 0) return true;
    return w.vibeTags.some((t) => selectedVibes.includes(t));
  });

  const sortedWalks = [...filteredWalks].sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    return 0; // 'recent' — keep API order
  });

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:flex-row">
      {/* Filter Sidebar */}
      <aside className="w-full shrink-0 space-y-6 lg:w-72">
        <div className="rounded-xl border border-dark-gray bg-surface p-5">
          <h2 className="font-display text-xl text-white">Filters</h2>

          {/* Vibe Tags */}
          <div className="mt-4">
            <label className="text-xs font-medium uppercase tracking-wide text-offwhite">
              Vibes
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {VIBE_OPTIONS.map((vibe) => (
                <button
                  key={vibe}
                  onClick={() => toggleVibe(vibe)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    selectedVibes.includes(vibe)
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-dark-gray text-offwhite hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Slider */}
          <div className="mt-5">
            <label className="text-xs font-medium uppercase tracking-wide text-offwhite">
              Max Distance: {distance} km
            </label>
            <input
              type="range"
              min={1}
              max={20}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
          </div>

          {/* Sort Toggle */}
          <div className="mt-5">
            <label className="text-xs font-medium uppercase tracking-wide text-offwhite">
              Sort by
            </label>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setSortBy('recent')}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase transition-colors ${
                  sortBy === 'recent'
                    ? 'bg-primary text-black'
                    : 'border border-dark-gray text-offwhite hover:text-primary'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase transition-colors ${
                  sortBy === 'popular'
                    ? 'bg-primary text-black'
                    : 'border border-dark-gray text-offwhite hover:text-primary'
                }`}
              >
                Popular
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Map Placeholder */}
        <div className="relative flex h-72 items-center justify-center rounded-xl border border-dark-gray bg-surface md:h-96">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-14 w-14 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="mt-3 text-base text-offwhite">Map loads here</p>
            <p className="mt-1 text-xs text-offwhite/50">Click a pin to preview a walk</p>
          </div>

          {/* Simulated map pins */}
          {sortedWalks.slice(0, 5).map((w, i) => (
            <button
              key={w.id}
              onClick={() => setSelectedWalk(w)}
              className="absolute h-5 w-5 rounded-full bg-primary shadow-lg transition-transform hover:scale-125"
              style={{
                top: `${25 + i * 12}%`,
                left: `${15 + i * 15}%`,
              }}
              aria-label={`View walk: ${w.title}`}
            />
          ))}
        </div>

        {/* Walk Preview Card (when pin is clicked) */}
        {selectedWalk && (
          <div className="rounded-xl border border-primary/30 bg-surface p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-body text-lg font-medium text-white">
                  {selectedWalk.title}
                </h3>
                <p className="mt-1 text-sm text-offwhite">
                  by @{selectedWalk.author} · {selectedWalk.distance} · {selectedWalk.duration}
                </p>
              </div>
              <button
                onClick={() => setSelectedWalk(null)}
                className="text-offwhite/50 hover:text-white"
                aria-label="Close preview"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedWalk.vibeTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={`/walk/${selectedWalk.id}`}
              className="mt-4 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-bold uppercase text-black transition-opacity hover:opacity-90"
            >
              Walk this route
            </a>
          </div>
        )}

        {/* Walk Cards Grid */}
        <div>
          <h2 className="font-display text-2xl text-white">
            Nearby Walks
            {loading && <span className="ml-2 text-sm text-offwhite">Loading...</span>}
          </h2>

          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}

          {!loading && sortedWalks.length === 0 && (
            <p className="mt-4 text-sm text-offwhite/70">
              No walks found in this area. Try adjusting your filters.
            </p>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {sortedWalks.map((walk) => (
              <div
                key={walk.id}
                className="cursor-pointer rounded-xl border border-dark-gray bg-surface p-4 transition-colors hover:border-primary/40"
                onClick={() => setSelectedWalk(walk)}
              >
                <h3 className="font-body text-base font-medium text-white">{walk.title}</h3>
                <p className="mt-1 text-xs text-offwhite">
                  @{walk.author} · {walk.distance} · {walk.duration}
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
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-offwhite/60">{walk.likes} likes</span>
                  <a
                    href={`/walk/${walk.id}`}
                    className="text-xs font-bold uppercase text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Walk this route →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
