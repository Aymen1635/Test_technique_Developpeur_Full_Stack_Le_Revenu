'use client';

import React from 'react';
import Link from 'next/link';
import { Discussion } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { UserBadges } from '@/components/ui/user-badge';
import { Icon } from '@/components/ui/icons';
import { formatAgo } from '@/lib/date-utils';

export function DiscussionCard({ discussion }: { discussion: Discussion }) {
  const repliesCount = discussion.replies?.length || 0;
  const isSolved = !!discussion.solution;
  const isPoll = discussion.type === 'poll';
  const totalVotes = isPoll && discussion.poll_options
    ? discussion.poll_options.reduce((acc, opt) => acc + opt.votes, 0)
    : 0;

  let countBox;
  if (isPoll) {
    countBox = (
      <div className="tcount poll">
        <b className="num">{totalVotes}</b>
        <span>votes</span>
      </div>
    );
  } else if (isSolved) {
    countBox = (
      <div className="tcount solved">
        <b className="num">
          <Icon name="check" className="w-3.5 h-3.5 mr-0.5" />
          {repliesCount}
        </b>
        <span>réponse{repliesCount > 1 ? 's' : ''}</span>
      </div>
    );
  } else {
    countBox = (
      <div className={`tcount ${repliesCount === 0 ? 'zero' : ''}`}>
        <b className="num">{repliesCount}</b>
        <span>réponse{repliesCount > 1 ? 's' : ''}</span>
      </div>
    );
  }

  return (
    <article className={`tcard ${discussion.pinned ? 'pinned' : ''}`}>
      <div>{countBox}</div>

      <div>
        <div className="tmeta">
          {discussion.category && (
            <Link href={`/spaces/${discussion.category.slug}`} className="cat-tag">
              {discussion.category.name}
            </Link>
          )}

          {discussion.type === 'question' && (
            isSolved ? (
              <span className="tag tag-ok">
                <Icon name="check" />
                Résolu
              </span>
            ) : (
              <span className="tag tag-q">Question</span>
            )
          )}

          {discussion.type === 'poll' && (
            <span className="tag bg-brand-soft text-brand-text font-semibold">
              <Icon name="chart" />
              Sondage
            </span>
          )}

          {discussion.pinned && (
            <span className="tag tag-pin">
              <Icon name="pin" />
              Épinglé
            </span>
          )}
        </div>

        <h3 className="ttitle">
          <Link href={`/discussions/${discussion.slug}`}>
            {discussion.title}
          </Link>
        </h3>

        <p className="texcerpt">{discussion.content}</p>

        <div className="tfoot">
          <span className="byline">
            <Avatar user={discussion.author} size="xs" />
            <b className="hover:underline">
              {discussion.author?.name || discussion.author?.username || 'Membre'}
            </b>
            <UserBadges user={discussion.author} withLevel={false} />
            <span>· {formatAgo(discussion.createdAt)}</span>
          </span>

          <span className="tstats">
            <span title="Utile">
              <Icon name="thumb" />
              <span className="num">{discussion.likes || 0}</span>
            </span>
            <span className="views hidden sm:inline-flex" title="Vues">
              <Icon name="eye" />
              <span className="num">{discussion.views || 0}</span>
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
