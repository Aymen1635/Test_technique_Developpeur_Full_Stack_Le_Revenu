import React from 'react';
import { notFound } from 'next/navigation';
import { SideNav } from '@/components/layout/side-nav';
import { Avatar } from '@/components/ui/avatar';
import { UserBadges, getUserLevel } from '@/components/ui/user-badge';
import { Icon } from '@/components/ui/icons';
import { getDiscussions, getUserByUsername } from '@/lib/api';
import { DEMO_USERS } from '@/lib/demo-users';
import { ProfileDiscussions } from '@/components/profile/profile-discussions';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  return {
    title: `Profil de @${username} - Communauté Le Revenu`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  // Fetch real user data from Strapi
  const [profileUser, res] = await Promise.all([
    getUserByUsername(username),
    getDiscussions({ page: 1, pageSize: 50 }),
  ]);

  const demoFallback = DEMO_USERS.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  const displayName =
    profileUser?.name ||
    demoFallback?.name ||
    (username === 'LaRedaction' ? 'La Rédaction' : username.replace(/_/g, ' '));

  const roleTitle = profileUser?.role_title || demoFallback?.role || 'Membre actif';
  const bio = profileUser?.bio || demoFallback?.bio || 'Membre de la communauté Le Revenu.';
  const points = profileUser?.points ?? demoFallback?.points ?? 0;
  const avatarColor = profileUser?.avatar_color || demoFallback?.avatar_color || 'var(--av-1)';
  const isSubscriber = profileUser?.is_subscriber ?? demoFallback?.is_subscriber ?? false;

  const allDiscussions = res?.data || [];
  const userDiscussions = allDiscussions.filter(
    (d) => d.author?.username?.toLowerCase() === username.toLowerCase()
  );

  const userHelpfulCount = userDiscussions.reduce((acc, d) => acc + (d.likes || 0), 0);

  return (
    <div className="layout no-right">
      <SideNav />

      <main className="main max-w-3xl">
        <section className="card p-6 flex flex-wrap items-center gap-5">
          <Avatar
            user={{
              username,
              name: displayName,
              avatar_color: avatarColor,
              role_title: roleTitle,
              is_subscriber: isSubscriber,
            }}
            size="xl"
          />

          <div className="flex-1 min-w-[200px]">
            <h1 className="font-display text-2xl font-bold mb-0.5">{displayName}</h1>
            <div className="text-xs text-ink-3 mb-2">@{username}</div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <UserBadges user={{ id: profileUser?.id || 1, username, email: '', points, is_subscriber: isSubscriber }} />
              <span className="text-xs text-ink-3">· {roleTitle}</span>
            </div>
            <p className="text-xs text-ink-2 max-w-md">
              {bio}
            </p>
          </div>
        </section>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card text-center p-3">
            <b className="num text-xl font-bold text-accent block">{points}</b>
            <small className="text-xs text-ink-3">points</small>
          </div>
          <div className="card text-center p-3">
            <b className="num text-xl font-bold block">{userDiscussions.length}</b>
            <small className="text-xs text-ink-3">discussions</small>
          </div>
          <div className="card text-center p-3">
            <b className="num text-xl font-bold block">{Math.max(1, Math.floor(points / 25))}</b>
            <small className="text-xs text-ink-3">réponses</small>
          </div>
          <div className="card text-center p-3">
            <b className="num text-xl font-bold block">{userHelpfulCount}</b>
            <small className="text-xs text-ink-3">« Utile » reçus</small>
          </div>
        </div>

        {/* User discussions */}
        <section className="flex flex-col gap-3">
          <h2 className="section-title text-lg font-bold">Discussions publiées</h2>
          <ProfileDiscussions discussions={userDiscussions} />
        </section>
      </main>
    </div>
  );
}
