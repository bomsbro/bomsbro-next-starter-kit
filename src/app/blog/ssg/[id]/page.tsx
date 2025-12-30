import Link from 'next/link';

import type { Blog } from '@core/api';

import BlogDetailContent from '@/features/blog/components/blog-detail-content';
import { Badge } from '@/shared/ui/components/atoms/badge';
import { Card } from '@/shared/ui/components/atoms/card';

/**
 * SSG (Static Site Generation) 방식
 *
 * - generateStaticParams로 빌드 시점에 모든 페이지를 미리 생성
 * - fetch에 기본 캐시 적용 (force-cache가 기본값)
 * - 정적 HTML 파일로 제공
 *
 * 장점:
 * - 최고의 성능 (CDN에서 정적 파일 제공)
 * - SEO 최적화
 * - 서버 부하 없음
 *
 * 단점:
 * - 데이터 변경 시 재빌드 필요
 * - 빌드 시간 증가 (페이지 수에 비례)
 * - 실시간 데이터 반영 불가
 */

// 빌드 시점에 정적으로 생성할 페이지 경로 정의
export async function generateStaticParams() {
  const response = await fetch('http://localhost:3001/blogs');
  const blogs = (await response.json()) as Blog[];

  return blogs.map((blog) => ({
    id: String(blog.id),
  }));
}

// 빌드 시간 기록
const BUILD_TIME = new Date().toLocaleString('ko-KR');

interface BlogDetailSSGPageProps {
  params: Promise<{ id: string }>;
}

const BlogDetailSSGPage = async ({ params }: BlogDetailSSGPageProps) => {
  const { id } = await params;

  // 빌드 시점에 데이터 fetch (기본적으로 캐시됨)
  const response = await fetch(`http://localhost:3001/blogs/${id}`, {
    cache: 'force-cache', // 명시적으로 캐시 사용 (SSG 기본 동작)
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
    <Card className="mb-6 border-2 border-green-200 bg-green-50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Badge className="bg-green-600 text-white">SSG</Badge>
        <span className="font-semibold text-green-700">Static Site Generation</span>
      </div>
      <p className="mb-3 text-sm text-gray-600">
        빌드 시점에 HTML을 미리 생성합니다. generateStaticParams + fetch(cache: force-cache) 사용.
      </p>
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="rounded bg-white px-3 py-1.5">
          🏗️ <span className="font-medium">빌드 시간:</span> {BUILD_TIME}
        </div>
        <div className="rounded bg-white px-3 py-1.5">
          📍 <span className="font-medium">데이터 출처:</span> 빌드 시점 캐시
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Link href={`/blog/csr/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-orange-100">
            CSR 버전
          </Badge>
        </Link>
        <Link href={`/blog/ssr/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">
            SSR 버전
          </Badge>
        </Link>
        <Link href={`/blog/isr/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-purple-100">
            ISR 버전
          </Badge>
        </Link>
      </div>
    </Card>
  );

  return <BlogDetailContent blog={blog} renderingInfo={renderingInfo} />;
};

export default BlogDetailSSGPage;
