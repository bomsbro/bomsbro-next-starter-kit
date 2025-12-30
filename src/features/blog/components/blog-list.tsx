import Image from 'next/image';
import Link from 'next/link';

import type { Blog } from '@core/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Badge } from '@/shared/ui/components/atoms/badge';
import { Button } from '@/shared/ui/components/atoms/button';

interface BlogListProps {
  blogs: Blog[];
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
};

const BlogListItem = ({ blog }: { blog: Blog }) => (
  <article className="-mx-4 rounded-lg border-b border-gray-200 px-4 py-6 transition-colors last:border-b-0 hover:bg-gray-50">
    <Link href={`/blog/${blog.id}`} className="flex gap-6">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {blog.category}
          </Badge>
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900">{blog.title}</h3>

        <p className="mb-3 line-clamp-2 text-sm text-gray-600">{blog.content}</p>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{blog.author}</span>
          <span>·</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>
      </div>

      {blog.thumbnail && (
        <div className="relative h-24 w-32 flex-shrink-0">
          <Image src={blog.thumbnail} alt={blog.title} fill className="rounded-lg object-cover" sizes="128px" />
        </div>
      )}
    </Link>

    {/* 렌더링 방식별 상세 페이지 링크 */}
    <div className="mt-3 flex items-center gap-2">
      <span className="text-xs text-gray-400">렌더링 방식:</span>
      <Link href={`/blog/csr/${blog.id}`}>
        <Badge variant="outline" className="cursor-pointer bg-orange-50 text-orange-600 hover:bg-orange-100">
          CSR
        </Badge>
      </Link>
      <Link href={`/blog/ssg/${blog.id}`}>
        <Badge variant="outline" className="cursor-pointer bg-green-50 text-green-600 hover:bg-green-100">
          SSG
        </Badge>
      </Link>
      <Link href={`/blog/ssr/${blog.id}`}>
        <Badge variant="outline" className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100">
          SSR
        </Badge>
      </Link>
      <Link href={`/blog/isr/${blog.id}`}>
        <Badge variant="outline" className="cursor-pointer bg-purple-50 text-purple-600 hover:bg-purple-100">
          ISR
        </Badge>
      </Link>
    </div>
  </article>
);

const BlogPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: { key: string; value: number | string }[] = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    if (start > 1) {
      pages.push({ key: 'first-1', value: 1 });
      if (start > 2) pages.push({ key: 'ellipsis-start', value: '...' });
    }

    for (let i = start; i <= end; i++) {
      pages.push({ key: `page-${i}`, value: i });
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push({ key: 'ellipsis-end', value: '...' });
      pages.push({ key: `last-${totalPages}`, value: totalPages });
    }

    return pages;
  };

  return (
    <nav className="mt-8 flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {getPageNumbers().map((page) =>
        typeof page.value === 'number' ? (
          <Button
            key={page.key}
            variant={currentPage === page.value ? 'default' : 'ghost'}
            size="icon"
            onClick={() => onPageChange(page.value as number)}
          >
            {page.value}
          </Button>
        ) : (
          <span key={page.key} className="px-2 text-gray-400">
            {page.value}
          </span>
        ),
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </nav>
  );
};

const BlogList = ({ blogs, total, currentPage, totalPages, onPageChange }: BlogListProps) => (
  <>
    <div className="mb-4 text-sm text-gray-500">총 {total}개의 글</div>

    {blogs.length === 0 ? (
      <div className="py-12 text-center text-gray-500">게시글이 없습니다.</div>
    ) : (
      <div className="divide-y divide-gray-200">
        {blogs.map((blog) => (
          <BlogListItem key={blog.id} blog={blog} />
        ))}
      </div>
    )}

    <BlogPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
  </>
);

export default BlogList;
