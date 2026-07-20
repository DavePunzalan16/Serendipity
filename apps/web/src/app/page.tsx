"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: "/assets/CompassIcon.jpg",
    title: "Discover Routes",
    description: "AI-curated walks tailored to your mood, pace, and surroundings.",
  },
  {
    icon: "/assets/MapIcon.jpg",
    title: "Smart Maps",
    description: "Dynamic routes that adapt in real-time to your preferences.",
  },
  {
    icon: "/assets/CommunityIcon.jpg",
    title: "Walk Together",
    description: "Share discoveries and explore with friends in real time.",
  },
  {
    icon: "/assets/HeartRateIcon.jpg",
    title: "Track Activity",
    description: "Monitor your steps, distance, and wellness as you wander.",
  },
];

const steps = [
  {
    number: "01",
    icon: "/assets/SonicWalkIcon.jpg",
    title: "Choose Your Vibe",
    description: "Select a mood — relaxing, adventurous, social, or focused.",
  },
  {
    number: "02",
    icon: "/assets/StrideIcon.jpg",
    title: "Generate a Walk",
    description: "Our AI crafts a unique route based on your location and preferences.",
  },
  {
    number: "03",
    icon: "/assets/LoopIcon.jpg",
    title: "Share with Friends",
    description: "Invite others to join your walk or share your favorite routes.",
  },
];

export default function LandingPage() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  // Disable all motion if user prefers reduced motion
  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-100px" },
        variants: fadeUp,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center px-6 md:px-16 lg:px-[108px]"
      >
        {/* Parallax background image */}
        <motion.div
          className="absolute inset-0 z-0"
          style={prefersReducedMotion ? {} : { y: heroY, opacity: heroOpacity }}
        >
          <Image
            src="/img/WandererCover.png"
            alt="Wander app scenic walking route"
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </motion.div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={prefersReducedMotion ? undefined : "visible"}
          variants={stagger}
        >
          <motion.div variants={prefersReducedMotion ? undefined : fadeUp}>
            <Image
              src="/img/WandererIcon.png"
              alt="Wander app logo"
              width={80}
              height={80}
              priority
              className="mb-6 rounded-2xl"
            />
          </motion.div>

          <motion.h1
            variants={prefersReducedMotion ? undefined : fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl leading-[0.9] text-white md:text-8xl lg:text-[101px]"
          >
            Every Step is a<br />
            <span className="text-primary">Discovery</span>
          </motion.h1>

          <motion.p
            variants={prefersReducedMotion ? undefined : fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-lg font-body text-lg text-offwhite md:text-xl"
          >
            AI-curated walking routes with a social layer. Generate walks,
            share discoveries, and explore with friends.
          </motion.p>

          <motion.div
            variants={prefersReducedMotion ? undefined : fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-body text-base font-bold uppercase text-black transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Start Walking
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-primary/40 px-8 py-4 font-body text-base font-bold uppercase text-primary transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Explore Walks
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C3B1FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        aria-label="Features"
        className="relative px-6 py-20 md:px-16 md:py-32 lg:px-[108px]"
      >
        <motion.div
          className="mx-auto max-w-[1224px]"
          {...(prefersReducedMotion ? {} : { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-100px" }, variants: stagger })}
        >
          <motion.h2
            {...motionProps}
            className="text-center font-display text-5xl text-white md:text-7xl lg:text-[76px]"
          >
            Walk Smarter
          </motion.h2>
          <motion.p
            {...motionProps}
            className="mx-auto mt-4 max-w-md text-center font-body text-lg text-offwhite"
          >
            Everything you need for the perfect walk, powered by AI.
          </motion.p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.article
                key={feature.title}
                {...motionProps}
                transition={{
                  duration: 0.5,
                  delay: prefersReducedMotion ? 0 : i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group rounded-2xl border border-dark-gray/50 bg-surface/60 p-6 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-surface"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-icon-bg">
                  <Image
                    src={feature.icon}
                    alt=""
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-body text-xl font-medium text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 font-body text-base text-offwhite">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        aria-label="How it works"
        className="relative px-6 py-20 md:px-16 md:py-32 lg:px-[108px]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
        <motion.div
          className="relative mx-auto max-w-[1224px]"
          {...(prefersReducedMotion ? {} : { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-100px" }, variants: stagger })}
        >
          <motion.h2
            {...motionProps}
            className="text-center font-display text-5xl text-white md:text-7xl lg:text-[76px]"
          >
            How It Works
          </motion.h2>
          <motion.p
            {...motionProps}
            className="mx-auto mt-4 max-w-md text-center font-body text-lg text-offwhite"
          >
            Three simple steps to your next adventure.
          </motion.p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                {...motionProps}
                transition={{
                  duration: 0.6,
                  delay: prefersReducedMotion ? 0 : i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Connector line between steps (desktop) */}
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-12 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-primary/40 to-transparent md:block" />
                )}

                <div className="relative mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-dark-gray/50 bg-surface">
                  <Image
                    src={step.icon}
                    alt=""
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary font-body text-xs font-bold text-black">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-body text-xl font-medium text-white">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs font-body text-base text-offwhite">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer CTA Section */}
      <section
        aria-label="Join Wander"
        className="relative px-6 py-20 md:px-16 md:py-32 lg:px-[108px]"
      >
        <motion.div
          className="mx-auto max-w-[1224px] overflow-hidden rounded-3xl border border-dark-gray/30 bg-surface/80 p-10 text-center backdrop-blur-sm md:p-16"
          {...motionProps}
        >
          <Image
            src="/img/WandererIcon.png"
            alt="Wander logo"
            width={56}
            height={56}
            className="mx-auto mb-6 rounded-xl"
          />
          <h2 className="font-display text-4xl text-white md:text-6xl lg:text-[76px]">
            Join Wander Today
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-lg text-offwhite">
            Start exploring your neighborhood in a whole new way. Every walk is
            unique, every step a story.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-10 py-4 font-body text-base font-bold uppercase text-black transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Get Started Free
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-primary/40 px-10 py-4 font-body text-base font-bold uppercase text-primary transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mx-auto mt-16 max-w-[1224px] border-t border-dark-gray/50 pt-8 text-center">
          <p className="font-body text-sm text-offwhite/60">
            © {new Date().getFullYear()} Wander. All rights reserved.
          </p>
        </footer>
      </section>
    </main>
  );
}
