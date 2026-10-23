import { Category, Discussion, Reply, DiscussionsResponse, CreateDiscussionInput, CreateReplyInput, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

/**
 * Standard headers for Strapi REST requests
 */
function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Standard populate parameters to avoid circular relation loops in Strapi v5
 */
function appendDiscussionPopulate(query: URLSearchParams) {
  query.append('populate[category][fields][0]', 'name');
  query.append('populate[category][fields][1]', 'slug');
  query.append('populate[category][fields][2]', 'color');
  query.append('populate[category][fields][3]', 'icon');

  query.append('populate[author][fields][0]', 'username');
  query.append('populate[author][fields][1]', 'role_title');
  query.append('populate[author][fields][2]', 'is_pro');
  query.append('populate[author][fields][3]', 'is_subscriber');
  query.append('populate[author][fields][4]', 'points');
  query.append('populate[author][fields][5]', 'avatar_color');

  query.append('populate[solution][populate][author][fields][0]', 'username');
  query.append('populate[solution][populate][author][fields][1]', 'role_title');
  query.append('populate[solution][populate][author][fields][2]', 'is_pro');
  query.append('populate[solution][populate][author][fields][3]', 'is_subscriber');
  query.append('populate[solution][populate][author][fields][4]', 'avatar_color');

  query.append('populate[replies][populate][author][fields][0]', 'username');
  query.append('populate[replies][populate][author][fields][1]', 'role_title');
  query.append('populate[replies][populate][author][fields][2]', 'is_pro');
  query.append('populate[replies][populate][author][fields][3]', 'is_subscriber');
  query.append('populate[replies][populate][author][fields][4]', 'avatar_color');
}

/**
 * Fetch discussions with relations, filters, sort and pagination
 */
export async function getDiscussions(params: {
  category?: string;
  sort?: 'recent' | 'views' | 'likes' | 'unanswered';
  page?: number;
  pageSize?: number;
  search?: string;
} = {}): Promise<DiscussionsResponse> {
  const query = new URLSearchParams();

  // Optimized relations to populate
  appendDiscussionPopulate(query);

  // Pagination
  query.append('pagination[page]', String(params.page || 1));
  query.append('pagination[pageSize]', String(params.pageSize || 15));

  // Category filter
  if (params.category) {
    query.append('filters[category][slug][$eq]', params.category);
  }

  // Search filter
  if (params.search) {
    query.append('filters[$or][0][title][$containsi]', params.search);
    query.append('filters[$or][1][content][$containsi]', params.search);
  }

  // Sorting
  if (params.sort === 'views') {
    query.append('sort[0]', 'views:desc');
  } else if (params.sort === 'likes') {
    query.append('sort[0]', 'likes:desc');
  } else {
    query.append('sort[0]', 'createdAt:desc');
  }

  try {
    const res = await fetch(`${API_URL}/api/discussions?${query.toString()}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(`Erreur HTTP ${res.status}: ${errJson?.error?.message || res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('API error fetching discussions from Strapi:', err);
    return {
      data: [],
      meta: {
        pagination: { page: 1, pageSize: 15, pageCount: 0, total: 0 },
      },
    };
  }
}

/**
 * Fetch a single discussion by its slug
 */
export async function getDiscussionBySlug(slug: string): Promise<Discussion | null> {
  const query = new URLSearchParams();
  query.append('filters[slug][$eq]', slug);
  appendDiscussionPopulate(query);

  try {
    const res = await fetch(`${API_URL}/api/discussions?${query.toString()}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (!json.data || json.data.length === 0) return null;

    return json.data[0];
  } catch (err) {
    console.warn(`API error fetching discussion ${slug}:`, err);
    return null;
  }
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories?sort=name:asc`, {
      headers: getHeaders(),
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('API error fetching categories:', err);
    return [];
  }
}

/**
 * Fetch a category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${API_URL}/api/categories?filters[slug][$eq]=${encodeURIComponent(slug)}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data?.[0] || null;
  } catch (err) {
    console.warn(`API error fetching category ${slug}:`, err);
    return null;
  }
}

/**
 * Create a new discussion (Authenticated)
 */
export async function createDiscussion(input: CreateDiscussionInput, token: string): Promise<Discussion> {
  const res = await fetch(`${API_URL}/api/discussions`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ data: input }),
  });

  const json = await res.json();

  if (!res.ok) {
    const errorMsg = json.error?.message || 'Erreur lors de la création de la discussion';
    throw new Error(errorMsg);
  }

  return json.data;
}

/**
 * Create a reply for a discussion (Authenticated)
 */
export async function createReply(input: CreateReplyInput, token: string): Promise<Reply> {
  const res = await fetch(`${API_URL}/api/replies`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ data: input }),
  });

  const json = await res.json();

  if (!res.ok) {
    const errorMsg = json.error?.message || 'Erreur lors de la publication de la réponse';
    throw new Error(errorMsg);
  }

  return json.data;
}

/**
 * Mark a reply as the accepted solution
 */
export async function setDiscussionSolution(
  discussionId: string | number,
  replyId: string | number,
  token: string
): Promise<Discussion> {
  const res = await fetch(`${API_URL}/api/discussions/${discussionId}/solution`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify({ replyId }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || 'Impossible de définir la meilleure réponse');
  }

  return json.data;
}

/**
 * Like or unlike a discussion (+1 / -1 "Utile")
 */
export async function likeDiscussion(
  discussionId: string | number,
  token: string,
  action: 'like' | 'unlike' = 'like'
): Promise<Discussion> {
  const res = await fetch(`${API_URL}/api/discussions/${discussionId}/like`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ data: { action } }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || 'Erreur lors du vote');
  }

  return json.data;
}

/**
 * Vote on a poll option (Authenticated)
 */
export async function votePoll(
  discussionId: string | number,
  optionIndex: number,
  token: string
): Promise<Discussion> {
  const res = await fetch(`${API_URL}/api/discussions/${discussionId}/poll-vote`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ data: { optionIndex } }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || 'Erreur lors du vote au sondage');
  }

  return json.data;
}

/**
 * Fetch a single user by username
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/users?filters[username][$eq]=${encodeURIComponent(username)}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const users = await res.json();
    return Array.isArray(users) && users.length > 0 ? users[0] : null;
  } catch (err) {
    console.warn(`API error fetching user ${username}:`, err);
    return null;
  }
}

/**
 * Authenticate with Strapi
 */
export async function login(identifier: string, password: string): Promise<{ jwt: string; user: User }> {
  const res = await fetch(`${API_URL}/api/auth/local`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ identifier, password }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || 'Identifiants invalides');
  }

  return json;
}

/**
 * Fetch authenticated user info
 */
export async function getMe(token: string): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/api/users/me`, {
      headers: getHeaders(token),
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
