'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/icons';
import { Category } from '@/types';
import { STATIC_CATEGORIES } from '@/lib/constants';

export { STATIC_CATEGORIES };

export function SideNav({ categories = STATIC_CATEGORIES }: { categories?: Category[] }) {
  const pathname = usePathname();
  const safeCategories = Array.isArray(categories) && categories.length > 0 ? categories : STATIC_CATEGORIES;

  return (
    <nav className="side" aria-label="Navigation principale">
      <Link
        href="/"
        className={`nav-link ${pathname === '/' ? 'on' : ''}`}
      >
        <Icon name="home" />
        Accueil
      </Link>

      <Link
        href="/spaces"
        className={`nav-link ${pathname === '/spaces' ? 'on' : ''}`}
      >
        <Icon name="grid" />
        Tous les espaces
      </Link>

      <Link
        href="/leaderboard"
        className={`nav-link ${pathname === '/leaderboard' ? 'on' : ''}`}
      >
        <Icon name="trophy" />
        Classement
      </Link>

      <Link
        href="/charter"
        className={`nav-link ${pathname === '/charter' ? 'on' : ''}`}
      >
        <Icon name="book" />
        Charte
      </Link>

      <div className="nav-title">Espaces</div>

      {safeCategories.map((c) => {
        const isActive = pathname === `/spaces/${c.slug}`;
        return (
          <Link
            key={c.slug}
            href={`/spaces/${c.slug}`}
            className={`nav-link ${isActive ? 'on' : ''}`}
          >
            <span
              className="sp-ic"
              style={{ '--c': c.color || '#eb0f0f' } as React.CSSProperties}
            >
              <Icon name={c.icon || 'globe'} />
            </span>
            <span className="truncate">{c.name}</span>
          </Link>
        );
      })}

      <a
        href="https://www.lerevenu.com"
        target="_blank"
        rel="noopener noreferrer"
        className="nav-foot"
      >
        <span>Retour sur lerevenu.com</span>
        <Icon name="external" className="w-3.5 h-3.5 ml-auto opacity-70" />
      </a>
    </nav>
  );
}
