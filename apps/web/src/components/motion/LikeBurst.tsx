'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface LikeBurstProps {
  isActive: boolean;
}

const particles = Array.from({ length: 6 }, (_, i) => {
  const angle = (i * 60) * (Math.PI / 180);
  return {
    id: i,
    x: Math.cos(angle) * 20,
    y: Math.sin(angle) * 20,
  };
});

export default function LikeBurst({ isActive }: LikeBurstProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Center heart scale-up */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute h-8 w-8 fill-red-500"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1.4, 1], opacity: [1, 1, 0] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </motion.svg>

          {/* Burst particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute h-2 w-2 rounded-full bg-red-400"
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
