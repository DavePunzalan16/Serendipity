import Image from "next/image";
import Navbar from "@/components/layout/Navbar";

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
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        {/* Hero Section */}
        <section
          className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 md:px-16 lg:px-[108px]"
          aria-label="Hero"
        >
          {/* Background image */}
          <div className="absolute inset-0 z-0">
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
          </div>

          {/* Hero content */}
          <div className="relative z-10 flex flex-col items-center text-center animate-fade-in-up">
            <Image
              src="/img/WandererIcon.png"
              alt="Wander app logo"
              width={80}
              height={80}
              priority
              className="mb-6 rounded-2xl"
            />

            <h1 className="font-display text-6xl leading-[0.9] text-white md:text-8xl lg:text-[101px]">
              Every Step is a<br />
              <span className="text-primary">Discovery</span>
            </h1>

            <p className="mt-6 max-w-lg font-body text-lg text-offwhite md:text-xl">
              AI-curated walking routes with a social layer. Generate walks,
              share discoveries, and explore with friends.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
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
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          aria-label="Features"
          className="relative px-6 py-20 md:px-16 md:py-32 lg:px-[108px]"
        >
          <div className="mx-auto max-w-[1224px]">
            <h2 className="text-center font-display text-5xl text-white md:text-7xl lg:text-[76px] animate-fade-in-up">
              Walk Smarter
            </h2>
            <p className="mx-auto mt-4 max-w-md text-center font-body text-lg text-offwhite animate-fade-in-up [animation-delay:100ms]">
              Everything you need for the perfect walk, powered by AI.
            </p>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-dark-gray/50 bg-surface/60 p-6 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-surface animate-fade-in-up"
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
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
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          aria-label="How it works"
          className="relative px-6 py-20 md:px-16 md:py-32 lg:px-[108px]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
          <div className="relative mx-auto max-w-[1224px]">
            <h2 className="text-center font-display text-5xl text-white md:text-7xl lg:text-[76px] animate-fade-in-up">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-md text-center font-body text-lg text-offwhite animate-fade-in-up [animation-delay:100ms]">
              Three simple steps to your next adventure.
            </p>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="relative flex flex-col items-center text-center animate-fade-in-up"
                  style={{ animationDelay: `${(i + 1) * 150}ms` }}
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA Section */}
        <section
          aria-label="Join Wander"
          className="relative px-6 py-20 md:px-16 md:py-32 lg:px-[108px]"
        >
          <div className="mx-auto max-w-[1224px] overflow-hidden rounded-3xl border border-dark-gray/30 bg-surface/80 p-10 text-center backdrop-blur-sm md:p-16 animate-fade-in-up">
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
          </div>

          {/* Footer */}
          <footer className="mx-auto mt-16 max-w-[1224px] border-t border-dark-gray/50 pt-8 text-center">
            <p className="font-body text-sm text-offwhite/60">
              © {new Date().getFullYear()} Wander. All rights reserved.
            </p>
          </footer>
        </section>
      </main>
    </>
  );
}
