'use client';

import { useState, useCallback } from 'react';
import { PageContainer } from '@/components/layout';
import { TimeSlider, VibeChips, WalkPreviewCard, StopList } from '@/components/walk';
import { ChallengeCard } from '@/components/gamification';
import { Button } from '@/components/ui';
import type { VibeTag, Stop } from '@wander/shared-types';

// Placeholder stop data for preview
const PLACEHOLDER_STOPS: Stop[] = [
  {
    id: 's1',
    order_index: 0,
    title: 'The Green Bean Café',
    description: 'Start your journey with a warm latte at this ivy-covered corner café.',
    latitude: 40.7128,
    longitude: -74.006,
    visited: false,
  },
  {
    id: 's2',
    order_index: 1,
    title: 'Riverside Park Lookout',
    description: 'A quiet bench overlooking the river. Perfect for people-watching.',
    latitude: 40.7138,
    longitude: -74.008,
    visited: false,
  },
  {
    id: 's3',
    order_index: 2,
    title: 'Vintage Books & Vinyl',
    description: 'Browse rare finds in this two-story bookshop with a hidden vinyl collection upstairs.',
    latitude: 40.715,
    longitude: -74.005,
    visited: false,
  },
] as Stop[];

export default function NewWalkPage() {
  const [duration, setDuration] = useState(30);
  const [selectedVibes, setSelectedVibes] = useState<VibeTag[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [walkGenerated, setWalkGenerated] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    // Simulating API call
    await new Promise((r) => setTimeout(r, 1500));
    setWalkGenerated(true);
    setIsGenerating(false);
  }, []);

  return (
    <PageContainer className="py-12">
      <h1 className="mb-2 font-display text-5xl tracking-tight text-white md:text-6xl">
        New Walk
      </h1>
      <p className="mb-10 font-body text-base text-offwhite/70">
        Set your preferences and we'll generate a unique route for you.
      </p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left: Configuration */}
        <div className="lg:col-span-2">
          {/* Duration */}
          <section className="mb-8">
            <h2 className="mb-4 font-body text-lg font-semibold text-white">
              How long do you want to walk?
            </h2>
            <TimeSlider value={duration} onChange={setDuration} className="max-w-md" />
          </section>

          {/* Vibe selection */}
          <section className="mb-8">
            <h2 className="mb-4 font-body text-lg font-semibold text-white">
              Pick your vibe
            </h2>
            <VibeChips selected={selectedVibes} onChange={setSelectedVibes} />
          </section>

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={selectedVibes.length === 0}
            className="mb-10"
          >
            {isGenerating ? 'Generating...' : 'Generate Walk'}
          </Button>

          {/* Generated walk preview */}
          {walkGenerated && (
            <section className="space-y-6">
              <h2 className="font-display text-3xl text-white">Your Walk</h2>

              <WalkPreviewCard
                title="Hidden Gems of Riverside"
                narrative="A curated stroll through quiet alleyways and charming spots along the waterfront. Discover vintage shops, cozy cafés, and a park overlook with panoramic views."
                vibeTags={selectedVibes.length > 0 ? selectedVibes : ['cozy', 'hidden-gems']}
                durationMinutes={duration}
                distanceKm={2.4}
                stopCount={3}
              />

              <h3 className="font-body text-base font-semibold text-white">Stops</h3>
              <StopList stops={PLACEHOLDER_STOPS} />

              <Button className="w-full sm:w-auto">Start Walking</Button>
            </section>
          )}
        </div>

        {/* Right: Active challenges */}
        <aside className="space-y-4">
          <h2 className="font-display text-2xl text-white">Active Challenges</h2>
          <ChallengeCard
            title="Weekend Wanderer"
            description="Complete 3 walks this weekend"
            current={1}
            target={3}
            icon="🚶"
          />
          <ChallengeCard
            title="Vibe Collector"
            description="Walk with 5 different vibes"
            current={3}
            target={5}
            icon="✨"
          />
          <ChallengeCard
            title="Social Explorer"
            description="Walk a route shared by a friend"
            current={0}
            target={1}
            icon="🤝"
          />
        </aside>
      </div>
    </PageContainer>
  );
}
