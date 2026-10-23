'use client';

import React, { useEffect } from 'react';
import { Icon } from '@/components/ui/icons';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Page Error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-14 h-14 rounded-full bg-brand-soft text-brand-text grid place-items-center mb-4">
        <Icon name="x" className="w-7 h-7" />
      </div>
      <h2 className="font-display text-2xl font-bold mb-2">Une erreur est survenue</h2>
      <p className="text-ink-2 text-sm max-w-md mb-6">
        Impossible de charger les données pour le moment. Veuillez vérifier la connexion au serveur Strapi.
      </p>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => reset()}
      >
        Réessayer
      </button>
    </div>
  );
}
