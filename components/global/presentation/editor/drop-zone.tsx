'use client'

import { ContentItem } from '@/lib/types'
import { useSlideStore } from '@/store/use-slide-store'
import { useRef, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import { v4 as uuidv4 } from 'uuid'
import { cn } from '@/lib/utils'

type DropZoneProps = {
  index: number
  parentId: string
  slideId: string
}

const DropZone = ({ index, parentId, slideId }: DropZoneProps) => {
  const { addComponentInSlide } = useSlideStore()
  const divRef = useRef<HTMLDivElement | null>(null)

  const [{ isOver, canDrop }, drop] = useDrop<
    {
      type: string
      componentType: string
      label: string
      component: ContentItem
    },
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: 'CONTENT_ITEM',
    drop: (item) => {
      if (item.type === 'component') {
        addComponentInSlide(
          slideId,
          { ...item.component, id: uuidv4() },
          parentId,
          index
        )
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  useEffect(() => {
    if (divRef.current) {
      drop(divRef.current)
    }
  }, [drop])

  return (
    <div
      ref={divRef}
      className={cn(
        'transition-all duration-200 w-full px-1 sm:px-2 md:px-4',
        'border-dashed border-2 rounded-sm',
        isOver && canDrop
          ? 'border-blue-500 bg-blue-100 h-6'
          : 'border-transparent h-2 hover:border-blue-300'
      )}
    >
      {isOver && canDrop && (
        <div className="text-center text-xs sm:text-sm text-blue-600 animate-pulse">
          Drop here
        </div>
      )}
    </div>
  )
}

export default DropZone
