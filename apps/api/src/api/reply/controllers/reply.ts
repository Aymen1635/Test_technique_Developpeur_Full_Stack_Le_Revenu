import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::reply.reply', ({ strapi }) => ({
  /**
   * Custom reply creation:
   * 1. Check authentication (401)
   * 2. Author derivation from authenticated context (anti-impersonation)
   * 3. Validate content and discussion existence (404 if missing)
   * 4. Award +3 points to author
   */
  async create(ctx: any) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Vous devez être connecté pour publier une réponse.');
    }

    const bodyData = ctx.request.body?.data || ctx.request.body || {};
    const { content, discussion } = bodyData;

    if (!content || typeof content !== 'string' || content.trim().length < 2) {
      return ctx.badRequest('Le contenu de la réponse est obligatoire.');
    }

    if (!discussion) {
      return ctx.badRequest('La discussion liée est obligatoire.');
    }

    // Verify discussion exists
    let discussionRecord: any;
    try {
      if (typeof discussion === 'object' && (discussion.id || discussion.documentId)) {
        discussionRecord = await strapi.documents('api::discussion.discussion').findOne({
          documentId: discussion.documentId || discussion.id,
        });
      } else {
        discussionRecord = await strapi.documents('api::discussion.discussion').findFirst({
          filters: {
            $or: [
              { documentId: String(discussion) },
              { slug: String(discussion) },
              ...(typeof discussion === 'number' || !isNaN(Number(discussion)) ? [{ id: Number(discussion) }] : []),
            ],
          } as any,
        });
      }
    } catch {
      // fallback
    }

    if (!discussionRecord) {
      return ctx.notFound('Discussion introuvable.');
    }

    // Create reply with strictly enforced author
    const newReply = await strapi.documents('api::reply.reply').create({
      data: {
        content: content.trim(),
        likes: 0,
        verified: false,
        discussion: discussionRecord.documentId || discussionRecord.id,
        author: user.documentId || user.id,
      } as any,
      populate: ['author', 'discussion'],
    });

    // Award +3 points to author
    try {
      const currentPoints = user.points || 0;
      await (strapi.documents('plugin::users-permissions.user') as any).update({
        documentId: user.documentId || user.id,
        data: {
          points: currentPoints + 3,
        },
      });
    } catch (err) {
      strapi.log.error('Erreur points réponse:', err);
    }

    return ctx.created({ data: newReply });
  },
}));
