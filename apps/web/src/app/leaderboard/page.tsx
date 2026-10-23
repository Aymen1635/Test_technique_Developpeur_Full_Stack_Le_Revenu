import React from 'react';
import Link from 'next/link';
import { SideNav } from '@/components/layout/side-nav';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icons';
import { getUserLevel } from '@/components/ui/user-badge';

export const metadata = {
  title: 'Classement des contributeurs - Communauté Le Revenu',
  description: 'Classement des membres les plus actifs de la communauté Le Revenu.',
};

export default function LeaderboardPage() {
  const contributors = [
    { rank: 1, username: 'PapyBoursier', name: 'Papy Boursier', points: 804, color: 'var(--av-4)' },
    { rank: 2, username: 'Vincent_ETF', name: 'Vincent', points: 612, color: 'var(--av-1)' },
    { rank: 3, username: 'Odile.Retraite', name: 'Odile', points: 286, color: 'var(--av-2)' },
    { rank: 4, username: 'Sandrine_CGP', name: 'Sandrine Morel', points: 238, color: 'var(--av-2)' },
    { rank: 5, username: 'Nadia.Patrimoine', name: 'Nadia', points: 197, color: 'var(--av-5)' },
    { rank: 6, username: 'Me_Garnier', name: 'Maître Garnier', points: 175, color: 'var(--av-1)' },
    { rank: 7, username: 'Claire_Nantes', name: 'Claire', points: 166, color: 'var(--av-3)' },
    { rank: 8, username: 'Sophie.Invest', name: 'Sophie', points: 151, color: 'var(--av-1)' },
    { rank: 9, username: 'Camille_B', name: 'Camille', points: 142, color: 'var(--av-5)' },
    { rank: 10, username: 'Karim_Immo', name: 'Karim', points: 131, color: 'var(--av-4)' },
  ];

  return (
    <div className="layout">
      <SideNav />

      <main className="main">
        <header className="mb-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">
            Classement des contributeurs
          </h1>
          <p className="text-ink-2 text-sm max-w-xl">
            Les membres qui font vivre la communauté par leur entraide et la pertinence de leurs
            réponses.
          </p>
        </header>

        <div className="card p-0 overflow-hidden divide-y divide-line">
          {contributors.map((u) => (
            <div key={u.username} className="flex items-center gap-3.5 p-3.5 hover:bg-surface-2/60 transition-colors">
              <span className="w-7 text-center font-bold text-sm">
                {u.rank === 1 && (
                  <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-brand text-white text-xs font-bold">
                    1
                  </span>
                )}
                {u.rank === 2 && (
                  <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-[#5856d6] text-white text-xs font-bold">
                    2
                  </span>
                )}
                {u.rank === 3 && (
                  <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-[#8e8e93] text-white text-xs font-bold">
                    3
                  </span>
                )}
                {u.rank > 3 && <span className="text-ink-3">{u.rank}</span>}
              </span>

              <Avatar user={{ username: u.username, name: u.name, avatar_color: u.color }} size="sm" link />

              <div className="flex-1 min-w-0">
                <Link href={`/profile/${u.username}`} className="font-semibold text-sm hover:underline block truncate">
                  {u.name}
                </Link>
                <small className="text-ink-3 text-xs block">{getUserLevel(u.points)}</small>
              </div>

              <b className="num text-accent font-bold text-sm">{u.points} pts</b>
            </div>
          ))}
        </div>
      </main>

      <aside className="right">
        {/* Points rules */}
        <section className="card">
          <h2 className="card-title">
            <Icon name="trophy" />
            Gagner des points
          </h2>
          <ul className="text-xs flex flex-col gap-2 divide-y divide-line pt-1">
            <li className="flex justify-between items-center pt-1.5">
              <span>Publier une réponse</span>
              <b className="text-accent font-bold">+3 pts</b>
            </li>
            <li className="flex justify-between items-center pt-1.5">
              <span>Lancer une discussion</span>
              <b className="text-accent font-bold">+5 pts</b>
            </li>
            <li className="flex justify-between items-center pt-1.5">
              <span>Recevoir un vote « Utile »</span>
              <b className="text-accent font-bold">+5 pts</b>
            </li>
            <li className="flex justify-between items-center pt-1.5">
              <span>Meilleure réponse acceptée</span>
              <b className="text-accent font-bold">+20 pts</b>
            </li>
            <li className="flex justify-between items-center pt-1.5">
              <span>Voter à un sondage</span>
              <b className="text-accent font-bold">+1 pt</b>
            </li>
          </ul>
        </section>

        {/* Levels */}
        <section className="card">
          <h2 className="card-title">
            <Icon name="star" />
            Les paliers
          </h2>
          <ul className="text-xs flex flex-col gap-1.5">
            <li className="flex justify-between">
              <span>Nouveau venu</span>
              <b>0 pt</b>
            </li>
            <li className="flex justify-between">
              <span>Membre</span>
              <b>25 pts</b>
            </li>
            <li className="flex justify-between">
              <span>Contributeur</span>
              <b>100 pts</b>
            </li>
            <li className="flex justify-between">
              <span>Contributeur averti</span>
              <b>300 pts</b>
            </li>
            <li className="flex justify-between">
              <span>Pilier de la communauté</span>
              <b>750 pts</b>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  );
}
