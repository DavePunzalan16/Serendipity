'use client';

import type { Badge } from '@wander/shared-types';
import Image from 'next/image';
import Modal from '../ui/Modal';

/**
 * BadgeDetailModal — Modal displaying detailed badge information.
 */
export interface BadgeDetailModalProps {
  badge: Badge | null;
  open: boolean;
  onClose: () => void;
}

export default function BadgeDetailModal({ badge, open, onClose }: BadgeDetailModalProps) {
  if (!badge) return null;

  return (
    <Modal open={open} onClose={onClose} title="Badge Details">
      <div className="flex flex-col items-center gap-4 py-4">
        {/* Badge icon */}
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-primary/30 shadow-lg shadow-primary/10">
          <Image
            src={badge.icon_url}
            alt={badge.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Badge info */}
        <div className="text-center">
          <h3 className="font-body text-lg font-semibold text-white">{badge.name}</h3>
          <p className="mt-2 font-body text-sm text-offwhite/70">{badge.description}</p>
          <p className="mt-3 font-body text-xs text-primary/70">
            Earned{' '}
            {new Date(badge.earned_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </Modal>
  );
}
