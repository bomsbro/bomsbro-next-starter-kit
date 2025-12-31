'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

const createResult = () => ({ success: true, timestamp: new Date().toISOString() });

export async function revalidateBlogByPath(id: string): Promise<{ success: boolean; timestamp: string }> {
  revalidatePath(`/blog/isr-path/${id}`);
  return createResult();
}

export async function revalidateBlogByTag(id: string): Promise<{ success: boolean; timestamp: string }> {
  revalidateTag(`blog-${id}`, 'page');
  return createResult();
}

export async function revalidateAllBlogPages(id: string): Promise<{ success: boolean; timestamp: string }> {
  // Path 기반 재검증
  revalidatePath(`/blog/isr-path/${id}`);
  // Tag 기반 재검증
  revalidateTag(`blog-${id}`, 'page');
  return createResult();
}
