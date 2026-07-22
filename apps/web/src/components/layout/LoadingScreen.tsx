"use client";

import Image from "next/image";

export interface LoadingScreenProps {
  loading: boolean;
}

export default function LoadingScreen({ loading }: LoadingScreenProps) {
  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gradient-dark ${
        !loading ? "animate-fade-out" : ""
      }`}
      role="status"
      aria-label="Loading"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[100px]" />
      </div>

      {/* 3D Spinning Logo */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="animate-spin-3d animate-pulse-glow rounded-2xl p-1">
          <Image
            src="/img/WandererIcon.png"
            alt="Wander logo"
            width={96}
            height={96}
            priority
            className="rounded-2xl"
          />
        </div>

        {/* Wander text with gradient */}
        <h1 className="mt-8 font-display text-5xl text-gradient md:text-6xl">
          Wander
        </h1>

        {/* Animated loading dots */}
        <div className="mt-6 flex items-center gap-1">
          <span className="font-body text-sm text-offwhite/70">Loading</span>
          <span className="flex gap-0.5 ml-1">
            <span className="loading-dot inline-block h-1 w-1 rounded-full bg-primary" />
            <span className="loading-dot inline-block h-1 w-1 rounded-full bg-primary" />
            <span className="loading-dot inline-block h-1 w-1 rounded-full bg-primary" />
          </span>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-16 left-1/2 h-px w-32 -translate-x-1/2 gradient-green opacity-40" />
    </div>
  );
}
