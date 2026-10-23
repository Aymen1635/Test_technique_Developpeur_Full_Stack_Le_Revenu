import React from 'react';
import Link from 'next/link';
import { getDiscussions } from '@/lib/api';
import { SideNav } from '@/components/layout/side-nav';
import { DiscussionCard } from '@/components/feed/discussion-card';
import { Icon } from '@/components/ui/icons';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;

  const res = q ? await getDiscussions({ search: q, page: 1, pageSize: 20 }) : { data: [], meta: { pagination: { page: 1, pageSize: 20, pageCount: 0, total: 0 } } };
  const results = res?.data || [];

  return (
    <div className="layout no-right">
      <SideNav />

      <main className="main max-w-3xl">
        <header className="mb-2">
          <Link href="/" className="text-xs text-ink-3 hover:text-ink flex items-center gap-1 mb-2">
            <Icon name="arrowL" className="w-3.5 h-3.5" />
            Retour à l'accueil
          </Link>
          <h1 className="font-display text-2xl font-bold">
            {q ? `Résultats pour « ${q} »` : 'Rechercher une discussion'}
          </h1>
        </header>

        {q && (
          <p className="text-xs text-ink-3 mb-2">
            <span className="num font-bold text-ink">{results.length}</span> résultat
            {results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
          </p>
        )}

        {results.length === 0 ? (
          <div className="card text-center p-10 flex flex-col items-center">
            <h3 className="font-display font-bold text-lg mb-1">Aucune discussion trouvée</h3>
            <p className="text-xs text-ink-2 max-w-sm mb-4">
              Posez la question à la communauté : quelqu'un a sûrement vécu la même situation.
            </p>
            <Link href="/discussions/new" className="btn btn-primary text-xs">
              <Icon name="plus" />
              Poser cette question
            </Link>
          </div>
        ) : (
          <div className="feed">
            {results.map((d) => (
              <DiscussionCard key={d.id} discussion={d} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
