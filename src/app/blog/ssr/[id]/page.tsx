import Link from 'next/link';

import type { Blog } from '@core/api';

import BlogDetailContent from '@/features/blog/components/blog-detail-content';
import { Badge } from '@/shared/ui/components/atoms/badge';
import { Card } from '@/shared/ui/components/atoms/card';

/**
 * SSR (Server-Side Rendering) 방식
 *
 * - 매 요청마다 서버에서 데이터를 가져와 HTML 생성
 * - fetch에 { cache: 'no-store' } 옵션 사용
 * - dynamic = 'force-dynamic'으로 동적 렌더링 강제
 *
 * 장점:
 * - 항상 최신 데이터 제공
 * - SEO 최적화
 * - 사용자별 맞춤 콘텐츠 가능
 *
 * 단점:
 * - 서버 부하 증가
 * - TTFB(Time To First Byte) 증가
 * - 캐싱 어려움
 */

// 동적 렌더링 강제 (매 요청마다 서버에서 실행)
export const dynamic = 'force-dynamic';

interface BlogDetailSSRPageProps {
  params: Promise<{ id: string }>;
}

const BlogDetailSSRPage = async ({ params }: BlogDetailSSRPageProps) => {
  const { id } = await params;

  // 서버 렌더링 시간 기록
  const serverTime = new Date().toLocaleString('ko-KR');

  // 매 요청마다 새로 데이터 fetch (캐시 사용 안 함)
  const response = await fetch(`http://localhost:3001/blogs/${id}`, {
    cache: 'no-store', // 캐시 사용 안 함 (매 요청마다 새로 가져옴)
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
    <Card className="mb-6 border-2 border-blue-200 bg-blue-50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Badge className="bg-blue-600 text-white">SSR</Badge>
        <span className="font-semibold text-blue-700">Server-Side Rendering</span>
      </div>
      <p className="mb-3 text-sm text-gray-600">
        매 요청마다 서버에서 데이터를 가져와 HTML을 생성합니다. fetch(cache: no-store) + dynamic = force-dynamic 사용.
      </p>
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="rounded bg-white px-3 py-1.5">
          ⚡ <span className="font-medium">서버 렌더링 시간:</span> {serverTime}
        </div>
        <div className="rounded bg-white px-3 py-1.5">
          📍 <span className="font-medium">데이터 출처:</span> 서버 (매 요청마다 fetch)
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Link href={`/blog/csr/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-orange-100">
            CSR 버전
          </Badge>
        </Link>
        <Link href={`/blog/ssg/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-green-100">
            SSG 버전
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

export default BlogDetailSSRPage;
