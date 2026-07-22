'use client';

import Modal from '../ui/Modal';

/**
 * RecordBrokenModal — Celebration modal when a walk beats a personal record.
 * Shows animated confetti/stars effect, old vs new record comparison.
 */
export interface RecordBrokenModalProps {
  open: boolean;
  onClose: () => void;
  recordType: string;
  oldValue: string;
  newValue: string;
  className?: string;
}

export default function RecordBrokenModal({
  open,
  onClose,
  recordType,
  oldValue,
  newValue,
}: RecordBrokenModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="🎉 New Personal Record!">
      <div className="text-center">
        {/* Confetti animation via CSS keyframes */}
        <div className="relative mb-4 overflow-hidden rounded-lg bg-background/50 py-8">
          {/* Animated stars */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute animate-pulse text-primary opacity-60"
                style={{
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 90 + 5}%`,
                  animationDelay: `${i * 0.15}s`,
                  fontSize: `${Math.random() * 12 + 10}px`,
                }}
              >
                ✦
              </span>
            ))}
          </div>

          <p className="relative font-body text-sm font-medium uppercase tracking-wide text-offwhite/70">
            {recordType}
          </p>

          {/* Old vs New */}
          <div className="relative mt-4 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="font-body text-xs text-offwhite/50">Previous</p>
              <p className="font-body text-lg font-semibold text-offwhite/40 line-through">
                {oldValue}
              </p>
            </div>

            <span className="text-2xl text-primary">→</span>

            <div className="text-center">
              <p className="font-body text-xs text-primary">New Record</p>
              <p className="font-body text-2xl font-bold text-gradient">
                {newValue}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-2 rounded-full bg-primary px-6 py-2 font-body text-sm font-bold uppercase text-background transition-colors hover:bg-primary-light"
        >
          Awesome!
        </button>
      </div>
    </Modal>
  );
}
