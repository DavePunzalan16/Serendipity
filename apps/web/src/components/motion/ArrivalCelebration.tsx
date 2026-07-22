'use client';

import { AnimatePresence, motion } from 'framer-motion';

/**
 * ArrivalCelebration — CSS keyframe celebration animation for stop arrivals.
 * Shows confetti-like particles and a checkmark when triggered.
 */
export interface ArrivalCelebrationProps {
  isActive: boolean;
  stopName?: string;
}

export default function ArrivalCelebration({ isActive, stopName }: ArrivalCelebrationProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Radial glow */}
          <motion.div
            className="absolute h-64 w-64 rounded-full bg-primary/20 blur-3xl"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Checkmark */}
          <motion.div
            className="relative flex flex-col items-center gap-4"
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
              <svg className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {stopName && (
              <motion.p
                className="font-body text-lg font-semibold text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Arrived at {stopName}!
              </motion.p>
            )}
          </motion.div>

          {/* Confetti particles */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const distance = 60 + Math.random() * 40;
            return (
              <motion.div
                key={i}
                className="absolute h-3 w-3 rounded-full"
                style={{
                  backgroundColor: i % 3 === 0 ? '#C3B1FF' : i % 3 === 1 ? '#FFD700' : '#FF6B6B',
                }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
