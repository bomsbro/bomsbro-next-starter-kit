import Link from 'next/link';

import BlogDetailContent from '@/features/blog/components/blog-detail-content';
import { Badge } from '@/shared/ui/components/atoms/badge';
import { Card } from '@/shared/ui/components/atoms/card';
import type { Blog } from '@core/api';

/**
 * Cached 페이지 (빌드 기호: ●)
 *
 * - 동적 경로 + generateStaticParams → 빌드 시 경로 생성
 * - fetch 기본 캐시 (force-cache) → 데이터 캐싱
 * - dynamic 설정 없음 (auto 기본값)
 *
 * 결과: 빌드 시 HTML 생성, 페이지 캐싱 사용
 */

// 빌드 시 생성할 경로 지정 → ● 빌드 기호
export function generateStaticParams() {
  return ['1', '2', '3', '4'].map((id) => ({ id }));
}

interface BlogDetailCachedPageProps {
  params: Promise<{ id: string }>;
}

const BlogDetailCachedPage = async ({ params }: BlogDetailCachedPageProps) => {
  const { id } = await params;

  // 빌드/생성 시간 기록
  const generatedTime = new Date().toLocaleString('ko-KR');

  // 기본 캐시 사용 (force-cache가 기본값)
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
    <Card className="mb-6 border-2 border-green-200 bg-green-50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Badge className="bg-green-600 text-white">● Cached</Badge>
        <span className="font-semibold text-green-700">페이지 캐싱 사용</span>
      </div>
      <p className="mb-3 text-sm text-gray-600">
        동적 경로 + generateStaticParams로 빌드 시 HTML 생성. fetch는 기본 캐시(force-cache) 사용.
      </p>
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="rounded bg-white px-3 py-1.5">
          🏗️ <span className="font-medium">생성 시간:</span> {generatedTime}
        </div>
        <div className="rounded bg-white px-3 py-1.5">
          📍 <span className="font-medium">빌드 기호:</span> ●
        </div>
        <div className="rounded bg-white px-3 py-1.5">
          ⚙️ <span className="font-medium">dynamic:</span> auto (기본값)
        </div>
      </div>
      <div className="mt-3">
        <Link href={`/blog/uncached/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-red-100">
            Uncached 버전 비교
          </Badge>
        </Link>
      </div>
    </Card>
  );

  return <BlogDetailContent blog={blog} renderingInfo={renderingInfo} />;
};

export default BlogDetailCachedPage;
