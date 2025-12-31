'use client';

import { useTransition } from 'react';

import { Button } from '@/shared/ui/components/atoms/button';

import { revalidateBlogByTag } from '../../actions';

interface RevalidateButtonProps {
  id: string;
}

export const RevalidateTagButton = ({ id }: RevalidateButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleRevalidate = () => {
    startTransition(async () => {
      await revalidateBlogByTag(id);
    });
  };

  return (
    <Button
      onClick={handleRevalidate}
      disabled={isPending}
      size="sm"
      variant="outline"
      className="border-orange-300 bg-white text-orange-700 hover:bg-orange-100"
    >
      {isPending ? '재검증 중...' : '🔄 revalidateTag()'}
    </Button>
  );
};

