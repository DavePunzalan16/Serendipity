'use client';

import { useState, type FormEvent } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Avatar from '../ui/Avatar';
import Card from '../ui/Card';

/**
 * AccountSettings — Profile and account management form.
 */
export interface AccountSettingsProps {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string | null;
  onSave: (data: { displayName: string; username: string; bio: string }) => Promise<void>;
  className?: string;
}

export default function AccountSettings({
  displayName: initialName,
  username: initialUsername,
  bio: initialBio,
  avatarUrl,
  onSave,
  className = '',
}: AccountSettingsProps) {
  const [displayName, setDisplayName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState(initialBio);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ displayName, username, bio });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <h2 className="font-body text-lg font-semibold text-white">Account</h2>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar src={avatarUrl} alt={displayName} size="lg" />
            <Button variant="secondary" size="sm" type="button">
              Change Photo
            </Button>
          </div>

          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Bio textarea */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="bio"
              className="font-body text-sm font-medium text-offwhite"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              className="rounded-sm border border-dark-gray/50 bg-surface px-4 py-3 font-body text-base text-white placeholder:text-offwhite/40 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="Tell others about yourself..."
            />
            <span className="font-body text-xs text-offwhite/40 text-right">
              {bio.length}/200
            </span>
          </div>

          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
