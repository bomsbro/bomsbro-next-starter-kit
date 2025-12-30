import Link from 'next/link';

import type { Blog } from '@core/api';

import BlogDetailContent from '@/features/blog/components/blog-detail-content';
import { Badge } from '@/shared/ui/components/atoms/badge';
import { Card } from '@/shared/ui/components/atoms/card';

/**
 * ISR (Incremental Static Regeneration) 방식
 *
 * - 정적 생성 + 주기적 재생성의 하이브리드 방식
 * - fetch에 { next: { revalidate: 초 } } 옵션 사용
 * - 지정된 시간이 지나면 백그라운드에서 페이지 재생성
 *
 * 장점:
 * - SSG의 성능 + 데이터 신선도 보장
 * - CDN 캐싱 가능
 * - 전체 재빌드 없이 점진적 업데이트
 *
 * 단점:
 * - 즉시 업데이트 불가 (revalidate 시간까지 대기)
 * - 첫 요청 시 stale 데이터 제공 가능
 * - On-demand revalidation 설정 복잡
 */

// ISR 재검증 주기 (초)
const REVALIDATE_SECONDS = 60;

// 빌드/재생성 시간 기록
const GENERATED_TIME = new Date().toLocaleString('ko-KR');

interface BlogDetailISRPageProps {
  params: Promise<{ id: string }>;
}

const BlogDetailISRPage = async ({ params }: BlogDetailISRPageProps) => {
  const { id } = await params;

  // 지정된 시간마다 재검증 (ISR)
  const response = await fetch(`http://localhost:3001/blogs/${id}`, {
    next: { revalidate: REVALIDATE_SECONDS }, // 60초마다 재검증
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
    <Card className="mb-6 border-2 border-purple-200 bg-purple-50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Badge className="bg-purple-600 text-white">ISR</Badge>
        <span className="font-semibold text-purple-700">Incremental Static Regeneration</span>
      </div>
      <p className="mb-3 text-sm text-gray-600">
        정적 생성 후 주기적으로 재생성합니다. fetch(next: revalidate) 사용. SSG + 데이터 신선도의 장점을 결합.
      </p>
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="rounded bg-white px-3 py-1.5">
          🏗️ <span className="font-medium">생성/재생성 시간:</span> {GENERATED_TIME}
        </div>
        <div className="rounded bg-white px-3 py-1.5">
          🔄 <span className="font-medium">재검증 주기:</span> {REVALIDATE_SECONDS}초
        </div>
        <div className="rounded bg-white px-3 py-1.5">
          📍 <span className="font-medium">데이터 출처:</span> 캐시 (주기적 갱신)
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
        <Link href={`/blog/ssr/${id}`}>
          <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">
            SSR 버전
          </Badge>
        </Link>
      </div>
    </Card>
  );

  return <BlogDetailContent blog={blog} renderingInfo={renderingInfo} />;
};

export default BlogDetailISRPage;
