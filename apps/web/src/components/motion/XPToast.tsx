'use client';

import { AnimatePresence, motion } from 'framer-motion';

/**
 * XPToast — Animated "+XP" notification that floats up and fades.
 */
export interface XPToastProps {
  amount: number;
  isVisible: boolean;
  label?: string;
}

export default function XPToast({ amount, isVisible, label }: XPToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-none fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-surface px-4 py-2 shadow-lg shadow-primary/10">
            <motion.span
              className="font-body text-lg font-bold text-primary"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              +{amount} XP
            </motion.span>
            {label && (
              <span className="font-body text-xs text-offwhite/70">{label}</span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
