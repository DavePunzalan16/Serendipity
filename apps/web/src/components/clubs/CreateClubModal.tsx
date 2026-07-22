'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';

/**
 * CreateClubModal — Form modal for creating a new club.
 * Fields: name, description, visibility (public/invite-only).
 */
export interface CreateClubModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: { name: string; description: string; visibility: 'public' | 'invite-only' }) => void;
  className?: string;
}

export default function CreateClubModal({
  open,
  onClose,
  onSubmit,
}: CreateClubModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'invite-only'>('public');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ name, description, visibility });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Create a Club">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1 block font-body text-xs font-medium text-offwhite/70">
            Club Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning Walkers"
            className="w-full rounded-lg border border-dark-gray/40 bg-background px-3 py-2 font-body text-sm text-white placeholder:text-offwhite/30 focus:border-primary focus:outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block font-body text-xs font-medium text-offwhite/70">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's your club about?"
            rows={3}
            className="w-full resize-none rounded-lg border border-dark-gray/40 bg-background px-3 py-2 font-body text-sm text-white placeholder:text-offwhite/30 focus:border-primary focus:outline-none"
            required
          />
        </div>

        {/* Visibility */}
        <div>
          <label className="mb-2 block font-body text-xs font-medium text-offwhite/70">
            Visibility
          </label>
          <div className="flex gap-3">
            {(['public', 'invite-only'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVisibility(v)}
                className={`rounded-full px-4 py-1.5 font-body text-xs font-medium transition-colors ${
                  visibility === v
                    ? 'bg-primary/20 text-primary'
                    : 'border border-dark-gray/40 text-offwhite/60 hover:text-offwhite'
                }`}
              >
                {v === 'public' ? '🌍 Public' : '🔒 Invite Only'}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-full bg-primary py-2.5 font-body text-sm font-bold uppercase text-background transition-colors hover:bg-primary-light"
        >
          Create Club
        </button>
      </form>
    </Modal>
  );
}
