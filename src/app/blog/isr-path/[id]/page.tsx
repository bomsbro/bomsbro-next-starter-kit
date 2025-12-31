import Link from 'next/link';

import BlogDetailContent from '@/features/blog/components/blog-detail-content';
import { Badge } from '@/shared/ui/components/atoms/badge';
import { Card } from '@/shared/ui/components/atoms/card';
import type { Blog } from '@core/api';

import { RevalidatePathButton } from './revalidate-button';

/**
 * ISR Path-based 페이지 (빌드 기호: ●)
 *
 * - generateStaticParams → 빌드 시 경로 생성
 * - revalidatePath() 호출 시 해당 경로만 재검증
 *
 * 결과: 빌드 시 HTML 생성, 수동 트리거 시 재생성
 */

// 빌드 시 생성할 경로 지정
export function generateStaticParams() {
  return ['1', '2', '3', '4'].map((id) => ({ id }));
}

interface BlogDetailIsrPathPageProps {
  params: Promise<{ id: string }>;
}

const BlogDetailIsrPathPage = async ({ params }: BlogDetailIsrPathPageProps) => {
  const { id } = await params;

  const generatedTime = new Date().toLocaleString('ko-KR');

  const response = await fetch(`http://localhost:3001/blogs/${id}`);

  if (!response.ok) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="py-12 text-center">
          <p className="mb-4 text-red-500">글을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const blog = (await response.json()) as Blog;

  const renderingInfo = (
    <Card className="mb-6 border-2 border-purple-200 bg-purple-50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Badge className="bg-purple-600 text-white">● ISR Path</Badge>
        <span className="font-semibold text-purple-700">경로 기반 재검증</span>
      </div>
      <p className="mb-3 text-sm text-gray-600">
        <code className="rounded bg-purple-100 px-1">revalidatePath(&apos;/blog/isr-path/{id}&apos;)</code> 호출 시 이
        경로만 재검증.
      </p>
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="rounded bg-white px-3 py-1.5">
          🏗️ <span className="font-medium">생성 시간:</span> {generatedTime}
        </div>
        <RevalidatePathButton id={id} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={`/blog/cached/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-green-100">
            Cached
          </Badge>
        </Link>
        <Link href={`/blog/uncached/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-red-100">
            Uncached
          </Badge>
        </Link>
        <Link href={`/blog/isr-time/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">
            ISR Time
          </Badge>
        </Link>
        <Link href={`/blog/isr-tag/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-orange-100">
            ISR Tag
          </Badge>
        </Link>
      </div>
    </Card>
  );

  return <BlogDetailContent blog={blog} renderingInfo={renderingInfo} />;
};

export default BlogDetailIsrPathPage;

