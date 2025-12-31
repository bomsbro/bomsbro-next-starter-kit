'use client';

import { useTransition } from 'react';

import { Button } from '@/shared/ui/components/atoms/button';

import { revalidateBlogByPath } from '../../actions';

interface RevalidateButtonProps {
  id: string;
}

export const RevalidatePathButton = ({ id }: RevalidateButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleRevalidate = () => {
    startTransition(async () => {
      await revalidateBlogByPath(id);
    });
  };

  return (
    <Button
      onClick={handleRevalidate}
      disabled={isPending}
      size="sm"
      variant="outline"
      className="border-purple-300 bg-white text-purple-700 hover:bg-purple-100"
    >
      {isPending ? '재검증 중...' : '🔄 revalidatePath()'}
    </Button>
  );
};

