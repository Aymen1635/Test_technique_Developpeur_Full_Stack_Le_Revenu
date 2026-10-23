'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';

export type FeedTab = 'hot' | 'new' | 'unanswered';
export type Density = 'comfy' | 'compact';

interface FeedBarProps {
  currentTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  unansweredCount?: number;
  density: Density;
  onDensityChange: (density: Density) => void;
}

export function FeedBar({
  currentTab,
  onTabChange,
  unansweredCount = 0,
  density,
  onDensityChange,
}: FeedBarProps) {
  return (
    <div className="feed-bar">
      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'hot'}
          className={`tab ${currentTab === 'hot' ? 'on' : ''}`}
          onClick={() => onTabChange('hot')}
        >
          <Icon name="trend" />
          Tendances
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'new'}
          className={`tab ${currentTab === 'new' ? 'on' : ''}`}
          onClick={() => onTabChange('new')}
        >
          <Icon name="clock" />
          Récentes
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'unanswered'}
          className={`tab ${currentTab === 'unanswered' ? 'on' : ''}`}
          onClick={() => onTabChange('unanswered')}
        >
          <Icon name="help" />
          Sans réponse
          {unansweredCount > 0 && (
            <span className="ml-1 text-[11px] bg-brand-soft text-brand-text font-bold px-1.5 py-0.5 rounded-full">
              {unansweredCount}
            </span>
          )}
        </button>
      </div>

      <div className="seg-ic" role="group" aria-label="Affichage de la liste">
        <button
          type="button"
          className={density === 'comfy' ? 'on' : ''}
          onClick={() => onDensityChange('comfy')}
          aria-label="Vue détaillée"
          title="Vue détaillée"
        >
          <Icon name="rows" />
        </button>

        <button
          type="button"
          className={density === 'compact' ? 'on' : ''}
          onClick={() => onDensityChange('compact')}
          aria-label="Vue compacte"
          title="Vue compacte"
        >
          <Icon name="list" />
        </button>
      </div>
    </div>
  );
}
