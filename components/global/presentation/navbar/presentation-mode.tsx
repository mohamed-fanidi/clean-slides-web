'use client';
import { useEffect, useState } from 'react';
import { useSlideStore } from '@/store/use-slide-store';
import { MasterRecursiveComponent } from '../editor/master-recursive-component';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type Props = {
  onClose: () => void;
};

const PresentationMode = ({ onClose }: Props) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { currentTheme, getOrderedSlides } = useSlideStore();
  const slides = getOrderedSlides();
  const isLastSlide = currentSlideIndex === slides.length - 1;

  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNextSlide = () => {
    if (!isLastSlide) {
      setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
    } else {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousSlide();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div
        className="relative w-full h-full overflow-hidden rounded-lg shadow-2xl border border-white/10"
        style={{
          backgroundColor: currentTheme.slideBackgroundColor,
          backgroundImage: currentTheme.gradientBackground,
          fontFamily: currentTheme.fontFamily,
        }}
      >
          <div
            key={currentSlideIndex}
            className={`w-full h-full overflow-auto pt-30 p-10 text-white`}
            style={{
              color: currentTheme.accentColor,
              maxHeight: '100vh',
            }}
          >
            <div className="w-full max-w-300 mx-auto">
              <MasterRecursiveComponent
                content={slides[currentSlideIndex].content}
                slideId={slides[currentSlideIndex].id}
                isPreview={false}
                isEditable={false}
                onContentChange={() => {}}
              />
            </div>
          </div>

        {/* Top Right Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Bottom Center Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousSlide}
            disabled={currentSlideIndex === 0}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {!isLastSlide && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextSlide}
              className="text-white hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresentationMode;
