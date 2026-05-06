import { ContentItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import React from 'react';
import { useDrag } from 'react-dnd';

type ComponentItemProps = {
  type: string;
  componentType: string;
  name: string;
  component: ContentItem;
  icon: string;
};

const ComponentCard = ({ item }: { item: ComponentItemProps }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CONTENT_ITEM',
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
      className={cn(
        'transition-all duration-300 transform w-full',
        isDragging ? 'opacity-40 scale-95' : 'opacity-100'
      )}
    >
      <button
        className={cn(
          'flex flex-col items-center justify-between gap-1 p-2 w-full rounded-lg border shadow-sm',
          'cursor-grab active:cursor-grabbing transition-transform hover:scale-105',
          'border-zinc-200 dark:border-zinc-700',
          'bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800'
        )}
      >
        <div className="w-full aspect-5/3 rounded-md p-2 shadow-inner flex items-center justify-center
          bg-gradient-to-tr from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700
        ">
          <span className="text-xl text-primary">{item.icon}</span>
        </div>
        <span className="text-[10px] font-medium text-center leading-tight text-gray-700 dark:text-gray-300">
          {item.name}
        </span>
      </button>
    </div>
  );
};

export default ComponentCard;
