import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icons';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-brand-soft text-brand-text grid place-items-center mb-4">
        <Icon name="help" className="w-8 h-8" />
      </div>
      <h1 className="font-display text-3xl font-bold mb-2">Page introuvable</h1>
      <p className="text-ink-2 text-sm max-w-md mb-6">
        La discussion ou la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link href="/" className="btn btn-primary">
        <Icon name="home" />
        Retour à l'accueil de la communauté
      </Link>
    </div>
  );
}
