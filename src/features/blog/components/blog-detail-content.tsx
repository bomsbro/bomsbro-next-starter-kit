'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import type { Blog } from '@core/api';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

import { Badge } from '@/shared/ui/components/atoms/badge';
import { Button } from '@/shared/ui/components/atoms/button';

import { useDeleteBlogMutation } from '../hooks/use-blog-queries';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

interface BlogDetailContentProps {
  blog: Blog;
  renderingInfo?: React.ReactNode;
}

const BlogDetailContent = ({ blog, renderingInfo }: BlogDetailContentProps) => {
  const router = useRouter();
  const deleteMutation = useDeleteBlogMutation();

  const handleDelete = async () => {
    if (!window.confirm('정말 이 글을 삭제하시겠습니까?')) return;

    try {
      await deleteMutation.mutateAsync(blog.id);
      router.push('/blog');
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Button variant="ghost" onClick={() => router.push('/blog')} className="mb-6 -ml-4">
        <ArrowLeft className="h-4 w-4" />
        목록으로
      </Button>

      {renderingInfo}

      <article>
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="secondary">{blog.category}</Badge>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900">{blog.title}</h1>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-700">{blog.author}</span>
              <span>·</span>
              <span>{formatDate(blog.createdAt)}</span>
              {blog.updatedAt !== blog.createdAt && <span className="text-xs">(수정됨)</span>}
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" onClick={() => router.push(`/blog/${blog.id}/edit`)} title="수정">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                title="삭제"
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {blog.thumbnail && (
          <div className="relative mb-8 h-64 w-full">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
    </div>
  );
};

export default BlogDetailContent;
