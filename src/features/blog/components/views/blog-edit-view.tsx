'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { revalidateAllBlogPages } from '@/app/blog/actions';
import { Badge } from '@/shared/ui/components/atoms/badge';
import { Button } from '@/shared/ui/components/atoms/button';
import { Card } from '@/shared/ui/components/atoms/card';
import { Spinner } from '@/shared/ui/components/atoms/spinner';
import type { BlogRequest } from '@core/api';

import { useBlogQuery, useUpdateBlogMutation } from '../../hooks/use-blog-queries';
import BlogForm from '../blog-form';

interface BlogEditViewProps {
  id: string;
}

const BlogEditView = ({ id }: BlogEditViewProps) => {
  const router = useRouter();
  const [revalidateResult, setRevalidateResult] = useState<{ success: boolean; timestamp: string } | null>(null);
  const [isRevalidating, setIsRevalidating] = useState(false);

  const { data: blog, isLoading, isError } = useBlogQuery(id);
  const updateMutation = useUpdateBlogMutation();

  const handleSubmit = async (data: BlogRequest) => {
    try {
      await updateMutation.mutateAsync({ id, blog: data });

      // 수정 후 ISR 페이지들 재검증
      setIsRevalidating(true);
      const result = await revalidateAllBlogPages(id);
      setRevalidateResult(result);
      setIsRevalidating(false);
    } catch {
      alert('글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      router.push(`/blog/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex justify-center py-12">
          <Spinner className="size-8" />
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="py-12 text-center">
          <p className="mb-4 text-red-500">글을 찾을 수 없습니다.</p>
          <Button variant="link" onClick={() => router.push('/blog')}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  // 재검증 완료 후 결과 표시
  if (revalidateResult) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Card className="border-2 border-green-200 bg-green-50 p-6">
          <h2 className="mb-4 text-xl font-bold text-green-800">✅ 수정 및 재검증 완료!</h2>
          <p className="mb-4 text-gray-600">
            블로그가 수정되었고, ISR 페이지들이 재검증되었습니다.
          </p>
          <div className="mb-4 rounded bg-white p-3 text-sm">
            <p>
              <span className="font-medium">재검증 시간:</span>{' '}
              {new Date(revalidateResult.timestamp).toLocaleString('ko-KR')}
            </p>
            <p className="mt-1 text-gray-500">
              • <code className="bg-purple-100 px-1">revalidatePath()</code> → ISR Path 페이지 재검증
            </p>
            <p className="text-gray-500">
              • <code className="bg-orange-100 px-1">revalidateTag()</code> → ISR Tag 페이지 재검증
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => router.push(`/blog/${id}`)}>블로그로 이동</Button>
            <Button variant="outline" onClick={() => router.push(`/blog/isr-path/${id}`)}>
              <Badge className="mr-2 bg-purple-600">ISR Path</Badge> 확인
            </Button>
            <Button variant="outline" onClick={() => router.push(`/blog/isr-tag/${id}`)}>
              <Badge className="mr-2 bg-orange-600">ISR Tag</Badge> 확인
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Button variant="ghost" onClick={() => router.push(`/blog/${id}`)} className="mb-6 -ml-4">
        <ArrowLeft className="h-4 w-4" />
        돌아가기
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">글 수정</h1>
        <p className="mt-2 text-gray-600">블로그 글을 수정합니다.</p>
      </div>

      {isRevalidating && (
        <Card className="mb-6 border-2 border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <Spinner className="size-5" />
            <span className="text-blue-700">ISR 페이지 재검증 중...</span>
          </div>
        </Card>
      )}

      <BlogForm
        initialData={{
          title: blog.title,
          content: blog.content,
          category: blog.category,
          author: blog.author,
          thumbnail: blog.thumbnail,
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={updateMutation.isPending || isRevalidating}
        submitLabel="수정"
      />
    </div>
  );
};

export default BlogEditView;
