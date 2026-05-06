'use client';

import { Slide } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSlideStore } from '@/store/use-slide-store';
import { MasterRecursiveComponent } from '../editor/master-recursive-component';

type Props = {
  slide: Slide | undefined;
  isActive: boolean;
  index: number;
  isSidebar?: boolean;
};

const ScaledPreview = ({ slide, isActive, index, isSidebar = false }: Props) => {
  const { currentTheme } = useSlideStore();

  if (!slide || !slide.id || !slide.content) return null;

  // Original slide dimensions
  const realWidth = 1080;
  const realHeight = 720;

  // Sidebar preview thumbnail size
  const thumbnailWidth = 276;
  const scale = thumbnailWidth / realWidth;
  const scaledHeight = realHeight * scale;

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden shadow-md transition-all duration-300 transform bg-white',
        isActive
          ? 'ring-2 ring-blue-500 ring-offset-2 scale-[1.01]'
          : 'hover:scale-[1.02] hover:shadow-lg'
      )}
      style={{
        width: `${thumbnailWidth}px`,
        height: `${scaledHeight}px`,
        fontFamily: currentTheme.fontFamily,
        backgroundColor: currentTheme.slideBackgroundColor,
        backgroundImage: currentTheme.gradientBackground,
        color: currentTheme.accentColor,
        position: 'relative',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${realWidth}px`,
          height: `${realHeight}px`,
          pointerEvents: 'none',
        }}
      >
        <MasterRecursiveComponent
          slideId={slide.id}
          content={slide.content}
          isPreview={true}
          isEditable={false}
          isSidebar={true}
          onContentChange={() => {}}
        />
      </div>
    </div>
  );
};

export default ScaledPreview;
