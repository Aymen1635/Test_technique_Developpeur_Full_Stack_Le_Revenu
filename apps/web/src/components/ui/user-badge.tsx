import React from 'react';
import { User } from '@/types';
import { Icon } from './icons';

export function getUserLevel(points = 0): string {
  if (points >= 750) return 'Pilier de la communauté';
  if (points >= 300) return 'Contributeur averti';
  if (points >= 100) return 'Contributeur';
  if (points >= 25) return 'Membre';
  return 'Nouveau venu';
}

export function UserBadges({ user, withLevel = true }: { user?: User; withLevel?: boolean }) {
  if (!user) return null;

  const isRedac = user.username === 'LaRedaction';

  if (isRedac) {
    return (
      <span className="tag tag-redac">
        <Icon name="check" />
        Rédaction
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      {user.is_pro && (
        <span className="tag tag-pro">
          <Icon name="check" />
          Expertise vérifiée
        </span>
      )}
      {user.is_subscriber && <span className="tag tag-sub">Abonné</span>}
      {withLevel && <span className="tag tag-level">{getUserLevel(user.points)}</span>}
    </span>
  );
}
