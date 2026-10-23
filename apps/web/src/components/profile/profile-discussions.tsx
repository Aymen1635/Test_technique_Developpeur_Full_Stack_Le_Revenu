'use client';

import React, { useState } from 'react';
import { Discussion } from '@/types';
import { DiscussionCard } from '@/components/feed/discussion-card';
import { Icon } from '@/components/ui/icons';

export function ProfileDiscussions({ discussions }: { discussions: Discussion[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  if (discussions.length === 0) {
    return (
      <div className="card text-center p-8 text-sm text-ink-2">
        Cet utilisateur n'a pas encore lancé de discussion.
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(discussions.length / PAGE_SIZE));
  const paginated = discussions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-3">
      <div className="feed">
        {paginated.map((d) => (
          <DiscussionCard key={d.id || d.slug} discussion={d} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface rounded-xl border border-line text-xs mt-1"
          aria-label="Pagination des discussions de l'utilisateur"
        >
          <span className="text-ink-3">
            Page <b>{currentPage}</b> sur <b>{totalPages}</b>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="btn btn-secondary px-2 py-1 text-xs"
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
                className={`w-6 h-6 rounded-md text-xs font-semibold ${
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
              className="btn btn-secondary px-2 py-1 text-xs"
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
