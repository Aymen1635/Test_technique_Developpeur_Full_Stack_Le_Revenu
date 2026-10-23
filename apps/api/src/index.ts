import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      // Setup default role permissions
      const roles = await strapi.db.query('plugin::users-permissions.role').findMany();
      const publicRole = roles.find((r: any) => r.type === 'public');
      const authenticatedRole = roles.find((r: any) => r.type === 'authenticated');

      const publicActions = [
        'api::category.category.find',
        'api::category.category.findOne',
        'api::discussion.discussion.find',
        'api::discussion.discussion.findOne',
        'api::reply.reply.find',
        'api::reply.reply.findOne',
        'plugin::users-permissions.user.find',
        'plugin::users-permissions.user.findOne',
      ];

      const authenticatedActions = [
        ...publicActions,
        'api::discussion.discussion.create',
        'api::discussion.discussion.solution',
        'api::discussion.discussion.like',
        'api::discussion.discussion.pollVote',
        'api::reply.reply.create',
        'plugin::users-permissions.user.me',
      ];

      // Helper to grant permissions via low-level query engine
      const grantPermissions = async (role: any, actions: string[]) => {
        if (!role) return;

        const roleWithPerms = await strapi.db.query('plugin::users-permissions.role').findOne({
          where: { id: role.id },
          populate: ['permissions'],
        });

        const currentActionNames = new Set(
          (roleWithPerms?.permissions || []).map((p: any) => p.action)
        );

        for (const action of actions) {
          if (!currentActionNames.has(action)) {
            await strapi.db.query('plugin::users-permissions.permission').create({
              data: {
                action,
                role: role.id,
              },
            });
          }
        }
      };

      if (publicRole) {
        await grantPermissions(publicRole, publicActions);
      }

      if (authenticatedRole) {
        await grantPermissions(authenticatedRole, authenticatedActions);
      }
    } catch (err) {
      strapi.log.warn('Could not auto-configure users-permissions roles:', err);
    }
  },
};
