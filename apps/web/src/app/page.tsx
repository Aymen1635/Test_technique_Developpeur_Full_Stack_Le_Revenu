import React from 'react';
import { getDiscussions, getCategories } from '@/lib/api';
import { SideNav } from '@/components/layout/side-nav';
import { STATIC_CATEGORIES } from '@/lib/constants';
import { HeroBanner } from '@/components/feed/hero-banner';
import { QuickComposer } from '@/components/composer/quick-composer';
import { CategoryChipScroller } from '@/components/feed/category-chip-scroller';
import { DiscussionFeed } from '@/components/feed/discussion-feed';
import { SidebarWidgets } from '@/components/widgets/sidebar-widgets';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [discussionsRes, categoriesRes] = await Promise.all([
    getDiscussions({ page: 1, pageSize: 20 }),
    getCategories(),
  ]);

  const discussions = discussionsRes?.data || [];
  const categories = Array.isArray(categoriesRes) && categoriesRes.length > 0 ? categoriesRes : STATIC_CATEGORIES;

  return (
    <div className="layout">
      <SideNav categories={categories} />

      <main className="main" id="main">
        <HeroBanner />
        <QuickComposer />
        <CategoryChipScroller />
        <DiscussionFeed initialDiscussions={discussions} />
      </main>

      <SidebarWidgets />
    </div>
  );
}
