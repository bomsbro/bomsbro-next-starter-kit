'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui/components/atoms/button';
import { Spinner } from '@/shared/ui/components/atoms/spinner';

import { useBlogsQuery } from '../../hooks/use-blog-queries';
import BlogList from '../blog-list';

const CATEGORIES = ['ALL', 'TECHNOLOGY', 'AUTOMOTIVE', 'FINANCE', 'POLITICS', 'CULTURE', 'SPORTS'];
const ITEMS_PER_PAGE = 10;

const BlogView: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const { data, isLoading, isError } = useBlogsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    category: selectedCategory === 'ALL' ? undefined : selectedCategory,
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <>
      <nav className="border-t border-b border-gray-200 bg-[#E9ECEF]">
        <div className="mx-auto max-w-7xl px-6">
          <ul className="flex flex-wrap items-center justify-center gap-8 py-4">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className={selectedCategory === category ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}
                >
                  {category}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-4 flex justify-end">
          <Button asChild>
            <Link href="/blog/new">
              <Plus className="h-4 w-4" />새 글 작성
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner className="size-8" />
          </div>
        )}

        {isError && <div className="py-12 text-center text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>}

        {data && (
          <BlogList
            blogs={data.data}
            total={data.total}
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default BlogView;
