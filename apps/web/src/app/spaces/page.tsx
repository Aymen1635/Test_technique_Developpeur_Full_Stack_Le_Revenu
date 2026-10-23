import React from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/api';
import { SideNav } from '@/components/layout/side-nav';
import { STATIC_CATEGORIES } from '@/lib/constants';
import { Icon } from '@/components/ui/icons';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tous les espaces thématiques - Communauté Le Revenu',
  description: 'Onze espaces thématiques pour échanger sur la Bourse, les placements, les impôts et la retraite.',
};

export default async function SpacesPage() {
  const categoriesRes = await getCategories();
  const categories = Array.isArray(categoriesRes) && categoriesRes.length > 0 ? categoriesRes : STATIC_CATEGORIES;

  return (
    <div className="layout no-right">
      <SideNav categories={categories} />

      <main className="main">
        <header className="mb-4">
          <h1 className="font-display text-3xl font-bold mb-2">Tous les espaces</h1>
          <p className="text-ink-2 text-sm max-w-xl">
            Onze espaces thématiques, calqués sur les grandes rubriques du Revenu, pour trouver des
            réponses précises à chaque situation financière.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/spaces/${c.slug}`}
              className="card p-5 flex flex-col gap-2 hover:-translate-y-0.5 transition-all hover:shadow-lg cursor-pointer"
            >
              <span
                className="sp-ic md"
                style={{ '--c': c.color || '#eb0f0f' } as React.CSSProperties}
              >
                <Icon name={c.icon || 'globe'} className="w-5 h-5" />
              </span>

              <h3 className="font-display text-lg font-bold mt-1">{c.name}</h3>
              <p className="text-xs text-ink-2 line-clamp-2 flex-1">{c.description}</p>
              <small className="text-[11px] text-ink-3 mt-2 font-medium">
                Voir les discussions →
              </small>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
