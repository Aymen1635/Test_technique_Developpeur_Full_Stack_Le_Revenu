import React from 'react';
import { notFound } from 'next/navigation';
import { getDiscussions, getCategories, getCategoryBySlug } from '@/lib/api';
import { SideNav } from '@/components/layout/side-nav';
import { STATIC_CATEGORIES } from '@/lib/constants';
import { Icon } from '@/components/ui/icons';
import { DiscussionFeed } from '@/components/feed/discussion-feed';
import { SidebarWidgets } from '@/components/widgets/sidebar-widgets';
import { QuickComposer } from '@/components/composer/quick-composer';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = (await getCategoryBySlug(slug)) || STATIC_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return { title: 'Espace introuvable' };

  return {
    title: `${category.name} - Communauté Le Revenu`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [category, discussionsRes, categoriesRes] = await Promise.all([
    getCategoryBySlug(slug).then((res) => res || STATIC_CATEGORIES.find((c) => c.slug === slug)),
    getDiscussions({ category: slug, page: 1, pageSize: 25 }),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const discussions = discussionsRes?.data || [];
  const categories = Array.isArray(categoriesRes) && categoriesRes.length > 0 ? categoriesRes : STATIC_CATEGORIES;

  return (
    <div className="layout">
      <SideNav categories={categories} />

      <main className="main">
        <section className="card p-6 flex flex-wrap items-center gap-4 bg-surface shadow-sm">
          <span
            className="sp-ic lg"
            style={{ '--c': category.color || '#eb0f0f' } as React.CSSProperties}
          >
            <Icon name={category.icon || 'globe'} className="w-7 h-7" />
          </span>

          <div className="flex-1 min-w-[200px]">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              {category.name}
            </h1>
            <p className="text-ink-2 text-sm mt-1 max-w-xl">{category.description}</p>
            <div className="flex gap-4 text-xs text-ink-3 mt-2">
              <span>
                <b className="num text-ink">{discussions.length}</b> discussions
              </span>
              <span>
                <b className="num text-ink">
                  {discussions.reduce((acc, d) => acc + (d.replies?.length || 0), 0)}
                </b>{' '}
                réponses
              </span>
            </div>
          </div>
        </section>

        <QuickComposer defaultCategory={category.slug} />

        <DiscussionFeed
          initialDiscussions={discussions}
          categorySlug={category.slug}
        />
      </main>

      <SidebarWidgets categorySlug={category.slug} />
    </div>
  );
}
