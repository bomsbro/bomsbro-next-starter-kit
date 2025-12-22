import { apiClient } from './axios-instance';

export interface Blog {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogRequest {
  title: string;
  content: string;
  category: string;
  author: string;
  thumbnail?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  category?: string;
}

export const getAllBlogs = async (params?: GetBlogsParams): Promise<PaginatedResponse<Blog>> => {
  const { page = 1, limit = 10, category } = params ?? {};

  const queryParams = new URLSearchParams();
  queryParams.set('_page', String(page));
  queryParams.set('_per_page', String(limit));
  if (category) {
    queryParams.set('category', category);
  }

  const response = await apiClient.get<Blog[]>(`/blogs?${queryParams.toString()}`);

  // json-server v1 returns pagination info in response
  const data = response.data as unknown as {
    data: Blog[];
    first: number;
    prev: number | null;
    next: number | null;
    last: number;
    pages: number;
    items: number;
  };

  return {
    data: data.data,
    total: data.items,
    page,
    limit,
    totalPages: data.pages,
  };
};

export const getBlog = async (id: number): Promise<Blog> => {
  const response = await apiClient.get<Blog>(`/blogs/${id}`);
  return response.data;
};

export const createBlog = async (blog: BlogRequest): Promise<Blog> => {
  const now = new Date().toISOString();
  const response = await apiClient.post<Blog>('/blogs', {
    ...blog,
    createdAt: now,
    updatedAt: now,
  });
  return response.data;
};

export const updateBlog = async (id: number, blog: Partial<BlogRequest>): Promise<Blog> => {
  const response = await apiClient.patch<Blog>(`/blogs/${id}`, {
    ...blog,
    updatedAt: new Date().toISOString(),
  });
  return response.data;
};

export const deleteBlog = async (id: number): Promise<void> => {
  await apiClient.delete(`/blogs/${id}`);
};
