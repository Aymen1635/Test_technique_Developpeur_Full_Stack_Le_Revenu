'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icons';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { CreateDiscussionModal } from '@/components/composer/create-discussion-modal';

export function Header() {
  const router = useRouter();
  const { user, mode, setMode } = useAuth();
  const [search, setSearch] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <>
      <header className="hdr">
        <div className="wrap hdr-in">
          <Link href="/" className="brand" aria-label="Accueil de la communauté Le Revenu">
            <span className="lr-logo" aria-hidden="true">
              <span className="lr-le">LE</span>
              <span>REVENU</span>
            </span>
            <span className="brand-sep" />
            <span className="brand-sub">Communauté</span>
          </Link>

          <form className="search" onSubmit={handleSearchSubmit} role="search">
            <Icon name="search" />
            <input
              type="search"
              placeholder="Rechercher une discussion, un sujet…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </form>

          <div className="hdr-act">
            {mode === 'member' && user ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsComposerOpen(true)}
                >
                  <Icon name="plus" />
                  Publier
                </button>

                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Notifications"
                >
                  <Icon name="bell" />
                  <span className="dot-count">3</span>
                </button>

                <Link
                  href={`/profile/${user.username}`}
                  className="me-btn"
                  aria-label="Mon profil"
                >
                  <Avatar user={user} size="sm" />
                  <span className="me-pts">{user.points || 0} pts</span>
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-quiet"
                  onClick={() => setMode('member')}
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setMode('member')}
                >
                  Rejoindre
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {isComposerOpen && (
        <CreateDiscussionModal
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
        />
      )}
    </>
  );
}
