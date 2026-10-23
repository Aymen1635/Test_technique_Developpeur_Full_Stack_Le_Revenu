import React from 'react';
import Link from 'next/link';
import { User } from '@/types';

interface AvatarProps {
  user?: User | { username: string; name?: string; role_title?: string; avatar_color?: string };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  link?: boolean;
}

export function Avatar({ user, size = 'sm', link = false }: AvatarProps) {
  if (!user) {
    return (
      <span className={`av av-${size}`} style={{ '--c': 'var(--ink-3)' } as React.CSSProperties}>
        ?
      </span>
    );
  }

  const isRedac = user.username === 'LaRedaction';
  const isPro = (user as User).is_pro;
  const displayName =
    (user as any).name ||
    (user.username === 'LaRedaction'
      ? 'La Rédaction'
      : user.username
      ? user.username.replace(/_/g, ' ')
      : 'Membre');

  const initials = isRedac
    ? 'R'
    : displayName
        .split(/\s+/)
        .map((w: string) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

  const color = user.avatar_color || 'var(--av-1)';

  const avatarEl = (
    <span
      className={`av av-${size} ${isRedac ? 'redac' : ''} ${isPro ? 'pro' : ''}`}
      style={{ '--c': color } as React.CSSProperties}
      title={displayName}
    >
      {size === 'xs' ? initials[0] : initials}
    </span>
  );

  if (link && user.username) {
    return <Link href={`/profile/${user.username}`}>{avatarEl}</Link>;
  }

  return avatarEl;
}
