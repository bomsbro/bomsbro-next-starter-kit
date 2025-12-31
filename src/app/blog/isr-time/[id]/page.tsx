import Link from 'next/link';

import BlogDetailContent from '@/features/blog/components/blog-detail-content';
import { Badge } from '@/shared/ui/components/atoms/badge';
import { Card } from '@/shared/ui/components/atoms/card';
import type { Blog } from '@core/api';

/**
 * ISR Time-based 페이지 (빌드 기호: ●)
 *
 * - generateStaticParams → 빌드 시 경로 생성
 * - export const revalidate = N → N초마다 백그라운드 재생성
 *
 * 결과: 빌드 시 HTML 생성, 설정된 시간 후 자동 재검증
 */

// 60초마다 재검증
export const revalidate = 60;

// 빌드 시 생성할 경로 지정
export function generateStaticParams() {
  return ['1', '2', '3', '4'].map((id) => ({ id }));
}

interface BlogDetailIsrTimePageProps {
  params: Promise<{ id: string }>;
}

const BlogDetailIsrTimePage = async ({ params }: BlogDetailIsrTimePageProps) => {
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
    <Card className="mb-6 border-2 border-blue-200 bg-blue-50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Badge className="bg-blue-600 text-white">● ISR Time</Badge>
        <span className="font-semibold text-blue-700">시간 기반 재검증</span>
      </div>
      <p className="mb-3 text-sm text-gray-600">
        <code className="rounded bg-blue-100 px-1">revalidate = {revalidate}</code>로 {revalidate}초마다 자동
        백그라운드 재검증.
      </p>
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="rounded bg-white px-3 py-1.5">
          🏗️ <span className="font-medium">생성 시간:</span> {generatedTime}
        </div>
        <div className="rounded bg-white px-3 py-1.5">
          ⏱️ <span className="font-medium">revalidate:</span> {revalidate}초
        </div>
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
        <Link href={`/blog/isr-path/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-purple-100">
            ISR Path
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

export default BlogDetailIsrTimePage;

