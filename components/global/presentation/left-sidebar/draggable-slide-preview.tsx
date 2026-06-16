"use client"

import React, { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { cn } from "@/lib/utils"
import { Slide } from "@/lib/types"
import { useSlideStore } from "@/store/use-slide-store"
import ScaledPreview from "./scaled-preview"

interface Props {
  slide: Slide
  index: number
  moveSlide: (dragIndex: number, hoverIndex: number) => void
}

const DraggableSlidePreview: React.FC<Props> = ({
  slide,
  index,
  moveSlide,
}) => {
  const { setCurrentSlide, currentSlide } = useSlideStore()
  const ref = useRef<HTMLDivElement | null>(null)

  const [, drop] = useDrop({
    accept: "SLIDE",
    hover(item: { index: number }, monitor) {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return
      moveSlide(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: "SLIDE",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      onClick={() => setCurrentSlide(index)}
      className={cn(
        "relative mx-auto w-full max-w-75 cursor-pointer transition-all duration-300",
        isDragging ? "scale-95 opacity-50" : "opacity-100"
      )}
    >
      <div className="w-full overflow-hidden">
        <ScaledPreview
          slide={slide}
          index={index}
          isActive={currentSlide === index}
          isSidebar={true}
        />
      </div>
    </div>
  )
}

export default DraggableSlidePreview
