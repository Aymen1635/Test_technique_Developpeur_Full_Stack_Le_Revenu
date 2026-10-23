'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icons';
import { CreateDiscussionModal } from './create-discussion-modal';

export function QuickComposer({ defaultCategory }: { defaultCategory?: string }) {
  const { user, mode, setMode } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [initialType, setInitialType] = useState<'question' | 'discussion' | 'poll'>('question');

  const handleOpen = (type: 'question' | 'discussion' | 'poll' = 'question') => {
    if (mode === 'visitor') {
      setMode('member');
    }
    setInitialType(type);
    setIsOpen(true);
  };

  return (
    <>
      <div className="quick" role="group">
        <Avatar user={user || undefined} size="md" />

        <button
          type="button"
          className="quick-input"
          onClick={() => handleOpen('question')}
        >
          Posez votre question à la communauté…
        </button>

        <div className="quick-types hidden sm:flex">
          <button
            type="button"
            className="quick-type"
            onClick={() => handleOpen('question')}
          >
            <Icon name="help" />
            Question
          </button>
          <button
            type="button"
            className="quick-type"
            onClick={() => handleOpen('discussion')}
          >
            <Icon name="msg" />
            Discussion
          </button>
          <button
            type="button"
            className="quick-type"
            onClick={() => handleOpen('poll')}
          >
            <Icon name="chart" />
            Sondage
          </button>
        </div>
      </div>

      {isOpen && (
        <CreateDiscussionModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialType={initialType}
          initialCategory={defaultCategory}
        />
      )}
    </>
  );
}
