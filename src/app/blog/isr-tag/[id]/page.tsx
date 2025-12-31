import Link from 'next/link';

import BlogDetailContent from '@/features/blog/components/blog-detail-content';
import { Badge } from '@/shared/ui/components/atoms/badge';
import { Card } from '@/shared/ui/components/atoms/card';
import type { Blog } from '@core/api';

import { RevalidateTagButton } from './revalidate-button';

/**
 * ISR Tag-based 페이지 (빌드 기호: ●)
 *
 * - generateStaticParams → 빌드 시 경로 생성
 * - fetch에 next: { tags: ['blog-{id}'] } 설정
 * - revalidateTag('blog-{id}') 호출 시 해당 태그의 모든 데이터 재검증
 *
 * 결과: 빌드 시 HTML 생성, 태그 기반 캐시 무효화
 */

// 빌드 시 생성할 경로 지정
export function generateStaticParams() {
  return ['1', '2', '3', '4'].map((id) => ({ id }));
}

interface BlogDetailIsrTagPageProps {
  params: Promise<{ id: string }>;
}

const BlogDetailIsrTagPage = async ({ params }: BlogDetailIsrTagPageProps) => {
  const { id } = await params;

  const generatedTime = new Date().toLocaleString('ko-KR');

  // Tag 기반 캐시 설정
  const response = await fetch(`http://localhost:3001/blogs/${id}`, {
    next: { tags: [`blog-${id}`] },
  });

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
    <Card className="mb-6 border-2 border-orange-200 bg-orange-50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Badge className="bg-orange-600 text-white">● ISR Tag</Badge>
        <span className="font-semibold text-orange-700">태그 기반 재검증</span>
      </div>
      <p className="mb-3 text-sm text-gray-600">
        <code className="rounded bg-orange-100 px-1">revalidateTag(&apos;blog-{id}&apos;)</code> 호출 시 이 태그를
        사용하는 모든 캐시 무효화.
      </p>
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="rounded bg-white px-3 py-1.5">
          🏗️ <span className="font-medium">생성 시간:</span> {generatedTime}
        </div>
        <div className="rounded bg-white px-3 py-1.5">
          🏷️ <span className="font-medium">태그:</span> blog-{id}
        </div>
        <RevalidateTagButton id={id} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={`/blog/cached/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-green-100">
            Cached
          </Badge>
        </Link>
        <Link href={`/blog/isr-time/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">
            ISR Time
          </Badge>
        </Link>
        <Link href={`/blog/isr-path/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-purple-100">
            ISR Path
          </Badge>
        </Link>
      </div>
    </Card>
  );

  return <BlogDetailContent blog={blog} renderingInfo={renderingInfo} />;
};

export default BlogDetailIsrTagPage;
