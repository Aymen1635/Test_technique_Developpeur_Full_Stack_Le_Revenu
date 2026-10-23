import React from 'react';
import { notFound } from 'next/navigation';
import { getDiscussionBySlug, getCategories } from '@/lib/api';
import { SideNav } from '@/components/layout/side-nav';
import { STATIC_CATEGORIES } from '@/lib/constants';
import { DiscussionContentView } from '@/components/discussion/discussion-content-view';
import { Avatar } from '@/components/ui/avatar';
import { formatAgo } from '@/lib/date-utils';

export const dynamic = 'force-dynamic';

interface DiscussionDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: DiscussionDetailPageProps) {
  const { slug } = await params;
  const discussion = await getDiscussionBySlug(slug);
  if (!discussion) return { title: 'Discussion introuvable' };

  return {
    title: `${discussion.title} - Communauté Le Revenu`,
    description: discussion.content.slice(0, 160),
  };
}

export default async function DiscussionDetailPage({ params }: DiscussionDetailPageProps) {
  const { slug } = await params;

  const [discussion, categoriesRes] = await Promise.all([
    getDiscussionBySlug(slug),
    getCategories(),
  ]);

  if (!discussion) {
    notFound();
  }

  const categories = Array.isArray(categoriesRes) && categoriesRes.length > 0 ? categoriesRes : STATIC_CATEGORIES;
  const participants = Array.from(
    new Set([discussion.author?.username, ...(discussion.replies?.map((r) => r.author?.username) || [])])
  ).filter(Boolean);

  return (
    <div className="layout">
      <SideNav categories={categories} />

      <main className="main">
        <DiscussionContentView initialDiscussion={discussion} />
      </main>

      <aside className="right">
        {/* Facts Card */}
        <section className="card">
          <h2 className="card-title">Cette discussion</h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <small className="text-ink-3 block">Réponses</small>
              <b className="num text-base">{discussion.replies?.length || 0}</b>
            </div>
            <div>
              <small className="text-ink-3 block">Utile</small>
              <b className="num text-base font-bold text-accent">
                {(discussion.likes || 0) +
                  (discussion.replies?.reduce((acc, r) => acc + (r.likes || 0), 0) || 0)}
              </b>
            </div>
            <div>
              <small className="text-ink-3 block">Vues</small>
              <b className="num text-base">{discussion.views || 0}</b>
            </div>
            <div>
              <small className="text-ink-3 block">Publication</small>
              <b className="text-xs font-semibold">{formatAgo(discussion.createdAt)}</b>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-line">
            <small className="text-ink-3 block mb-1.5 font-medium">Participants</small>
            <div className="flex -space-x-1.5">
              {participants.slice(0, 6).map((username) => (
                <Avatar key={username} user={{ username: username as string }} size="sm" link />
              ))}
            </div>
          </div>
        </section>

        {/* Space info card */}
        {discussion.category && (
          <section className="card">
            <h3 className="font-display font-bold text-base mb-1">
              {discussion.category.name}
            </h3>
            <p className="text-xs text-ink-2 mb-3">{discussion.category.description}</p>
            <a
              href={`https://www.lerevenu.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-text font-semibold hover:underline block"
            >
              Voir la rubrique sur lerevenu.com →
            </a>
          </section>
        )}
      </aside>
    </div>
  );
}
