'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

/**
 * WeeklyRecapModal — Once-per-week modal showing walking recap.
 * Includes walk count, distance, new badges, and comparison to prior week.
 * Features animated counters for a celebratory feel.
 */
export interface WeeklyRecapStats {
  walks: number;
  distance: number;
  badges: number;
  prevWalks: number;
  prevDistance: number;
}

export interface WeeklyRecapModalProps {
  open: boolean;
  onClose: () => void;
  stats?: WeeklyRecapStats;
  className?: string;
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <span className="font-body text-2xl font-bold text-gradient">
      {count}{suffix}
    </span>
  );
}

const DEFAULT_STATS: WeeklyRecapStats = {
  walks: 12,
  distance: 24.6,
  badges: 2,
  prevWalks: 9,
  prevDistance: 18.2,
};

export default function WeeklyRecapModal({
  open,
  onClose,
  stats = DEFAULT_STATS,
}: WeeklyRecapModalProps) {
  const walkDiff = stats.walks - stats.prevWalks;
  const distDiff = (stats.distance - stats.prevDistance).toFixed(1);

  return (
    <Modal open={open} onClose={onClose} title="📊 Your Week in Review">
      <div className="space-y-5">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-background/60 p-4 text-center">
            <AnimatedCounter target={stats.walks} />
            <p className="mt-1 font-body text-xs text-offwhite/50">Walks</p>
          </div>
          <div className="rounded-lg bg-background/60 p-4 text-center">
            <AnimatedCounter target={Math.round(stats.distance * 10) / 10} suffix=" km" />
            <p className="mt-1 font-body text-xs text-offwhite/50">Distance</p>
          </div>
        </div>

        {/* Badges */}
        {stats.badges > 0 && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-center">
            <p className="font-body text-sm text-white">
              🏅 You earned <span className="font-bold text-primary">{stats.badges}</span> new badge{stats.badges !== 1 ? 's' : ''}!
            </p>
          </div>
        )}

        {/* Comparison */}
        <div className="rounded-lg bg-background/40 p-3">
          <p className="mb-2 font-body text-xs font-medium text-offwhite/60">vs. Last Week</p>
          <div className="flex justify-between">
            <span className="font-body text-xs text-offwhite/70">
              Walks:{' '}
              <span className={walkDiff >= 0 ? 'text-primary' : 'text-red-400'}>
                {walkDiff >= 0 ? '+' : ''}{walkDiff}
              </span>
            </span>
            <span className="font-body text-xs text-offwhite/70">
              Distance:{' '}
              <span className={Number(distDiff) >= 0 ? 'text-primary' : 'text-red-400'}>
                {Number(distDiff) >= 0 ? '+' : ''}{distDiff} km
              </span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full rounded-full bg-primary py-2.5 font-body text-sm font-bold uppercase text-background transition-colors hover:bg-primary-light"
        >
          Keep Going!
        </button>
      </div>
    </Modal>
  );
}
