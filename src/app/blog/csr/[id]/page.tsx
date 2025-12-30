'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import BlogDetailContent from '@/features/blog/components/blog-detail-content';
import { useBlogQuery } from '@/features/blog/hooks/use-blog-queries';
import { Badge } from '@/shared/ui/components/atoms/badge';
import { Button } from '@/shared/ui/components/atoms/button';
import { Card } from '@/shared/ui/components/atoms/card';
import { Spinner } from '@/shared/ui/components/atoms/spinner';

/**
 * CSR (Client-Side Rendering) 방식
 *
 * - 'use client' 지시어로 클라이언트 컴포넌트로 설정
 * - React Query(TanStack Query)를 사용하여 데이터 fetching
 * - 브라우저에서 JavaScript가 실행된 후 데이터 로딩
 *
 * 장점:
 * - 서버 부하 최소화
 * - React Query의 캐싱, 재시도, 상태 관리 활용
 * - 사용자 인터랙션에 즉각 반응
 *
 * 단점:
 * - 초기 로딩 시 빈 화면 또는 스피너 노출
 * - SEO에 불리함 (크롤러가 JS를 실행하지 않으면 콘텐츠를 볼 수 없음)
 */
const BlogDetailCSRPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const blogId = Number(id);

  const { data: blog, isLoading, isError } = useBlogQuery(blogId);
  const clientTime = useMemo(() => new Date().toLocaleString('ko-KR'), []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Card className="mb-6 border-2 border-orange-200 bg-orange-50 p-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-orange-500 text-white">CSR</Badge>
            <span className="font-semibold text-orange-700">Client-Side Rendering</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">🔄 React Query로 데이터를 가져오는 중...</p>
        </Card>
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

  const renderingInfo = (
    <Card className="mb-6 border-2 border-orange-200 bg-orange-50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Badge className="bg-orange-500 text-white">CSR</Badge>
        <span className="font-semibold text-orange-700">Client-Side Rendering</span>
      </div>
      <p className="mb-3 text-sm text-gray-600">
        브라우저에서 React Query(TanStack Query)로 데이터를 가져와 렌더링합니다.
      </p>
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="rounded bg-white px-3 py-1.5">
          🖥️ <span className="font-medium">클라이언트 시간:</span> {clientTime}
        </div>
        <div className="rounded bg-white px-3 py-1.5">
          📍 <span className="font-medium">데이터 출처:</span> 브라우저 (React Query)
        </div>
      </div>
      <div className="mt-3 flex gap-2">
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

export default BlogDetailCSRPage;
