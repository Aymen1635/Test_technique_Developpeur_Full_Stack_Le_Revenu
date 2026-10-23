'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Icon } from '@/components/ui/icons';

export function HeroBanner() {
  const { mode, user, setMode } = useAuth();

  if (mode === 'member' && user) {
    const displayName = user.name || (user.username === 'LaRedaction' ? 'la Rédaction' : user.username.replace(/_/g, ' '));
    return (
      <div className="greet">
        <h1>Bonjour {displayName}</h1>
        <span className="streak">
          <Icon name="flame" />
          6 jours d'affilée
        </span>
      </div>
    );
  }

  return (
    <section className="hero">
      <div>
        <h1>La communauté des lecteurs du Revenu</h1>
        <p>
          Posez vos questions d'argent, partagez vos expériences et échangez avec la rédaction. Bourse,
          épargne, impôts, retraite, transmission.
        </p>
        <div className="hero-stats">
          <span>
            <b>4 812</b>membres
          </span>
          <span>
            <b>1 808</b>discussions
          </span>
          <span>
            <b>13 700</b>réponses
          </span>
          <span>
            <b>94 %</b>des questions résolues
          </span>
        </div>
      </div>

      <div className="hero-cta">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setMode('member')}
        >
          Rejoindre gratuitement
        </button>
        <Link href="/spaces" className="btn btn-quiet">
          Explorer les espaces
        </Link>
      </div>
    </section>
  );
}
