import { LayoutSlides } from '@/lib/types';
import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  name: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>; // ✅ Accepts className, etc.
  onClick?: () => void;
  isSelected?: boolean;
  type: string;
  component?: LayoutSlides;
};

const LayoutPreviewItem = ({
  Icon,
  name,
  onClick,
  isSelected,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-between gap-2 p-3 w-full rounded-xl',
        'cursor-grab active:cursor-grabbing transition-transform duration-300 hover:scale-[1.03]',
        'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-md hover:shadow-xl',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
    >
      <div
        className="w-full aspect-video rounded-lg shadow-inner flex items-center justify-center 
        bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 p-4"
      >
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
      </div>
      <span className="text-xs sm:text-sm font-semibold text-center text-gray-700 dark:text-gray-300">
        {name}
      </span>
    </button>
  );
};

export default LayoutPreviewItem;
