import BlogEditView from '@/features/blog/components/views/blog-edit-view';

interface BlogEditPageProps {
  params: Promise<{ id: string }>;
}

const BlogEditPage = async ({ params }: BlogEditPageProps) => {
  const { id } = await params;

  return <BlogEditView id={id} />;
};

export default BlogEditPage;
