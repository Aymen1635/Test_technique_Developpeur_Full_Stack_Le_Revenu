'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Discussion } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { UserBadges } from '@/components/ui/user-badge';
import { Icon } from '@/components/ui/icons';
import { formatAgo } from '@/lib/date-utils';
import { useAuth } from '@/lib/auth-context';
import { likeDiscussion, votePoll } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

export function DiscussionHeader({ discussion }: { discussion: Discussion }) {
  const { user, token, mode, setMode, ensureToken, addPoints } = useAuth();
  const { showToast } = useToast();

  const [likes, setLikes] = useState(discussion.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  const [pollOptions, setPollOptions] = useState(discussion.poll_options || []);
  const [votedOption, setVotedOption] = useState<number | null>(null);
  const [isVotingPoll, setIsVotingPoll] = useState(false);

  const pollKey = discussion.id || discussion.documentId || discussion.slug;
  const currentUsername = user?.username;

  // Sync pollOptions when discussion updates
  useEffect(() => {
    if (discussion.poll_options && Array.isArray(discussion.poll_options)) {
      setPollOptions(discussion.poll_options);
    }
  }, [discussion.poll_options]);

  // Load user-specific poll vote state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clean up legacy unscoped key so it doesn't block other users
      try {
        localStorage.removeItem(`lr_poll_${pollKey}`);
      } catch {}

      if (currentUsername) {
        const saved = localStorage.getItem(`lr_poll_${currentUsername}_${pollKey}`);
        if (saved !== null && saved !== '') {
          setVotedOption(Number(saved));
        } else {
          setVotedOption(null);
        }
      } else {
        setVotedOption(null);
      }
    }
  }, [currentUsername, pollKey]);

  // Load user-specific like state
  useEffect(() => {
    if (typeof window !== 'undefined' && currentUsername) {
      const savedLike = localStorage.getItem(`lr_liked_${currentUsername}_${pollKey}`);
      setHasLiked(savedLike === 'true');
    } else {
      setHasLiked(false);
    }
  }, [currentUsername, pollKey]);

  const handleVotePoll = async (idx: number) => {
    if (votedOption !== null || isVotingPoll) return;

    if (mode === 'visitor') {
      setMode('member');
    }

    setIsVotingPoll(true);
    const updated = pollOptions.map((opt, i) =>
      i === idx ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
    );
    setPollOptions(updated);
    setVotedOption(idx);
    addPoints(1);

    const voterUsername = user?.username || 'member';
    if (typeof window !== 'undefined') {
      localStorage.setItem(`lr_poll_${voterUsername}_${pollKey}`, String(idx));
    }

    showToast('Votre vote a été pris en compte ! (+1 point)', 3, 'success');

    try {
      const activeToken = await ensureToken();
      if (activeToken) {
        const res = await votePoll(pollKey, idx, activeToken);
        if (res && Array.isArray(res.poll_options)) {
          setPollOptions(res.poll_options);
        }
      }
    } catch {
      // optimistic update retained
    } finally {
      setIsVotingPoll(false);
    }
  };

  const handleLike = async () => {
    if (mode === 'visitor') {
      setMode('member');
      return;
    }

    if (user?.username === discussion.author?.username) {
      showToast('Vous ne pouvez pas voter pour votre propre message.', undefined, 'error');
      return;
    }

    const nextHasLiked = !hasLiked;
    setHasLiked(nextHasLiked);
    setLikes((prev) => (nextHasLiked ? prev + 1 : Math.max(0, prev - 1)));
    addPoints(nextHasLiked ? 1 : -1);

    if (typeof window !== 'undefined' && currentUsername) {
      if (nextHasLiked) {
        localStorage.setItem(`lr_liked_${currentUsername}_${pollKey}`, 'true');
      } else {
        localStorage.removeItem(`lr_liked_${currentUsername}_${pollKey}`);
      }
    }

    const authorName = (discussion.author as any)?.name || discussion.author?.username || "l'auteur";
    showToast(
      nextHasLiked
        ? `Merci ! ${authorName} reçoit +5 points (+1 pt pour votre vote).`
        : 'Vote retiré (-1 pt).',
      nextHasLiked ? 5 : undefined,
      nextHasLiked ? 'success' : 'info'
    );

    setIsLiking(true);

    try {
      const activeToken = await ensureToken();
      if (activeToken) {
        await likeDiscussion(
          discussion.id || discussion.documentId || discussion.slug,
          activeToken,
          nextHasLiked ? 'like' : 'unlike'
        );
      }
    } catch {
      // keep optimistic like
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Lien copié dans le presse-papier !', undefined, 'info');
    }
  };

  const handleFollow = () => {
    if (mode === 'visitor') {
      setMode('member');
      return;
    }
    setIsFollowed(!isFollowed);
    showToast(
      isFollowed ? 'Vous ne suivez plus cette discussion.' : 'Discussion suivie ! Vous recevrez des notifications.',
      undefined,
      'info'
    );
  };

  return (
    <article className="post post-main">
      <div className="tmeta">
        {discussion.category && (
          <Link href={`/spaces/${discussion.category.slug}`} className="cat-tag">
            {discussion.category.name}
          </Link>
        )}

        {discussion.type === 'question' && (
          discussion.solution ? (
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

      <h1>{discussion.title}</h1>

      <div className="author">
        <Avatar user={discussion.author} size="md" link />
        <div>
          <div className="author-name">
            <Link href={`/profile/${discussion.author?.username}`} className="hover:underline">
              {(discussion.author as any)?.name || discussion.author?.username}
            </Link>
            <UserBadges user={discussion.author} />
          </div>
          <div className="author-sub">
            {formatAgo(discussion.createdAt)} · <span className="num">{discussion.views || 0}</span> vues
          </div>
        </div>
      </div>

      <div className="prose-content">{discussion.content}</div>

      {pollOptions && pollOptions.length > 0 && (
        <div className="mt-5 p-5 bg-surface-2 rounded-xl flex flex-col gap-3 max-w-lg border border-line">
          <div className="flex justify-between items-center mb-1">
            <b className="text-sm font-semibold flex items-center gap-1.5">
              <Icon name="chart" className="w-4 h-4 text-brand-text" />
              Sondage de la communauté
            </b>
            <span className="text-xs text-ink-3">
              {pollOptions.reduce((acc, o) => acc + (o.votes || 0), 0)} votes
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {pollOptions.map((opt, idx) => {
              const totalVotes = pollOptions.reduce((acc, o) => acc + (o.votes || 0), 0);
              const pct = totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0;
              const isSelected = votedOption === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleVotePoll(idx)}
                  disabled={votedOption !== null || isVotingPoll}
                  className={`relative overflow-hidden text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-brand/40 bg-brand-soft/30 font-medium'
                      : votedOption !== null
                      ? 'border-line bg-surface opacity-90'
                      : 'border-line bg-surface hover:border-brand/50 hover:bg-surface-2 cursor-pointer'
                  }`}
                >
                  {/* Progress bar background */}
                  {votedOption !== null && (
                    <div
                      className={`absolute top-0 bottom-0 left-0 ${isSelected ? 'bg-brand/15' : 'bg-black/5'} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  )}

                  <div className="relative flex justify-between items-center text-sm gap-2">
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-none ${
                          isSelected ? 'border-brand-text bg-brand-text text-white' : 'border-ink-3'
                        }`}
                      >
                        {isSelected && <Icon name="check" className="w-2.5 h-2.5 text-white" />}
                      </span>
                      <span>{opt.label}</span>
                    </span>

                    {votedOption !== null ? (
                      <span className="flex items-center gap-2 flex-none">
                        <span className="text-xs text-ink-3">({opt.votes || 0})</span>
                        <b className="num text-xs font-bold">{pct}%</b>
                      </span>
                    ) : (
                      <span className="text-xs text-ink-3 font-normal">Voter</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {votedOption === null && (
            <small className="text-xs text-ink-3 text-center mt-1">
              Cliquez sur une option pour voter (+1 pt)
            </small>
          )}
        </div>
      )}

      <div className="actions">
        <button
          type="button"
          className={`act useful ${hasLiked ? 'on' : ''}`}
          onClick={handleLike}
          disabled={isLiking}
          aria-pressed={hasLiked}
        >
          <Icon name="thumb" />
          Utile <span className="num font-semibold">{likes}</span>
        </button>

        <button
          type="button"
          className={`act ${isFollowed ? 'text-brand-text font-semibold' : ''}`}
          onClick={handleFollow}
        >
          <Icon name="bell" />
          {isFollowed ? 'Suivie' : 'Suivre'}
        </button>

        <button
          type="button"
          className="act"
          onClick={handleShare}
        >
          <Icon name="link" />
          Copier le lien
        </button>

        <button
          type="button"
          className="act ml-auto text-ink-3"
          onClick={() => showToast('Signalement transmis à l’équipe de modération.', undefined, 'info')}
        >
          <Icon name="flag" />
          Signaler
        </button>
      </div>
    </article>
  );
}
