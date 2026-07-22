import Image from 'next/image';

/**
 * Avatar — Profile image with initials fallback.
 * Supports multiple sizes for different contexts.
 */
export interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap: Record<NonNullable<AvatarProps['size']>, { px: number; text: string }> = {
  sm: { px: 32, text: 'text-xs' },
  md: { px: 40, text: 'text-sm' },
  lg: { px: 56, text: 'text-lg' },
  xl: { px: 80, text: 'text-2xl' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const { px, text } = sizeMap[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        className={`rounded-full object-cover ${className}`}
        style={{ width: px, height: px }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary/20 font-body font-semibold text-primary ${text} ${className}`}
      style={{ width: px, height: px }}
      role="img"
      aria-label={alt}
    >
      {getInitials(alt)}
    </div>
  );
}
