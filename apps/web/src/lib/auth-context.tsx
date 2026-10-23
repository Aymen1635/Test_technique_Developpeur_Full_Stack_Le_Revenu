'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { getApiUrl, login, getMe } from '@/lib/api';
import { DEMO_USERS, DemoUserOption } from '@/lib/demo-users';

export { DEMO_USERS };
export type { DemoUserOption };

interface AuthContextType {
  user: User | null;
  token: string | null;
  mode: 'visitor' | 'member';
  demoUsers: DemoUserOption[];
  setMode: (mode: 'visitor' | 'member') => void;
  loginAs: (username: string) => Promise<string | null>;
  ensureToken: () => Promise<string | null>;
  addPoints: (delta: number) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  mode: 'visitor',
  demoUsers: DEMO_USERS,
  setMode: () => {},
  loginAs: async () => null,
  ensureToken: async () => null,
  addPoints: () => {},
  refreshUser: async () => {},
  logout: () => {},
  isLoading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mode, setModeState] = useState<'visitor' | 'member'>('visitor');
  const [demoUsers, setDemoUsers] = useState<DemoUserOption[]>(DEMO_USERS);
  const [isLoading, setIsLoading] = useState(false);

  // Sync all Strapi users dynamically into demo switcher
  useEffect(() => {
    fetch(`${getApiUrl()}/api/users`)
      .then((r) => (r.ok ? r.json() : []))
      .then((usersList) => {
        if (Array.isArray(usersList) && usersList.length > 0) {
          const presetMap = new Map(DEMO_USERS.map((d) => [d.username.toLowerCase(), d]));
          const fullList: DemoUserOption[] = usersList.map((u) => {
            const preset = presetMap.get(u.username?.toLowerCase());
            if (preset) {
              return {
                ...preset,
                points: typeof u.points === 'number' ? u.points : preset.points,
                name: u.name || preset.name,
                role: u.role_title || preset.role,
              };
            }
            return {
              username: u.username,
              name: u.name || u.username.replace(/_/g, ' '),
              email: u.email || `${u.username.toLowerCase()}@exemple.fr`,
              role: u.role_title || (u.is_pro ? 'Professionnel' : 'Membre'),
              points: typeof u.points === 'number' ? u.points : 0,
              is_subscriber: !!u.is_subscriber,
              avatar_color: u.avatar_color || 'var(--av-1)',
              bio: u.bio || '',
            };
          });
          setDemoUsers(fullList);
        }
      })
      .catch(() => {});
  }, []);

  const addPoints = (delta: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newPoints = Math.max(0, (prev.points || 0) + delta);
      const updated = { ...prev, points: newPoints };
      if (typeof window !== 'undefined') {
        localStorage.setItem('lr_user', JSON.stringify(updated));
      }
      setDemoUsers((prevList) =>
        prevList.map((u) => (u.username === prev.username ? { ...u, points: newPoints } : u))
      );
      return updated;
    });
  };

  const refreshUser = async () => {
    const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem('lr_token') : null);
    if (!currentToken) return;
    try {
      const me = await getMe(currentToken);
      if (me) {
        setUser((prev) => {
          if (!prev) return me;
          const merged = { ...prev, ...me, points: typeof me.points === 'number' ? me.points : prev.points };
          if (typeof window !== 'undefined') {
            localStorage.setItem('lr_user', JSON.stringify(merged));
          }
          return merged;
        });
      }
    } catch {
      // ignore
    }
  };

  const loginAs = async (username: string): Promise<string | null> => {
    setIsLoading(true);
    const demo = demoUsers.find((u) => u.username === username) || DEMO_USERS.find((u) => u.username === username) || DEMO_USERS[0];

    try {
      // Authenticate with Strapi using seeded credentials
      const res = await login(demo.username || demo.email, 'Password123!');
      const mergedUser: User = {
        ...demo,
        ...res.user,
        name: demo.name,
        role_title: res.user.role_title || demo.role,
        points: typeof res.user.points === 'number' ? res.user.points : demo.points,
        bio: res.user.bio || demo.bio,
        is_subscriber: res.user.is_subscriber ?? demo.is_subscriber,
        avatar_color: res.user.avatar_color || demo.avatar_color,
      };

      setUser(mergedUser);
      setToken(res.jwt);
      setModeState('member');

      if (typeof window !== 'undefined') {
        localStorage.setItem('lr_token', res.jwt);
        localStorage.setItem('lr_user', JSON.stringify(mergedUser));
        localStorage.setItem('lr_mode', 'member');
      }

      return res.jwt;
    } catch (err) {
      console.warn('Authentification Strapi échouée pour', demo.email, err);
      setUser(null);
      setToken(null);
      setModeState('visitor');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lr_token');
        localStorage.removeItem('lr_user');
        localStorage.setItem('lr_mode', 'visitor');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const ensureToken = async (): Promise<string | null> => {
    if (token && !token.startsWith('mock_')) {
      return token;
    }

    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('lr_token');
      if (savedToken && !savedToken.startsWith('mock_')) {
        setToken(savedToken);
        return savedToken;
      }
    }

    // Authenticate automatically with default demo profile
    return await loginAs(user?.username || 'Camille_B');
  };

  // Load saved session or initialize default demo user on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedToken = localStorage.getItem('lr_token');
    const savedUser = localStorage.getItem('lr_user');
    const savedMode = localStorage.getItem('lr_mode') as 'visitor' | 'member' | null;

    // Purge any stale mock token from earlier runs
    if (savedToken && savedToken.startsWith('mock_')) {
      localStorage.removeItem('lr_token');
      localStorage.removeItem('lr_user');
      loginAs('Camille_B');
      return;
    }

    if (savedToken && savedUser && savedMode === 'member') {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setModeState('member');
        return;
      } catch {
        // ignore JSON parse error
      }
    }

    // If visitor mode was explicitly selected, keep visitor
    if (savedMode === 'visitor') {
      setUser(null);
      setToken(null);
      setModeState('visitor');
      return;
    }

    // Default to active member Camille_B for immediate evaluation
    loginAs('Camille_B');
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    setModeState('visitor');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lr_token');
      localStorage.removeItem('lr_user');
      localStorage.setItem('lr_mode', 'visitor');
    }
  };

  const setMode = (newMode: 'visitor' | 'member') => {
    if (newMode === 'visitor') {
      logout();
    } else {
      loginAs('Camille_B');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        mode,
        demoUsers,
        setMode,
        loginAs,
        ensureToken,
        addPoints,
        refreshUser,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
