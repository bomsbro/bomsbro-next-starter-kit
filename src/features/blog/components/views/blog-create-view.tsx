'use client';

import { useRouter } from 'next/navigation';

import type { BlogRequest } from '@core/api';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/shared/ui/components/atoms/button';

import { useCreateBlogMutation } from '../../hooks/use-blog-queries';
import BlogForm from '../blog-form';

const BlogCreateView = () => {
  const router = useRouter();
  const createMutation = useCreateBlogMutation();

  const handleSubmit = async (data: BlogRequest) => {
    try {
      await createMutation.mutateAsync(data);
      router.push('/blog');
    } catch {
      alert('글 작성 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      router.push('/blog');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Button variant="ghost" onClick={() => router.push('/blog')} className="mb-6 -ml-4">
        <ArrowLeft className="h-4 w-4" />
        목록으로
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">새 글 작성</h1>
        <p className="mt-2 text-gray-600">블로그에 새 글을 작성합니다.</p>
      </div>

      <BlogForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createMutation.isPending}
        submitLabel="작성"
      />
    </div>
  );
};

export default BlogCreateView;
