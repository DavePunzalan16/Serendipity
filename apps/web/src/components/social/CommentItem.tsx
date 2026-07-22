import type { Comment } from '@wander/shared-types';
import Avatar from '../ui/Avatar';

/**
 * CommentItem — Single comment display with user avatar, name, and text.
 */
export interface CommentItemProps {
  comment: Comment;
  className?: string;
}

export default function CommentItem({ comment, className = '' }: CommentItemProps) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <Avatar
        src={comment.user.avatar_url}
        alt={comment.user.display_name || comment.user.username}
        size="sm"
      />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-body text-sm font-semibold text-white">
            {comment.user.display_name || `@${comment.user.username}`}
          </span>
          <span className="font-body text-xs text-offwhite/50">
            {new Date(comment.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        <p className="mt-1 font-body text-sm leading-relaxed text-offwhite/90">
          {comment.text}
        </p>
      </div>
    </div>
  );
}
