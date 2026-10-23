import React from 'react';
import Link from 'next/link';
import { Discussion } from '@/types';
import { Icon } from '@/components/ui/icons';
import { formatShortAgo } from '@/lib/date-utils';

export function DiscussionRow({ discussion }: { discussion: Discussion }) {
  const repliesCount = discussion.replies?.length || 0;
  const isSolved = !!discussion.solution;

  return (
    <div className={`trow ${discussion.pinned ? 'pinned' : ''}`}>
      <span className="tt">
        <span
          className="sp-ic"
          style={{ '--c': discussion.category?.color || '#eb0f0f' } as React.CSSProperties}
        >
          <Icon name={discussion.category?.icon || 'globe'} />
        </span>
        <span className="tt-main">
          <Link href={`/discussions/${discussion.slug}`} className="hover:text-brand-text">
            <b>{discussion.title}</b>
          </Link>
          <span className="tt-meta">
            <small>
              {discussion.category?.name} · {discussion.author?.name || discussion.author?.username || 'Membre'}
            </small>
            {isSolved && (
              <span className="tag tag-ok">
                <Icon name="check" className="w-2.5 h-2.5" />
                Résolu
              </span>
            )}
          </span>
        </span>
      </span>

      <span className="c-num">
        {isSolved ? (
          <span className="ok">
            <Icon name="check" className="w-3.5 h-3.5" />
            {repliesCount}
          </span>
        ) : (
          <span className={repliesCount === 0 ? 'zero' : ''}>{repliesCount}</span>
        )}
      </span>

      <span className="c-num c-views hidden sm:inline-block">
        {discussion.views || 0}
      </span>

      <span className="c-num" title={`Publié il y a ${formatShortAgo(discussion.createdAt)}`}>
        {formatShortAgo(discussion.createdAt)}
      </span>
    </div>
  );
}
