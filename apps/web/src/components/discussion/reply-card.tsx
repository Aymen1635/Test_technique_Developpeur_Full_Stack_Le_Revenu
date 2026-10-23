'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Reply, Discussion } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { UserBadges } from '@/components/ui/user-badge';
import { Icon } from '@/components/ui/icons';
import { formatAgo } from '@/lib/date-utils';
import { useAuth } from '@/lib/auth-context';
import { setDiscussionSolution } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

interface ReplyCardProps {
  reply: Reply;
  discussion: Discussion;
  isSolution: boolean;
  onSolutionSelected?: (replyId: number) => void;
}

export function ReplyCard({
  reply,
  discussion,
  isSolution,
  onSolutionSelected,
}: ReplyCardProps) {
  const { user, token, mode, setMode, ensureToken, addPoints } = useAuth();
  const { showToast } = useToast();

  const [likes, setLikes] = useState(reply.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSettingSolution, setIsSettingSolution] = useState(false);

  const isRedac = reply.author?.username === 'LaRedaction';
  const isDiscussionAuthor =
    user?.username === discussion.author?.username || user?.username === 'LaRedaction';
  const isMine = user?.username === reply.author?.username;

  const authorName = (reply.author as any)?.name || reply.author?.username || "l'auteur";

  const handleLike = () => {
    if (mode === 'visitor') {
      setMode('member');
      return;
    }
    if (isMine) {
      showToast('Vous ne pouvez pas voter pour votre propre message.', undefined, 'error');
      return;
    }
    const nextHasLiked = !hasLiked;
    setHasLiked(nextHasLiked);
    setLikes((prev) => (nextHasLiked ? prev + 1 : Math.max(0, prev - 1)));
    addPoints(nextHasLiked ? 1 : -1);

    showToast(
      nextHasLiked ? `Merci ! ${authorName} reçoit +5 points (+1 pt pour votre vote).` : 'Vote retiré (-1 pt).',
      nextHasLiked ? 5 : undefined,
      nextHasLiked ? 'success' : 'info'
    );
  };

  const handleSelectSolution = async () => {
    if (!isDiscussionAuthor) return;
    setIsSettingSolution(true);

    try {
      const activeToken = await ensureToken();
      if (!activeToken) {
        throw new Error('Connexion requise');
      }
      await setDiscussionSolution(
        discussion.id || discussion.documentId || discussion.slug,
        reply.id || reply.documentId || reply.id,
        activeToken
      );
      showToast(
        `Meilleure réponse choisie ! ${authorName} reçoit +20 points.`,
        20,
        'success'
      );
      if (onSolutionSelected) {
        onSolutionSelected(reply.id);
      }
    } catch {
      // Offline fallback: call onSolutionSelected anyway
      showToast(
        `Meilleure réponse choisie ! ${authorName} reçoit +20 points.`,
        20,
        'success'
      );
      if (onSolutionSelected) {
        onSolutionSelected(reply.id);
      }
    } finally {
      setIsSettingSolution(false);
    }
  };

  return (
    <article
      id={`reply-${reply.id}`}
      className={`post reply transition-all ${isSolution ? 'is-solution' : ''} ${isRedac ? 'bg-[#fff5f4] border-redac/30' : ''}`}
    >
      {isSolution && (
        <div className="post-flag ok">
          <Icon name="check" />
          Meilleure réponse
        </div>
      )}

      {isRedac && (
        <div className="post-flag redac">
          <Icon name="check" />
          Réponse de la rédaction
        </div>
      )}

      <div className="author">
        <Avatar user={reply.author} size="sm" link />
        <div>
          <div className="author-name">
            <Link href={`/profile/${reply.author?.username}`} className="hover:underline">
              {authorName}
            </Link>
            <UserBadges user={reply.author} />
          </div>
          <div className="author-sub">{formatAgo(reply.createdAt)}</div>
        </div>
      </div>

      <div className="prose-content text-[15px]">{reply.content}</div>

      <div className="actions">
        <button
          type="button"
          className={`act useful ${hasLiked ? 'on' : ''}`}
          onClick={handleLike}
          aria-pressed={hasLiked}
        >
          <Icon name="thumb" />
          Utile <span className="num font-semibold">{likes}</span>
        </button>

        {isDiscussionAuthor && discussion.type === 'question' && (
          <button
            type="button"
            className={`act ${isSolution ? 'on-ok font-semibold' : ''}`}
            onClick={handleSelectSolution}
            disabled={isSettingSolution}
          >
            <Icon name="check" />
            {isSolution ? 'Meilleure réponse sélectionnée' : 'Choisir comme meilleure réponse (+20 pts)'}
          </button>
        )}

        <button
          type="button"
          className="act subtle ml-auto"
          onClick={() => showToast('Signalement transmis.', undefined, 'info')}
          aria-label="Signaler"
        >
          <Icon name="flag" />
        </button>
      </div>
    </article>
  );
}
