import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import discussionControllerModule from '../src/api/discussion/controllers/discussion';
import replyControllerModule from '../src/api/reply/controllers/reply';

const { createRequire } = require('node:module');
const localRequire = createRequire(__filename);
const { createStrapi } = localRequire('@strapi/strapi');
const discussionFactory = (discussionControllerModule as any).default || discussionControllerModule;
const replyFactory = (replyControllerModule as any).default || replyControllerModule;

describe('Strapi Discussion Security & Business Rules', () => {
  let app: any;
  let discussionController: any;
  let replyController: any;
  let testUser: any;
  let otherUser: any;
  let testCategory: any;

  beforeAll(async () => {
    process.env.DATABASE_CLIENT = 'sqlite';
    process.env.DATABASE_FILENAME = '.tmp/data.db';
    app = await createStrapi().load();

    discussionController = discussionFactory({ strapi: app });
    replyController = replyFactory({ strapi: app });

    const roles = await app.documents('plugin::users-permissions.role').findMany();
    const authenticatedRole = roles.find((r: any) => r.type === 'authenticated');

    // Find or create test category
    testCategory = await app.documents('api::category.category').findFirst({
      filters: { slug: 'bourse' },
    });
    if (!testCategory) {
      testCategory = await app.documents('api::category.category').create({
        data: {
          name: 'Bourse & actions',
          slug: 'bourse',
          description: "Actions, ETF, PEA, compte-titres : stratégies et retours d'expérience.",
          icon: 'candles',
          color: '#007aff',
        },
      });
    }

    // Find or create test users
    testUser = await app.documents('plugin::users-permissions.user').findFirst({
      filters: { username: 'TestUserA' },
    });
    if (!testUser) {
      testUser = await app.documents('plugin::users-permissions.user').create({
        data: {
          username: 'TestUserA',
          email: 'testusera@example.com',
          password: 'Password123!',
          confirmed: true,
          role: authenticatedRole.id,
          points: 10,
        },
      });
    }

    otherUser = await app.documents('plugin::users-permissions.user').findFirst({
      filters: { username: 'TestUserB' },
    });
    if (!otherUser) {
      otherUser = await app.documents('plugin::users-permissions.user').create({
        data: {
          username: 'TestUserB',
          email: 'testuserb@example.com',
          password: 'Password123!',
          confirmed: true,
          role: authenticatedRole.id,
          points: 5,
        },
      });
    }
  });

  afterAll(async () => {
    if (app) {
      try {
        if (app.server) await app.server.close();
        if (app.db) await app.db.destroy();
      } catch {
        // cleanup ignore
      }
    }
  });

  it('rejects discussion creation from unauthenticated requests with 401', async () => {
    const ctx: any = {
      state: {},
      request: {
        body: {
          title: 'Mon nouveau sujet sur le PEA',
          content: 'Voici le contenu détaillé de ma question.',
          category: testCategory.documentId,
        },
      },
      unauthorized: (msg: string) => ({ status: 401, message: msg }),
      badRequest: (msg: string) => ({ status: 400, message: msg }),
      created: (data: any) => ({ status: 201, data }),
    };

    const res = await discussionController.create(ctx);
    expect(res.status).toBe(401);
  });

  it('rejects discussion creation with title < 10 characters with 400', async () => {
    const ctx: any = {
      state: { user: testUser },
      request: {
        body: {
          title: 'Court',
          content: 'Voici un contenu valide mais le titre est trop court.',
          category: testCategory.documentId,
        },
      },
      unauthorized: (msg: string) => ({ status: 401, message: msg }),
      badRequest: (msg: string) => ({ status: 400, message: msg }),
      created: (data: any) => ({ status: 201, data }),
    };

    const res = await discussionController.create(ctx);
    expect(res.status).toBe(400);
    expect(res.message).toContain('10 caractères');
  });

  it('rejects discussion creation without valid category with 400', async () => {
    const ctx: any = {
      state: { user: testUser },
      request: {
        body: {
          title: 'Titre parfaitement valide avec plus de dix caractères',
          content: 'Contenu parfaitement valide également.',
          category: null,
        },
      },
      unauthorized: (msg: string) => ({ status: 401, message: msg }),
      badRequest: (msg: string) => ({ status: 400, message: msg }),
      created: (data: any) => ({ status: 201, data }),
    };

    const res = await discussionController.create(ctx);
    expect(res.status).toBe(400);
  });

  it('prevents author impersonation: overrides any author in payload with authenticated user', async () => {
    const ctx: any = {
      state: { user: testUser },
      request: {
        body: {
          title: 'Discussion avec tentative usurpation d identite',
          content: 'Contenu valide avec usurpation tentée.',
          category: testCategory.documentId,
          author: otherUser.documentId, // Attack: sending someone else's ID!
        },
      },
      unauthorized: (msg: string) => ({ status: 401, message: msg }),
      badRequest: (msg: string) => ({ status: 400, message: msg }),
      created: (res: any) => ({ status: 201, data: res.data }),
    };

    const res = await discussionController.create(ctx);

    expect(res.status).toBe(201);
    expect(res.data).toBeDefined();
    // Author MUST strictly be testUser, NEVER otherUser
    const authorId = res.data.author?.documentId || res.data.author?.id;
    const testUserId = testUser.documentId || testUser.id;
    expect(authorId).toBe(testUserId);
  });

  it('rejects reply creation from unauthenticated requests with 401', async () => {
    const ctx: any = {
      state: {},
      request: {
        body: {
          content: 'Ma réponse non authentifiée.',
          discussion: 'any-id',
        },
      },
      unauthorized: (msg: string) => ({ status: 401, message: msg }),
      badRequest: (msg: string) => ({ status: 400, message: msg }),
      notFound: (msg: string) => ({ status: 404, message: msg }),
      created: (data: any) => ({ status: 201, data }),
    };

    const res = await replyController.create(ctx);
    expect(res.status).toBe(401);
  });

  it('rejects reply creation on non-existent discussion with 404', async () => {
    const ctx: any = {
      state: { user: testUser },
      request: {
        body: {
          content: 'Réponse à un fil introuvable.',
          discussion: 'non-existent-doc-id-999',
        },
      },
      unauthorized: (msg: string) => ({ status: 401, message: msg }),
      badRequest: (msg: string) => ({ status: 400, message: msg }),
      notFound: (msg: string) => ({ status: 404, message: msg }),
      created: (data: any) => ({ status: 201, data }),
    };

    const res = await replyController.create(ctx);
    expect(res.status).toBe(404);
  });
});
