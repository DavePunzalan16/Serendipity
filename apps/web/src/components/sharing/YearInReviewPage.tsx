'use client';

/**
 * YearInReviewPage — Spotify-Wrapped style year review.
 * Scroll-through sections with stats, top walks, most-used vibes,
 * and total distance. Full page experience.
 */
export interface YearInReviewStats {
  totalWalks: number;
  totalDistance: string;
  totalTime: string;
  topVibes: string[];
  topWalks: { title: string; distance: string; date: string }[];
  longestStreak: number;
  countriesVisited: number;
}

export interface YearInReviewPageProps {
  year?: number;
  stats?: YearInReviewStats;
  className?: string;
}

const DEFAULT_STATS: YearInReviewStats = {
  totalWalks: 312,
  totalDistance: '1,247 km',
  totalTime: '312 hrs',
  topVibes: ['Chill', 'Energetic', 'Reflective', 'Adventure'],
  topWalks: [
    { title: 'Sunrise at the Lake', distance: '8.2 km', date: 'Mar 15' },
    { title: 'City Night Wander', distance: '6.7 km', date: 'Jul 22' },
    { title: 'Mountain Trail Loop', distance: '12.4 km', date: 'Oct 3' },
  ],
  longestStreak: 34,
  countriesVisited: 4,
};

export default function YearInReviewPage({
  year = 2024,
  stats = DEFAULT_STATS,
  className = '',
}: YearInReviewPageProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Hero section */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-2 font-body text-sm font-medium uppercase tracking-widest text-primary">
          Your Year in Walking
        </p>
        <h1 className="font-display text-7xl text-white md:text-9xl">{year}</h1>
        <p className="mt-4 font-body text-lg text-offwhite/60">
          What a year it's been. Let's look back.
        </p>
        <div className="mt-8 animate-bounce text-offwhite/30">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Total stats */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <div className="card-3d rounded-2xl border border-dark-gray/40 bg-surface p-8">
            <h2 className="mb-6 text-center font-body text-sm font-semibold uppercase tracking-wide text-offwhite/50">
              The Numbers
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div className="text-center">
                <p className="font-body text-3xl font-bold text-gradient">{stats.totalWalks}</p>
                <p className="mt-1 font-body text-xs text-offwhite/50">Total Walks</p>
              </div>
              <div className="text-center">
                <p className="font-body text-3xl font-bold text-white">{stats.totalDistance}</p>
                <p className="mt-1 font-body text-xs text-offwhite/50">Distance</p>
              </div>
              <div className="text-center">
                <p className="font-body text-3xl font-bold text-white">{stats.totalTime}</p>
                <p className="mt-1 font-body text-xs text-offwhite/50">Time Walking</p>
              </div>
              <div className="text-center">
                <p className="font-body text-3xl font-bold text-accent">{stats.longestStreak}</p>
                <p className="mt-1 font-body text-xs text-offwhite/50">Day Streak</p>
              </div>
              <div className="text-center">
                <p className="font-body text-3xl font-bold text-white">{stats.countriesVisited}</p>
                <p className="mt-1 font-body text-xs text-offwhite/50">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top walks */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-center font-body text-sm font-semibold uppercase tracking-wide text-offwhite/50">
            Top Walks
          </h2>
          <div className="space-y-3">
            {stats.topWalks.map((walk, i) => (
              <div
                key={i}
                className="card-3d flex items-center gap-4 rounded-xl border border-dark-gray/40 bg-surface p-4"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-body text-sm font-bold text-primary">
                  #{i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold text-white">{walk.title}</p>
                  <p className="font-body text-xs text-offwhite/50">{walk.date}</p>
                </div>
                <span className="font-body text-sm font-bold text-gradient">{walk.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top vibes */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-6 font-body text-sm font-semibold uppercase tracking-wide text-offwhite/50">
            Your Top Vibes
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {stats.topVibes.map((vibe, i) => (
              <span
                key={i}
                className="rounded-full border border-primary/30 bg-primary/5 px-5 py-2 font-body text-sm font-medium text-primary"
              >
                {vibe}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="flex min-h-[40vh] flex-col items-center justify-center px-6 text-center">
        <p className="font-body text-2xl font-bold text-white">See you on the trails in {year + 1} ✨</p>
        <p className="mt-2 font-body text-sm text-offwhite/50">Keep walking. Keep exploring.</p>
      </section>
    </div>
  );
}
