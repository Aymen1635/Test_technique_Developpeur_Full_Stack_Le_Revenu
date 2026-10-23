'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icons';
import { STATIC_CATEGORIES } from '@/components/layout/side-nav';
import { useAuth } from '@/lib/auth-context';
import { createDiscussion } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

interface CreateDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'question' | 'discussion' | 'poll';
  initialCategory?: string;
}

export function CreateDiscussionModal({
  isOpen,
  onClose,
  initialType = 'question',
  initialCategory = '',
}: CreateDiscussionModalProps) {
  const router = useRouter();
  const { token, user, ensureToken, addPoints } = useAuth();
  const { showToast } = useToast();

  const [type, setType] = useState<'question' | 'discussion' | 'poll'>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(initialCategory || 'bourse');
  const [content, setContent] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Similar discussions simulated preview
  const showSimilar = title.toLowerCase().includes('pea') || title.toLowerCase().includes('assurance');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (title.trim().length < 10) {
      setError('Le titre doit contenir au moins 10 caractères.');
      return;
    }

    if (!content.trim()) {
      setError('Le contenu de la discussion est obligatoire.');
      return;
    }

    if (!category) {
      setError("Veuillez choisir un espace.");
      return;
    }

    setIsLoading(true);

    try {
      const activeToken = await ensureToken();
      if (!activeToken) {
        throw new Error('Vous devez être connecté pour publier une discussion.');
      }

      const created = await createDiscussion(
        {
          title: title.trim(),
          content: content.trim(),
          category,
          type,
          poll_options: type === 'poll' ? pollOptions.map((label) => ({ label, votes: 0 })) : undefined,
        },
        activeToken
      );

      addPoints(5);
      showToast('Discussion publiée ! (+5 points)', 5, 'success');
      onClose();

      // Redirect to newly created discussion
      router.push(`/discussions/${created.slug}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la publication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <form onSubmit={handleSubmit} noValidate>
          <div className="m-head">
            <h2>Nouvelle publication</h2>
            <button
              type="button"
              className="icon-btn"
              onClick={onClose}
              aria-label="Fermer"
            >
              <Icon name="x" />
            </button>
          </div>

          <div className="m-body">
            {error && (
              <div className="p-3 bg-brand-soft border border-brand/20 text-brand-text rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <div className="types" role="radiogroup" aria-label="Type de publication">
              <label
                className={`type ${type === 'question' ? 'active' : ''}`}
                onClick={() => setType('question')}
              >
                <input
                  type="radio"
                  name="type"
                  checked={type === 'question'}
                  onChange={() => setType('question')}
                />
                <Icon name="help" className="text-brand-text mb-1" />
                <b>Poser une question</b>
                <small className="text-ink-3 text-xs">
                  Obtenez l'aide des membres et de la rédaction
                </small>
              </label>

              <label
                className={`type ${type === 'discussion' ? 'active' : ''}`}
                onClick={() => setType('discussion')}
              >
                <input
                  type="radio"
                  name="type"
                  checked={type === 'discussion'}
                  onChange={() => setType('discussion')}
                />
                <Icon name="msg" className="text-brand-text mb-1" />
                <b>Lancer une discussion</b>
                <small className="text-ink-3 text-xs">
                  Partagez une expérience, un avis, une actualité
                </small>
              </label>

              <label
                className={`type ${type === 'poll' ? 'active' : ''}`}
                onClick={() => setType('poll')}
              >
                <input
                  type="radio"
                  name="type"
                  checked={type === 'poll'}
                  onChange={() => setType('poll')}
                />
                <Icon name="chart" className="text-brand-text mb-1" />
                <b>Créer un sondage</b>
                <small className="text-ink-3 text-xs">
                  Recueillez l'avis de la communauté en un clic
                </small>
              </label>
            </div>

            <div className="field">
              <label htmlFor="c-title">Titre</label>
              <input
                id="c-title"
                name="title"
                className={`input ${error && title.trim().length < 10 ? 'err' : ''}`}
                placeholder={
                  type === 'question'
                    ? 'Ex. : Faut-il ouvrir un PEA ou une assurance-vie à 30 ans ?'
                    : 'Ex. : Mon retour d’expérience sur la gestion passive'
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={150}
                required
              />
              <span className="text-xs text-ink-3">
                Un titre clair et précis obtient plus vite des réponses (10 caractères minimum).
              </span>
            </div>

            {showSimilar && (
              <div className="p-3 bg-brand-soft/70 rounded-lg border border-brand/20 text-xs">
                <b className="flex items-center gap-1.5 text-brand-text mb-1.5 font-semibold">
                  <Icon name="search" className="w-3.5 h-3.5" />
                  Ces discussions répondent peut-être déjà à votre question :
                </b>
                <div className="flex flex-col gap-1 text-ink">
                  <span className="hover:underline cursor-pointer">
                    • Ouvrir un PEA avec 5 000 € : par où commencer ? (3 réponses)
                  </span>
                  <span className="hover:underline cursor-pointer">
                    • Assurance-vie après 70 ans : est-ce encore intéressant ? (2 réponses)
                  </span>
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="c-cat">Espace thématique</label>
              <select
                id="c-cat"
                name="category"
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {STATIC_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="c-body">Détails et contexte</label>
              <textarea
                id="c-body"
                name="content"
                className="input min-h-[120px]"
                placeholder="Votre situation, votre horizon de placement, ce que vous avez déjà envisagé… Plus le contexte est précis, meilleures sont les réponses."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {type === 'poll' && (
              <div className="field">
                <label>Options du sondage</label>
                {pollOptions.map((opt, idx) => (
                  <input
                    key={idx}
                    className="input mb-2 text-sm"
                    value={opt}
                    placeholder={`Option ${idx + 1}`}
                    onChange={(e) => {
                      const updated = [...pollOptions];
                      updated[idx] = e.target.value;
                      setPollOptions(updated);
                    }}
                  />
                ))}
                {pollOptions.length < 6 && (
                  <button
                    type="button"
                    className="btn btn-quiet btn-sm self-start"
                    onClick={() => setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`])}
                  >
                    <Icon name="plus" />
                    Ajouter une option
                  </button>
                )}
              </div>
            )}

            <p className="flex items-start gap-2 text-xs bg-surface-2 p-3 rounded-lg text-ink-2">
              <Icon name="shield" className="w-4 h-4 text-ink-3 mt-0.5 flex-none" />
              <span>
                Partagez votre expérience : pas de conseil personnalisé ni de sollicitation financière.{' '}
                <Link href="/charter" className="text-brand-text font-semibold hover:underline">
                  Lire la charte
                </Link>
              </span>
            </p>
          </div>

          <div className="m-foot">
            <span className="text-xs text-ink-3">
              Publié en tant que <b>{user?.name || user?.username || 'Membre'}</b>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-quiet"
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Publication en cours…' : 'Publier'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
