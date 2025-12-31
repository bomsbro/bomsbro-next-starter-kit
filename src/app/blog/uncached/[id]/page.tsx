import Link from 'next/link';

import BlogDetailContent from '@/features/blog/components/blog-detail-content';
import { Badge } from '@/shared/ui/components/atoms/badge';
import { Card } from '@/shared/ui/components/atoms/card';
import type { Blog } from '@core/api';

/**
 * Uncached 페이지 (빌드 기호: ƒ)
 *
 * - generateStaticParams 없음 → 빌드 시 경로 생성 안 함
 * - dynamic 설정 없음 (auto 기본값)
 *
 * 결과: 매 요청마다 서버에서 HTML 생성, 페이지 캐싱 미사용
 */

interface BlogDetailUncachedPageProps {
  params: Promise<{ id: string }>;
}

const BlogDetailUncachedPage = async ({ params }: BlogDetailUncachedPageProps) => {
  const { id } = await params;

  // 서버 렌더링 시간 기록 (매 요청마다 달라짐)
  const serverTime = new Date().toLocaleString('ko-KR');

  // 캐시 없음 → Dynamic Rendering 강제
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
    <Card className="mb-6 border-2 border-red-200 bg-red-50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Badge className="bg-red-600 text-white">ƒ Uncached</Badge>
        <span className="font-semibold text-red-700">페이지 캐싱 미사용</span>
      </div>
      <p className="mb-3 text-sm text-gray-600">
        generateStaticParams 없음 + cache: no-store로 매 요청마다 서버에서 HTML 생성.
      </p>
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="rounded bg-white px-3 py-1.5">
          ⚡ <span className="font-medium">서버 렌더링 시간:</span> {serverTime}
        </div>
        <div className="rounded bg-white px-3 py-1.5">
          📍 <span className="font-medium">빌드 기호:</span> ƒ
        </div>
        <div className="rounded bg-white px-3 py-1.5">
          ⚙️ <span className="font-medium">dynamic:</span> auto (기본값)
        </div>
      </div>
      <div className="mt-3">
        <Link href={`/blog/cached/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-green-100">
            Cached 버전 비교
          </Badge>
        </Link>
      </div>
    </Card>
  );

  return <BlogDetailContent blog={blog} renderingInfo={renderingInfo} />;
};

export default BlogDetailUncachedPage;

