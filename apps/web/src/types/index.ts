export interface User {
  id: number;
  documentId?: string;
  username: string;
  name?: string;
  email: string;
  points?: number;
  bio?: string;
  role_title?: string;
  is_pro?: boolean;
  is_subscriber?: boolean;
  avatar_color?: string;
}

export interface Category {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  discussionsCount?: number;
}

export interface PollOption {
  label: string;
  votes: number;
}

export interface Reply {
  id: number;
  documentId?: string;
  content: string;
  likes: number;
  verified?: boolean;
  createdAt: string;
  updatedAt?: string;
  author: User;
  discussion?: {
    id: number;
    documentId?: string;
    slug?: string;
    title?: string;
  };
}

export interface Discussion {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  content: string;
  type: 'question' | 'discussion' | 'poll';
  views: number;
  likes: number;
  pinned: boolean;
  featured: 'none' | 'question' | 'poll';
  poll_options?: PollOption[];
  createdAt: string;
  updatedAt?: string;
  category: Category;
  author: User;
  replies?: Reply[];
  solution?: Reply | null;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface DiscussionsResponse {
  data: Discussion[];
  meta: {
    pagination: PaginationMeta;
  };
}

export interface CreateDiscussionInput {
  title: string;
  content: string;
  category: string | number;
  type?: 'question' | 'discussion' | 'poll';
  poll_options?: PollOption[];
}

export interface CreateReplyInput {
  content: string;
  discussion: string | number;
}
