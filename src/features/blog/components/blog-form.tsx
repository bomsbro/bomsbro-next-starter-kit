import { useForm } from 'react-hook-form';

import type { BlogRequest } from '@core/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/shared/ui/components/atoms/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/components/atoms/form';
import { Input } from '@/shared/ui/components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/components/atoms/select';
import { TiptapEditor } from '@/shared/ui/components/editor';

const CATEGORIES = ['TECHNOLOGY', 'AUTOMOTIVE', 'FINANCE', 'POLITICS', 'CULTURE', 'SPORTS'] as const;

const blogFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  category: z.enum(CATEGORIES),
  author: z.string().min(1, '작성자를 입력해주세요.'),
  thumbnail: z.string().url('올바른 URL 형식을 입력해주세요.').optional().or(z.literal('')),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  initialData?: Partial<BlogRequest>;
  onSubmit: (data: BlogRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const BlogForm = ({ initialData, onSubmit, onCancel, isSubmitting = false, submitLabel = '저장' }: BlogFormProps) => {
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      content: initialData?.content ?? '',
      category: (initialData?.category as (typeof CATEGORIES)[number] | undefined) ?? CATEGORIES[0],
      author: initialData?.author ?? '',
      thumbnail: initialData?.thumbnail ?? '',
    },
  });

  const handleSubmit = (values: BlogFormValues) => {
    onSubmit({
      ...values,
      thumbnail: values.thumbnail ?? undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                제목 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="제목을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>카테고리</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                작성자 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="작성자 이름" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>썸네일 URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                내용 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <TiptapEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="블로그 내용을 작성하세요..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;
