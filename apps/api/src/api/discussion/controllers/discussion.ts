import { factories } from '@strapi/strapi';
import slugify from 'slugify';

export default factories.createCoreController('api::discussion.discussion', ({ strapi }) => ({
  /**
   * Custom create controller to enforce:
   * 1. Authentication check (401)
   * 2. Author derivation from authenticated context (anti-impersonation)
   * 3. Business validations (title >= 10 chars, non-empty content, valid category)
   * 4. Slug generation
   * 5. Points awarding (+5 points to discussion author)
   */
  async create(ctx: any) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Vous devez être connecté pour publier une discussion.');
    }

    const bodyData = ctx.request.body?.data || ctx.request.body || {};
    const { title, content, type = 'question', category, poll_options } = bodyData;

    // Server-side validation
    if (!title || typeof title !== 'string' || title.trim().length < 10) {
      return ctx.badRequest('Le titre doit contenir au moins 10 caractères.');
    }

    if (!content || typeof content !== 'string' || content.trim().length < 2) {
      return ctx.badRequest('Le contenu de la discussion est obligatoire.');
    }

    if (!category) {
      return ctx.badRequest("L'espace (catégorie) est obligatoire.");
    }

    // Verify category exists
    let categoryRecord: any;
    try {
      if (typeof category === 'object' && (category.id || category.documentId)) {
        categoryRecord = await strapi.documents('api::category.category').findOne({
          documentId: category.documentId || category.id,
        });
      } else {
        categoryRecord = await strapi.documents('api::category.category').findFirst({
          filters: {
            $or: [
              { documentId: String(category) },
              { slug: String(category) },
              ...(typeof category === 'number' || !isNaN(Number(category)) ? [{ id: Number(category) }] : []),
            ],
          } as any,
        });
      }
    } catch {
      // fallback
    }

    if (!categoryRecord) {
      return ctx.badRequest("L'espace (catégorie) sélectionné n'existe pas.");
    }

    // Generate unique slug
    const baseSlug = slugify(title, { lower: true, strict: true, trim: true }) || 'discussion';
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await strapi.documents('api::discussion.discussion').findFirst({
        filters: { slug: uniqueSlug },
      });
      if (!existing) break;
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    // Create discussion with strictly derived author (anti-impersonation)
    const newDiscussion = await strapi.documents('api::discussion.discussion').create({
      data: {
        title: title.trim(),
        slug: uniqueSlug,
        content: content.trim(),
        type: ['question', 'discussion', 'poll'].includes(type) ? type : 'question',
        category: categoryRecord.documentId || categoryRecord.id,
        author: user.documentId || user.id,
        views: 0,
        likes: 0,
        pinned: false,
        featured: 'none',
        poll_options: Array.isArray(poll_options) ? poll_options : undefined,
      } as any,
      populate: ['category', 'author'],
    });

    // Award +5 points to author
    try {
      const currentPoints = user.points || 0;
      await (strapi.documents('plugin::users-permissions.user') as any).update({
        documentId: user.documentId || user.id,
        data: {
          points: currentPoints + 5,
        },
      });
    } catch (err) {
      strapi.log.error('Erreur lors de l attribution des points de discussion:', err);
    }

    return ctx.created({ data: newDiscussion });
  },

  /**
   * Set solution (best answer) for a discussion:
   * Restricted to the author of the discussion or redaction/admin.
   */
  async solution(ctx: any) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Vous devez être connecté.');
    }

    const { id } = ctx.params;
    const { replyId } = ctx.request.body || {};

    if (!replyId) {
      return ctx.badRequest('replyId est obligatoire.');
    }

    // Find discussion
    const discussion: any = await strapi.documents('api::discussion.discussion').findFirst({
      filters: {
        $or: [
          { documentId: String(id) },
          { slug: String(id) },
          ...(typeof id === 'number' || !isNaN(Number(id)) ? [{ id: Number(id) }] : []),
        ],
      } as any,
      populate: ['author', 'solution'],
    });

    if (!discussion) {
      return ctx.notFound('Discussion introuvable.');
    }

    // Verify ownership
    const isAuthor = (discussion.author?.id === user.id) || (discussion.author?.documentId === user.documentId);
    const isStaff = user.role?.type === 'redaction' || user.role?.type === 'admin';

    if (!isAuthor && !isStaff) {
      return ctx.forbidden("Seul l'auteur de la question peut choisir la meilleure réponse.");
    }

    // Find reply
    const reply: any = await strapi.documents('api::reply.reply').findFirst({
      filters: {
        $or: [
          { documentId: String(replyId) },
          ...(typeof replyId === 'number' || !isNaN(Number(replyId)) ? [{ id: Number(replyId) }] : []),
        ],
      } as any,
      populate: ['author', 'discussion'],
    });

    if (!reply) {
      return ctx.notFound('Réponse introuvable.');
    }

    // Verify reply belongs to this discussion
    const replyDiscussionId = reply.discussion?.id || reply.discussion?.documentId;
    const discId = discussion.id || discussion.documentId;
    if (replyDiscussionId !== discId && reply.discussion?.slug !== discussion.slug) {
      return ctx.badRequest('Cette réponse n appartient pas à cette discussion.');
    }

    // Update discussion solution
    const updated = await strapi.documents('api::discussion.discussion').update({
      documentId: discussion.documentId,
      data: {
        solution: reply.documentId || reply.id,
      } as any,
      populate: ['solution', 'category', 'author'],
    });

    // Award +20 points to reply author if set
    if (reply.author) {
      try {
        const replyAuthor: any = await strapi.documents('plugin::users-permissions.user').findOne({
          documentId: reply.author.documentId || reply.author.id,
        });
        if (replyAuthor) {
          await (strapi.documents('plugin::users-permissions.user') as any).update({
            documentId: replyAuthor.documentId,
            data: {
              points: (replyAuthor.points || 0) + 20,
            },
          });
        }
      } catch (err) {
        strapi.log.error('Erreur points solution:', err);
      }
    }

    return ctx.send({ data: updated });
  },

  /**
   * Positive vote (Utile / Like / Unlike)
   */
  async like(ctx: any) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Vous devez être connecté.');
    }

    const { id } = ctx.params;
    const bodyData = ctx.request.body?.data || ctx.request.body || {};
    const isUnlike = bodyData.action === 'unlike';
    const delta = isUnlike ? -1 : 1;

    const discussion: any = await strapi.documents('api::discussion.discussion').findFirst({
      filters: {
        $or: [
          { documentId: String(id) },
          { slug: String(id) },
          ...(typeof id === 'number' || !isNaN(Number(id)) ? [{ id: Number(id) }] : []),
        ],
      } as any,
      populate: ['author'],
    });

    if (!discussion) {
      return ctx.notFound('Discussion introuvable.');
    }

    const isOwn = (discussion.author?.id === user.id) || (discussion.author?.documentId === user.documentId);
    if (isOwn) {
      return ctx.badRequest('Vous ne pouvez pas voter pour votre propre message.');
    }

    const newLikes = Math.max(0, (discussion.likes || 0) + delta);
    const updated = await strapi.documents('api::discussion.discussion').update({
      documentId: discussion.documentId,
      data: {
        likes: newLikes,
      } as any,
    });

    // Update discussion author points (+5 on like, -5 on unlike)
    if (discussion.author) {
      try {
        const author: any = await strapi.documents('plugin::users-permissions.user').findOne({
          documentId: discussion.author.documentId,
        });
        if (author) {
          const authorPoints = Math.max(0, (author.points || 0) + (isUnlike ? -5 : 5));
          await (strapi.documents('plugin::users-permissions.user') as any).update({
            documentId: author.documentId,
            data: { points: authorPoints },
          });
        }
      } catch (err) {
        // ignore
      }
    }

    // Award +1 point to voter for participating (-1 on unlike)
    try {
      const voter: any = await strapi.documents('plugin::users-permissions.user').findOne({
        documentId: user.documentId || user.id,
      });
      if (voter) {
        const voterPoints = Math.max(0, (voter.points || 0) + (isUnlike ? -1 : 1));
        await (strapi.documents('plugin::users-permissions.user') as any).update({
          documentId: voter.documentId,
          data: { points: voterPoints },
        });
      }
    } catch (err) {
      // ignore
    }

    return ctx.send({ data: updated });
  },

  /**
   * Vote on a poll option
   */
  async pollVote(ctx: any) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Vous devez être connecté pour voter.');
    }

    const { id } = ctx.params;
    const bodyData = ctx.request.body?.data || ctx.request.body || {};
    const { optionIndex } = bodyData;

    if (optionIndex === undefined || typeof optionIndex !== 'number') {
      return ctx.badRequest('optionIndex est obligatoire.');
    }

    const discussion: any = await strapi.documents('api::discussion.discussion').findFirst({
      filters: {
        $or: [
          { documentId: String(id) },
          { slug: String(id) },
          ...(typeof id === 'number' || !isNaN(Number(id)) ? [{ id: Number(id) }] : []),
        ],
      } as any,
    });

    if (!discussion) {
      return ctx.notFound('Discussion introuvable.');
    }

    const pollOptions = discussion.poll_options;
    if (!Array.isArray(pollOptions) || pollOptions.length <= optionIndex || optionIndex < 0) {
      return ctx.badRequest('Option de sondage invalide.');
    }

    // Increment votes for the selected option
    const updatedOptions = pollOptions.map((opt: any, idx: number) => {
      if (idx === optionIndex) {
        return { ...opt, votes: (opt.votes || 0) + 1 };
      }
      return opt;
    });

    const updated = await strapi.documents('api::discussion.discussion').update({
      documentId: discussion.documentId,
      data: {
        poll_options: updatedOptions,
      } as any,
    });

    // Award +1 point to voter for participating in the poll
    try {
      const voter: any = await strapi.documents('plugin::users-permissions.user').findOne({
        documentId: user.documentId || user.id,
      });
      if (voter) {
        await (strapi.documents('plugin::users-permissions.user') as any).update({
          documentId: voter.documentId,
          data: { points: (voter.points || 0) + 1 },
        });
      }
    } catch {
      // ignore
    }

    return ctx.send({ data: updated });
  },
}));
