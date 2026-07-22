'use client';

import type { Comment } from '@wander/shared-types';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

/**
 * CommentThread — Comment list with form for posting new comments.
 */
export interface CommentThreadProps {
  comments: Comment[];
  onSubmitComment: (text: string) => Promise<void>;
  className?: string;
}

export default function CommentThread({
  comments,
  onSubmitComment,
  className = '',
}: CommentThreadProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Comment list */}
      {comments.length > 0 ? (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <p className="py-4 text-center font-body text-sm text-offwhite/50">
          No comments yet. Be the first!
        </p>
      )}

      {/* Comment form */}
      <CommentForm onSubmit={onSubmitComment} />
    </div>
  );
}
