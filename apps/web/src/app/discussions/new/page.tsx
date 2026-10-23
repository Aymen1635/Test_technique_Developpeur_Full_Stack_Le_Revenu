'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SideNav, STATIC_CATEGORIES } from '@/components/layout/side-nav';
import { Icon } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';
import { createDiscussion } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

export default function NewDiscussionPage() {
  const router = useRouter();
  const { user, token, mode, setMode, ensureToken, addPoints } = useAuth();
  const { showToast } = useToast();

  const [type, setType] = useState<'question' | 'discussion' | 'poll'>('question');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('bourse');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 10) {
      setError('Le titre doit contenir au moins 10 caractères.');
      return;
    }

    if (!content.trim()) {
      setError('Le contenu de la discussion est obligatoire.');
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
        },
        activeToken
      );

      addPoints(5);
      showToast('Discussion publiée ! (+5 points)', 5, 'success');
      router.push(`/discussions/${created.slug}`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="layout no-right">
      <SideNav />

      <main className="main max-w-2xl">
        <header className="mb-2">
          <Link href="/" className="text-xs text-ink-3 hover:text-ink flex items-center gap-1 mb-2">
            <Icon name="arrowL" className="w-3.5 h-3.5" />
            Retour à l'accueil
          </Link>
          <h1 className="font-display text-2xl font-bold">Nouvelle publication</h1>
        </header>

        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-brand-soft border border-brand/20 text-brand-text rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="types" role="radiogroup">
            <label
              className={`type ${type === 'question' ? 'active' : ''}`}
              onClick={() => setType('question')}
            >
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
              <Icon name="chart" className="text-brand-text mb-1" />
              <b>Créer un sondage</b>
              <small className="text-ink-3 text-xs">
                Recueillez l'avis de la communauté
              </small>
            </label>
          </div>

          <div className="field">
            <label htmlFor="title">Titre de la discussion</label>
            <input
              id="title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="10 caractères minimum..."
              required
            />
          </div>

          <div className="field">
            <label htmlFor="category">Espace thématique</label>
            <select
              id="category"
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
            <label htmlFor="content">Détails et contexte</label>
            <textarea
              id="content"
              className="input min-h-[140px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Décrivez votre situation avec précision..."
              required
            />
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-line">
            <span className="text-xs text-ink-3">
              Auteur : <b>{user?.name || user?.username || 'Visiteur (sera connecté en tant que Camille)'}</b>
            </span>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Publication en cours…' : 'Publier la discussion (+5 pts)'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
