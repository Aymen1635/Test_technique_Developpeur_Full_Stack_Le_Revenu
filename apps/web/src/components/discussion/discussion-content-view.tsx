'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Discussion, Reply } from '@/types';
import { Icon } from '@/components/ui/icons';
import { DiscussionHeader } from './discussion-header';
import { BestAnswerCallout } from './best-answer-callout';
import { ReplyCard } from './reply-card';
import { ReplyForm } from './reply-form';

export function DiscussionContentView({ initialDiscussion }: { initialDiscussion: Discussion }) {
  const [discussion, setDiscussion] = useState<Discussion>(initialDiscussion);
  const [replies, setReplies] = useState<Reply[]>(initialDiscussion.replies || []);
  const [solutionId, setSolutionId] = useState<number | null>(
    initialDiscussion.solution?.id || null
  );

  const solutionReply = replies.find((r) => r.id === solutionId) || initialDiscussion.solution;

  const handleReplyAdded = (newReply: Reply) => {
    setReplies((prev) => [...prev, newReply]);
  };

  const handleSolutionSelected = (replyId: number) => {
    setSolutionId((prev) => (prev === replyId ? null : replyId));
  };

  return (
    <div className="flex flex-col gap-5">
      <nav className="crumbs" aria-label="Fil d'Ariane">
        <Link href="/" className="hover:text-ink">
          Accueil
        </Link>
        <Icon name="chev" className="w-3.5 h-3.5" />
        {discussion.category && (
          <Link href={`/spaces/${discussion.category.slug}`} className="hover:text-ink">
            {discussion.category.name}
          </Link>
        )}
      </nav>

      <DiscussionHeader discussion={discussion} />

      {solutionReply && <BestAnswerCallout solution={solutionReply} />}

      <section className="replies" aria-label="Réponses">
        <h2 className="section-title">
          {replies.length > 0
            ? `${replies.length} réponse${replies.length > 1 ? 's' : ''}`
            : "Aucune réponse pour l'instant"}
        </h2>

        {replies.map((reply) => (
          <ReplyCard
            key={reply.id}
            reply={reply}
            discussion={discussion}
            isSolution={reply.id === solutionId}
            onSolutionSelected={handleSolutionSelected}
          />
        ))}

        <ReplyForm
          discussion={discussion}
          onReplyAdded={handleReplyAdded}
        />
      </section>
    </div>
  );
}
