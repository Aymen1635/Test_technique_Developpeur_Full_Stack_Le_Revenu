'use client';

import React from 'react';
import { useAuth, DEMO_USERS } from '@/lib/auth-context';

export function DemoUserBar() {
  const { mode, setMode, user, loginAs, logout, demoUsers } = useAuth();

  return (
    <div className="proto">
      <div className="wrap">
        <span className="proto-label">
          <b>Démo</b>Données Strapi v5
        </span>

        <span className="seg" role="group" aria-label="Point de vue">
          <button
            type="button"
            className={mode === 'visitor' ? 'on' : ''}
            onClick={() => setMode('visitor')}
          >
            Visiteur
          </button>
          <button
            type="button"
            className={mode === 'member' ? 'on' : ''}
            onClick={() => setMode('member')}
          >
            Membre actif
          </button>
        </span>

        {mode === 'member' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="opacity-75">Connecté en tant que :</span>
            <select
              value={user?.username || 'Camille_B'}
              onChange={(e) => loginAs(e.target.value)}
              className="bg-black/20 text-white rounded px-2 py-0.5 border border-white/20 text-xs outline-none"
            >
              {demoUsers.map((u) => (
                <option key={u.username} value={u.username} className="bg-[#1c1c1e] text-white">
                  {u.name} ({u.role} - {u.points} pts)
                </option>
              ))}
            </select>
          </div>
        )}

        <span className="flex-1" />

        <div className="flex items-center gap-3 text-xs opacity-80">
          <span>API: Next.js SSR + Strapi v5 REST</span>
          {mode === 'member' && (
            <button
              onClick={logout}
              className="underline hover:text-white"
            >
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
