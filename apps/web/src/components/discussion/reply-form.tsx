'use client';

import React, { useState } from 'react';
import { Discussion, Reply } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';
import { createReply } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

interface ReplyFormProps {
  discussion: Discussion;
  onReplyAdded: (newReply: Reply) => void;
}

export function ReplyForm({ discussion, onReplyAdded }: ReplyFormProps) {
  const { user, token, mode, setMode, ensureToken, addPoints } = useAuth();
  const { showToast } = useToast();

  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (mode === 'visitor' || !user) {
    return (
      <div className="post reply-login">
        <h3 className="font-display text-xl font-bold">
          Vous avez un avis ou une expérience à partager ?
        </h3>
        <p className="text-ink-3 text-sm">
          Rejoignez la communauté avec votre compte lerevenu.com pour répondre.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setMode('member')}
        >
          Se connecter pour répondre
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (content.trim().length < 2) {
      setError('Votre réponse doit contenir au moins 2 caractères.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const activeToken = await ensureToken();
      if (!activeToken) {
        throw new Error('Connexion requise pour répondre.');
      }

      const created = await createReply(
        {
          content: content.trim(),
          discussion: discussion.id || discussion.documentId || discussion.slug,
        },
        activeToken
      );

      addPoints(3);
      setContent('');
      showToast('Merci pour votre réponse ! (+3 points)', 3, 'success');
      onReplyAdded(created);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la publication de la réponse');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMentionClick = () => {
    const authorUsername = discussion.author?.username;
    if (authorUsername && !content.includes(`@${authorUsername}`)) {
      setContent((prev) => (prev ? `${prev} @${authorUsername} ` : `@${authorUsername} `));
    }
  };

  const authorDisplayName = (discussion.author as any)?.name || discussion.author?.username || 'l\'auteur';

  return (
    <form className="post reply-box" onSubmit={handleSubmit}>
      <div className="author">
        <Avatar user={user} size="sm" />
        <div className="author-sub">
          Répondre en tant que <b className="text-ink">{user.name || user.username}</b>
        </div>
      </div>

      {error && (
        <div className="text-sm text-brand font-medium">
          {error}
        </div>
      )}

      <label htmlFor="reply-body" className="sr-only">
        Votre réponse
      </label>
      <textarea
        id="reply-body"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          discussion.type === 'question'
            ? `Partagez votre expérience pour aider ${authorDisplayName}…`
            : 'Votre avis sur la question…'
        }
        rows={4}
        required
      />

      <div className="reply-foot">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="act text-xs"
            onClick={handleMentionClick}
          >
            <Icon name="at" />
            Mentionner l'auteur
          </button>
          <span className="text-xs text-ink-3 hidden sm:inline">
            Ctrl + Entrée pour publier
          </span>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Publication…' : 'Publier ma réponse (+3 pts)'}
        </button>
      </div>
    </form>
  );
}
