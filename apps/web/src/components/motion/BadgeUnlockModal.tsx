'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import type { Badge } from '@wander/shared-types';
import Button from '../ui/Button';

/**
 * BadgeUnlockModal — Celebration modal for newly unlocked badges.
 * Shows badge with animation effects and congrats message.
 */
export interface BadgeUnlockModalProps {
  badge: Badge | null;
  open: boolean;
  onClose: () => void;
}

export default function BadgeUnlockModal({ badge, open, onClose }: BadgeUnlockModalProps) {
  if (!badge) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6 rounded-2xl border border-primary/30 bg-surface p-8 text-center shadow-xl"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-primary/50"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Badge image */}
            <motion.div
              className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary shadow-lg shadow-primary/30"
              initial={{ rotateY: 180, scale: 0 }}
              animate={{ rotateY: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <Image
                src={badge.icon_url}
                alt={badge.name}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Text */}
            <div>
              <p className="font-body text-sm font-medium text-primary uppercase tracking-wide">
                Badge Unlocked!
              </p>
              <h3 className="mt-2 font-body text-xl font-bold text-white">{badge.name}</h3>
              <p className="mt-2 max-w-xs font-body text-sm text-offwhite/70">
                {badge.description}
              </p>
            </div>

            <Button onClick={onClose} size="sm">
              Awesome!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
