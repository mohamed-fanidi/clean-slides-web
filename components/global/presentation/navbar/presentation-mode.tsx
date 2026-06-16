"use client"
import { useEffect, useState } from "react"
import { useSlideStore } from "@/store/use-slide-store"
import { MasterRecursiveComponent } from "../editor/master-recursive-component"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

type Props = {
  onClose: () => void
}

const PresentationMode = ({ onClose }: Props) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const { getOrderedSlides } = useSlideStore()
  const slides = getOrderedSlides()
  const isLastSlide = currentSlideIndex === slides.length - 1

  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))
  }

  const goToNextSlide = () => {
    if (!isLastSlide) {
      setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))
    } else {
      onClose()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        goToNextSlide()
      } else if (e.key === "ArrowLeft") {
        goToPreviousSlide()
      } else if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSlideIndex, slides.length])

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background">
      <div className="relative h-full w-full overflow-hidden border">
        <div
          key={currentSlideIndex}
          className={`h-full w-full overflow-auto p-10 pt-30`}
          style={{
            maxHeight: "100vh",
          }}
        >
          <div className="mx-auto w-full max-w-300">
            <MasterRecursiveComponent
              content={slides[currentSlideIndex].content}
              slideId={slides[currentSlideIndex].id}
              isPreview={true}
              isEditable={false}
              onContentChange={() => {}}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-4 right-4 text-muted-foreground"
          onClick={onClose}
        >
          <X />
        </Button>

        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-muted p-1">
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={goToPreviousSlide}
            disabled={currentSlideIndex === 0}
            className="rounded-full text-muted-foreground hover:bg-foreground/5!"
          >
            <ChevronLeft className="size-6" />
          </Button>

          <Button
            disabled={isLastSlide}
            variant="ghost"
            size="icon-lg"
            onClick={goToNextSlide}
            className="rounded-full text-muted-foreground hover:bg-foreground/5!"
          >
            <ChevronRight className="size-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PresentationMode
