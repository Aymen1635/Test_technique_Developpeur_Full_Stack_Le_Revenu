'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';

const SITE_URL = 'https://www.lerevenu.com';
const SITE_NAV = ['Bourse', 'Économie', 'Placements', 'Immobilier', 'Impôts', 'Succession', 'Vie pratique'];

export function SiteBar() {
  const { user } = useAuth();
  const isSubscriber = user?.is_subscriber;

  return (
    <div className="sitebar">
      <div className="wrap">
        <Link
          href="/"
          className="sb-back"
          aria-label="Retour à l'accueil de la communauté"
        >
          <Icon name="arrowL" />
          Retour à l'accueil
        </Link>

        <nav className="sb-links" aria-label="Rubriques de lerevenu.com">
          {SITE_NAV.map((item) => (
            <a
              key={item}
              href={`${SITE_URL}/${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item}
            </a>
          ))}
        </nav>

        <span className="sb-right">
          <a
            href={`${SITE_URL}/le-magazine`}
            target="_blank"
            rel="noopener noreferrer"
            className="sb-mag"
          >
            <Icon name="book" />
            Le magazine
          </a>

          <a
            href={`${SITE_URL}/abonnements`}
            target="_blank"
            rel="noopener noreferrer"
            className={`sb-sub ${isSubscriber ? 'on' : ''}`}
          >
            {isSubscriber ? 'Mon abonnement' : "S'abonner"}
          </a>
        </span>
      </div>
    </div>
  );
}
