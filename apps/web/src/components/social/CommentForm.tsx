'use client';

import { useState, type FormEvent } from 'react';
import Button from '../ui/Button';

/**
 * CommentForm — Text input with submit button for posting comments.
 */
export interface CommentFormProps {
  onSubmit: (text: string) => Promise<void>;
  placeholder?: string;
  className?: string;
}

export default function CommentForm({
  onSubmit,
  placeholder = 'Add a comment...',
  className = '',
}: CommentFormProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      await onSubmit(text.trim());
      setText('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-full border border-dark-gray/50 bg-surface px-4 py-2 font-body text-sm text-white placeholder:text-offwhite/40 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        aria-label="Comment text"
      />
      <Button
        type="submit"
        size="sm"
        loading={loading}
        disabled={!text.trim()}
      >
        Post
      </Button>
    </form>
  );
}
