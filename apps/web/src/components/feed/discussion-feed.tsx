'use client';

import React, { useState, useEffect } from 'react';
import { Discussion } from '@/types';
import { FeedBar, FeedTab, Density } from './feed-bar';
import { DiscussionCard } from './discussion-card';
import { DiscussionRow } from './discussion-row';
import { Icon } from '@/components/ui/icons';

interface DiscussionFeedProps {
  initialDiscussions: Discussion[];
  categorySlug?: string;
  onOpenComposer?: () => void;
}

export function DiscussionFeed({
  initialDiscussions,
  categorySlug,
  onOpenComposer,
}: DiscussionFeedProps) {
  const [tab, setTab] = useState<FeedTab>('hot');
  const [density, setDensity] = useState<Density>('comfy');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 7;

  useEffect(() => {
    setCurrentPage(1);
  }, [tab, categorySlug]);

  useEffect(() => {
    const savedDensity = localStorage.getItem('lr_density') as Density;
    if (savedDensity) {
      setDensity(savedDensity);
    }
  }, []);

  const handleDensityChange = (newDensity: Density) => {
    setDensity(newDensity);
    localStorage.setItem('lr_density', newDensity);
  };

  // Filter & sort discussions
  let filtered = [...initialDiscussions];

  if (categorySlug) {
    filtered = filtered.filter((d) => d.category?.slug === categorySlug);
  }

  const unansweredCount = filtered.filter((d) => !d.replies || d.replies.length === 0).length;

  if (tab === 'unanswered') {
    filtered = filtered.filter((d) => !d.replies || d.replies.length === 0);
  } else if (tab === 'new') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    // 'hot': sort by activity, views, and likes
    filtered.sort((a, b) => {
      const scoreA = (a.replies?.length || 0) * 3 + (a.likes || 0) * 2 + (a.views || 0) / 20;
      const scoreB = (b.replies?.length || 0) * 3 + (b.likes || 0) * 2 + (b.views || 0) / 20;
      return scoreB - scoreA;
    });
  }

  // Pinned first
  filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <FeedBar
        currentTab={tab}
        onTabChange={setTab}
        unansweredCount={unansweredCount}
        density={density}
        onDensityChange={handleDensityChange}
      />

      {filtered.length === 0 ? (
        <div className="feed">
          <div className="p-10 text-center flex flex-col items-center">
            <h3 className="font-display text-xl font-bold mb-2">
              {tab === 'unanswered' ? 'Toutes les questions ont une réponse !' : 'Aucune discussion pour le moment'}
            </h3>
            <p className="text-ink-2 max-w-md text-sm mb-4">
              {tab === 'unanswered'
                ? 'Bravo à la communauté ! Revenez plus tard ou lancez vous-même un sujet.'
                : 'Soyez le premier à poser une question ou à partager une expérience.'}
            </p>
            {onOpenComposer && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onOpenComposer}
              >
                <Icon name="plus" />
                Publier une discussion
              </button>
            )}
          </div>
        </div>
      ) : density === 'compact' ? (
        <div className="feed feed-compact">
          <div className="trow trow-head">
            <span>Discussion</span>
            <span className="c-num">Réponses</span>
            <span className="c-num c-views hidden sm:inline-block">Vues</span>
            <span className="c-num">Activité</span>
          </div>
          {paginated.map((d) => (
            <DiscussionRow key={d.id || d.slug} discussion={d} />
          ))}
        </div>
      ) : (
        <div className="feed">
          {paginated.map((d) => (
            <DiscussionCard key={d.id || d.slug} discussion={d} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface rounded-xl border border-line text-xs mt-2"
          aria-label="Pagination des discussions"
        >
          <span className="text-ink-3">
            Affichage de <b>{(currentPage - 1) * PAGE_SIZE + 1}</b> à{' '}
            <b>{Math.min(currentPage * PAGE_SIZE, filtered.length)}</b> sur <b>{filtered.length}</b> discussions
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="btn btn-secondary px-2.5 py-1 text-xs"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <Icon name="arrowL" className="w-3.5 h-3.5" />
              Précédent
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-brand text-white'
                    : 'bg-surface-2 text-ink hover:bg-black/5'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="btn btn-secondary px-2.5 py-1 text-xs"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
              <Icon name="arrowR" className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
