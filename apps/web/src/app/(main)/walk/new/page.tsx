'use client';

import { useState } from 'react';

interface GeneratedStop {
  id: string;
  name: string;
  description: string;
  order: number;
}

interface GeneratedWalk {
  id: string;
  title: string;
  narrative: string;
  distance: string;
  duration: string;
  stops: GeneratedStop[];
  vibeTags: string[];
}

const VIBE_OPTIONS = [
  'cozy', 'urban', 'nature', 'historic', 'artsy',
  'foodie', 'nightlife', 'scenic', 'adventure', 'hidden-gems',
];

export default function NewWalkPage() {
  const [duration, setDuration] = useState(30);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedWalk, setGeneratedWalk] = useState<GeneratedWalk | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggleVibe(vibe: string) {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  }

  async function handleGenerate() {
    if (selectedVibes.length === 0) {
      setError('Please select at least one vibe');
      return;
    }

    try {
      setError(null);
      setGenerating(true);
      setGeneratedWalk(null);

      const res = await fetch('/api/walk/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration, vibes: selectedVibes }),
      });

      if (!res.ok) throw new Error('Failed to generate walk');
      const data = await res.json();
      setGeneratedWalk(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl text-white md:text-5xl">Generate a Walk</h1>
        <p className="mt-2 font-body text-base text-offwhite">
          Choose your vibe and duration, and we'll craft a unique walking route for you.
        </p>
      </div>

      {/* Duration Slider */}
      <div className="rounded-xl border border-dark-gray bg-surface p-6">
        <label className="text-sm font-medium uppercase tracking-wide text-offwhite">
          Duration
        </label>
        <div className="mt-3 flex items-center gap-4">
          <input
            type="range"
            min={15}
            max={120}
            step={5}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="w-20 rounded-lg border border-dark-gray bg-background px-3 py-1.5 text-center text-sm font-bold text-white">
            {duration} min
          </span>
        </div>
        <div className="mt-2 flex justify-between text-xs text-offwhite/50">
          <span>15 min</span>
          <span>120 min</span>
        </div>
      </div>

      {/* Vibe Tag Selector */}
      <div className="rounded-xl border border-dark-gray bg-surface p-6">
        <label className="text-sm font-medium uppercase tracking-wide text-offwhite">
          Select Vibes
        </label>
        <p className="mt-1 text-xs text-offwhite/60">Choose one or more to shape your walk</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {VIBE_OPTIONS.map((vibe) => (
            <button
              key={vibe}
              onClick={() => toggleVibe(vibe)}
              className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition-all ${
                selectedVibes.includes(vibe)
                  ? 'border-primary bg-primary/20 text-primary shadow-[0_0_12px_rgba(195,177,255,0.15)]'
                  : 'border-dark-gray text-offwhite hover:border-primary/50 hover:text-primary'
              }`}
            >
              {vibe}
            </button>
          ))}
        </div>
        {selectedVibes.length > 0 && (
          <p className="mt-3 text-xs text-offwhite/60">
            Selected: {selectedVibes.join(', ')}
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full rounded-full bg-primary py-3.5 text-center text-sm font-bold uppercase text-black transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {generating ? 'Generating...' : 'Generate Walk'}
      </button>

      {/* Loading Animation */}
      {generating && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="absolute inset-2 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <div className="absolute inset-4 rounded-full bg-primary/30" />
          </div>
          <p className="animate-pulse text-sm text-offwhite">
            Crafting your perfect walk...
          </p>
        </div>
      )}

      {/* Generated Walk Preview */}
      {generatedWalk && !generating && (
        <div className="space-y-6 rounded-xl border border-primary/30 bg-surface p-6">
          <div>
            <h2 className="font-display text-2xl text-white">{generatedWalk.title}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full border border-dark-gray px-3 py-1 text-xs text-offwhite">
                {generatedWalk.distance}
              </span>
              <span className="rounded-full border border-dark-gray px-3 py-1 text-xs text-offwhite">
                {generatedWalk.duration}
              </span>
              {generatedWalk.vibeTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Narrative */}
          <p className="font-body text-sm leading-relaxed text-offwhite">
            {generatedWalk.narrative}
          </p>

          {/* Stops List */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-offwhite">
              Stops ({generatedWalk.stops.length})
            </h3>
            <div className="mt-3 space-y-2.5">
              {generatedWalk.stops.map((stop, i) => (
                <div
                  key={stop.id}
                  className="flex items-start gap-3 rounded-lg border border-dark-gray bg-background p-3"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-black">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-body text-sm font-medium text-white">{stop.name}</h4>
                    <p className="mt-0.5 text-xs text-offwhite/80">{stop.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`/walk/${generatedWalk.id}`}
              className="flex-1 rounded-full bg-primary py-3 text-center text-sm font-bold uppercase text-black transition-opacity hover:opacity-90"
            >
              Start Walking
            </a>
            <button
              onClick={handleGenerate}
              className="flex-1 rounded-full border border-dark-gray py-3 text-center text-sm font-bold uppercase text-offwhite transition-colors hover:border-primary hover:text-primary"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
