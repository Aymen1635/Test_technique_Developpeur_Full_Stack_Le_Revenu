'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icons';
import { getUserLevel } from '@/components/ui/user-badge';
import { useToast } from '@/components/ui/toast';

export function SidebarWidgets({ categorySlug }: { categorySlug?: string }) {
  const { user, mode, setMode } = useAuth();
  const { showToast } = useToast();

  const [pollVote, setPollVote] = useState<number | null>(null);
  const [eventRsvp, setEventRsvp] = useState(false);

  const pollOptions = [
    { label: 'Assurance-vie', votes: 214 },
    { label: 'Actions / PEA', votes: 268 },
    { label: 'Immobilier / SCPI', votes: 87 },
    { label: 'Livrets sans risque', votes: 141 },
  ];

  const totalVotes = pollOptions.reduce((acc, o) => acc + o.votes, 0) + (pollVote !== null ? 1 : 0);

  const handlePollVote = (index: number) => {
    if (mode === 'visitor') {
      setMode('member');
    }
    setPollVote(index);
    showToast('Merci pour votre vote ! (+1 point)', 1, 'success');
  };

  const handleRsvp = () => {
    if (mode === 'visitor') {
      setMode('member');
    }
    setEventRsvp(!eventRsvp);
    showToast(
      !eventRsvp ? "C'est noté ! Rappel envoyé la veille." : 'Inscription annulée.',
      undefined,
      'info'
    );
  };

  return (
    <aside className="right">
      {/* 1. Progress or Join CTA */}
      {mode === 'member' && user ? (
        <section className="card">
          <h2 className="card-title">
            <Icon name="trophy" />
            Votre progression
            <Link href={`/profile/${user.username}`} className="more">
              Mon profil
            </Link>
          </h2>

          <div className="flex items-center gap-3 mb-3">
            <Avatar user={user} size="md" />
            <div>
              <h3 className="font-semibold text-sm">{getUserLevel(user.points)}</h3>
              <small className="text-ink-3">
                <span className="num font-bold text-ink">{user.points || 0}</span> points ·{' '}
                <span className="text-accent font-semibold">6 jours d'affilée</span>
              </small>
            </div>
          </div>

          <div className="h-1.5 rounded-full bg-fill overflow-hidden mb-2">
            <span
              className="block h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round(((user.points || 0) / 300) * 100))}%` }}
            />
          </div>

          <div className="text-xs text-ink-3 flex justify-between">
            <span>Encore {Math.max(0, 300 - (user.points || 0))} pts pour « Contributeur averti »</span>
          </div>
        </section>
      ) : (
        <section className="card bg-gradient-to-b from-brand-soft to-surface">
          <h3 className="font-display text-lg font-bold mb-1.5">
            Rejoignez la communauté
          </h3>
          <p className="text-ink-2 text-xs mb-3">
            Avec votre compte lerevenu.com, gratuitement.
          </p>
          <ul className="text-xs text-ink-2 flex flex-col gap-1.5 mb-4">
            <li className="flex items-start gap-1.5">
              <Icon name="check" className="text-brand w-4 h-4 flex-none mt-0.5" />
              <span>Posez vos questions d'argent aux lecteurs</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Icon name="check" className="text-brand w-4 h-4 flex-none mt-0.5" />
              <span>Recevez les réponses de la rédaction</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Icon name="check" className="text-brand w-4 h-4 flex-none mt-0.5" />
              <span>Gagnez des points et des badges</span>
            </li>
          </ul>
          <button
            type="button"
            className="btn btn-primary btn-block text-xs"
            onClick={() => setMode('member')}
          >
            Rejoindre la communauté
          </button>
        </section>
      )}

      {/* 2. Question of the week */}
      <section className="card">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-text mb-2">
          <Icon name="star" className="w-4 h-4" />
          Question de la semaine
        </div>
        <h3 className="font-display text-base font-bold leading-snug cursor-pointer hover:text-brand-text">
          <Link href="/discussions/question-de-la-semaine-meilleur-conseil-argent">
            Quel est le meilleur conseil d'argent que vous ayez reçu ?
          </Link>
        </h3>
        <div className="text-xs text-ink-3 my-2 flex items-center gap-2">
          <span>5 réponses · posée par la rédaction</span>
        </div>
        <Link
          href="/discussions/question-de-la-semaine-meilleur-conseil-argent"
          className="btn btn-secondary btn-sm"
        >
          Je réponds
        </Link>
      </section>

      {/* 3. Poll of the week */}
      <section className="card">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-text mb-2">
          <Icon name="chart" className="w-4 h-4" />
          Sondage de la semaine
        </div>
        <h3 className="font-display text-sm font-bold leading-snug mb-3">
          Quel est votre placement prioritaire pour les 12 prochains mois ?
        </h3>

        <div className="flex flex-col gap-2">
          {pollOptions.map((opt, i) => {
            const votes = opt.votes + (pollVote === i ? 1 : 0);
            const pct = Math.round((votes / totalVotes) * 100);
            const isSelected = pollVote === i;

            return (
              <button
                key={i}
                type="button"
                onClick={() => handlePollVote(i)}
                className={`relative flex items-center justify-between p-2 rounded-lg border text-xs font-medium overflow-hidden transition-all text-left ${
                  pollVote !== null ? 'bg-fill border-transparent' : 'bg-surface border-line hover:border-brand'
                }`}
              >
                {pollVote !== null && (
                  <span
                    className={`absolute inset-0 right-auto h-full ${isSelected ? 'bg-brand/20' : 'bg-black/5'}`}
                    style={{ width: `${pct}%` }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5 truncate">
                  {isSelected && <Icon name="check" className="w-3.5 h-3.5 text-brand" />}
                  {opt.label}
                </span>
                {pollVote !== null && (
                  <b className="relative z-10 num text-xs">{pct} %</b>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-ink-3 mt-2">
          {totalVotes} votes · {pollVote !== null ? 'Vote enregistré' : 'Votez pour voir les résultats'}
        </p>
      </section>

      {/* 4. Live events */}
      <section className="card">
        <h2 className="card-title">
          <Icon name="cal" />
          Le Revenu répond en direct
        </h2>
        <div className="flex gap-3 items-start border-t border-line pt-3">
          <div className="text-center rounded-lg border border-line bg-surface overflow-hidden flex-none w-11 shadow-sm">
            <small className="block text-[10px] uppercase font-bold text-white bg-brand py-0.5">
              JEU
            </small>
            <b className="num text-base font-bold">14</b>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold leading-snug truncate">
              Assurance-vie : arbitrer en 2026
            </h4>
            <p className="text-[11px] text-ink-3 mt-0.5 mb-2">18h30 · La rédaction</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={`btn btn-sm text-xs ${eventRsvp ? 'bg-ok-soft text-ok' : 'btn-secondary'}`}
                onClick={handleRsvp}
              >
                {eventRsvp ? 'Inscrit' : 'Je participe'}
              </button>
              <span className="text-[11px] text-ink-3">142 participants</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Top contributors of the month */}
      <section className="card">
        <h2 className="card-title">
          <Icon name="trophy" />
          Top du mois
          <Link href="/leaderboard" className="more">
            Classement
          </Link>
        </h2>
        <div className="flex flex-col gap-2">
          {[
            { rank: 1, name: 'Vincent_ETF', role: 'Vincent', pts: '+148' },
            { rank: 2, name: 'PapyBoursier', role: 'Papy Boursier', pts: '+121' },
            { rank: 3, name: 'Odile.Retraite', role: 'Odile', pts: '+97' },
            { rank: 4, name: 'Nadia.Patrimoine', role: 'Nadia', pts: '+84' },
            { rank: 5, name: 'Camille_B', role: 'Camille', pts: '+64' },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-2.5 text-xs py-1">
              <span className={`w-4 text-center font-bold ${item.rank <= 3 ? 'text-accent' : 'text-ink-3'}`}>
                {item.rank}
              </span>
              <Avatar user={{ username: item.name, name: item.role }} size="sm" link />
              <Link href={`/profile/${item.name}`} className="flex-1 truncate font-semibold hover:underline">
                {item.role}
              </Link>
              <span className="num font-bold text-accent">{item.pts}</span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
