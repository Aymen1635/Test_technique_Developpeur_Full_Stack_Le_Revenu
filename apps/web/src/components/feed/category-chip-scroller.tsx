import React from 'react';
import Link from 'next/link';
import { STATIC_CATEGORIES } from '@/lib/constants';

export function CategoryChipScroller({ activeSlug = '' }: { activeSlug?: string }) {
  return (
    <div className="cat-scroller flex sm:hidden">
      <Link
        href="/"
        className={`chip ${!activeSlug ? 'on' : ''}`}
      >
        Tout
      </Link>
      {STATIC_CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={`/spaces/${c.slug}`}
          className={`chip ${activeSlug === c.slug ? 'on' : ''}`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
