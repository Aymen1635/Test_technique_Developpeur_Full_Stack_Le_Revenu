'use client';

import React from 'react';
import { Reply } from '@/types';
import { Icon } from '@/components/ui/icons';

export function BestAnswerCallout({ solution }: { solution?: Reply | null }) {
  if (!solution) return null;

  const handleScrollToSolution = () => {
    const el = document.getElementById(`reply-${solution.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-ok');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-ok');
      }, 2000);
    }
  };

  return (
    <button
      type="button"
      className="solution-call"
      onClick={handleScrollToSolution}
    >
      <Icon name="check" className="w-5 h-5 flex-none" />
      <div>
        <b>
          Meilleure réponse
          {solution.verified && ' · vérifiée par la rédaction'} ·{' '}
          {solution.author?.name || solution.author?.username || 'Membre'}
        </b>
        <p className="line-clamp-2 text-sm text-ink-2 mt-0.5">
          {solution.content}
        </p>
      </div>
    </button>
  );
}
