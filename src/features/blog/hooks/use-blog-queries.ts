import {
  type BlogRequest,
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  type GetBlogsParams,
  updateBlog,
} from '@core/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (params?: GetBlogsParams) => [...blogKeys.lists(), params] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (id: number) => [...blogKeys.details(), id] as const,
};

export const useBlogsQuery = (params?: GetBlogsParams) =>
  useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => getAllBlogs(params),
  });

export const useBlogQuery = (id: number) =>
  useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => getBlog(id),
    enabled: !!id,
  });

export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blog: BlogRequest) => createBlog(blog),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};

export const useUpdateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blog }: { id: number; blog: Partial<BlogRequest> }) => updateBlog(id, blog),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: blogKeys.detail(id) });
    },
  });
};

export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBlog(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};
