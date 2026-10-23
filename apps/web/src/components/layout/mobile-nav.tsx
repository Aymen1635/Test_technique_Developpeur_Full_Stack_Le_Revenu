'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';
import { CreateDiscussionModal } from '@/components/composer/create-discussion-modal';

export function MobileNav() {
  const pathname = usePathname();
  const { user, mode, setMode } = useAuth();
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <>
      <nav className="bnav" aria-label="Navigation mobile">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 text-[11px] p-1 ${pathname === '/' ? 'text-brand font-semibold' : 'text-ink-3'}`}
        >
          <Icon name="home" />
          Accueil
        </Link>

        <Link
          href="/spaces"
          className={`flex flex-col items-center gap-0.5 text-[11px] p-1 ${pathname.startsWith('/spaces') ? 'text-brand font-semibold' : 'text-ink-3'}`}
        >
          <Icon name="grid" />
          Espaces
        </Link>

        <button
          type="button"
          onClick={() => {
            if (mode === 'visitor') {
              setMode('member');
            }
            setIsComposerOpen(true);
          }}
          className="flex flex-col items-center justify-center -mt-4 w-12 h-12 rounded-full bg-brand text-white shadow-lg shadow-brand/30"
          aria-label="Publier"
        >
          <Icon name="plus" className="w-6 h-6" />
        </button>

        <Link
          href="/leaderboard"
          className={`flex flex-col items-center gap-0.5 text-[11px] p-1 ${pathname === '/leaderboard' ? 'text-brand font-semibold' : 'text-ink-3'}`}
        >
          <Icon name="trophy" />
          Top
        </Link>

        {mode === 'member' && user ? (
          <Link
            href={`/profile/${user.username}`}
            className={`flex flex-col items-center gap-0.5 text-[11px] p-1 ${pathname.startsWith('/profile') ? 'text-brand font-semibold' : 'text-ink-3'}`}
          >
            <Icon name="user" />
            Profil
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setMode('member')}
            className="flex flex-col items-center gap-0.5 text-[11px] p-1 text-ink-3"
          >
            <Icon name="user" />
            Connexion
          </button>
        )}
      </nav>

      {isComposerOpen && (
        <CreateDiscussionModal
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
        />
      )}
    </>
  );
}
