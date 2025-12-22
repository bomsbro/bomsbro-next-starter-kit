import BlogDetailView from '@/features/blog/components/views/blog-detail-view';

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { id } = await params;

  return <BlogDetailView id={id} />;
};

export default BlogDetailPage;
