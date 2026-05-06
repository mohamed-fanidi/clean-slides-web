'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useSlideStore } from '@/store/use-slide-store'
import { useEffect, useState } from 'react'
import DraggableSlidePreview from './draggable-slide-preview'
import { Menu } from 'lucide-react'
import { useSidebarStore } from '@/store/use-sidebar-store'

const LayoutPreview = () => {
  const { getOrderedSlides, reorderSlides, currentTheme } = useSlideStore()
  const slides = getOrderedSlides()
  const [loading, setLoading] = useState(true)
  const { isSidebarOpen, toggleSidebar } = useSidebarStore()

  const moveSlide = (dragIndex: number, hoverIndex: number) => {
    reorderSlides(dragIndex, hoverIndex)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') setLoading(false)
  }, [])

  return (
    <>
      {/* Toggle Button for Small Screens */}
      <div className="sm:hidden fixed top-24 left-4 z-40">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Sticky/Fixed Sidebar Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-80 z-30 border-r shadow-xl bg-white transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0 sm:block`}
        style={{
          background: currentTheme.sidebarColor || currentTheme.backgroundColor,
          color: currentTheme.fontColor,
          fontFamily: currentTheme.fontFamily,
        }}
      >
        {/* Scrollable slide content */}
        <ScrollArea className="h-full pt-20 px-4 pb-10 space-y-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold tracking-tight">Slides</h2>
                <span className="text-sm">{slides?.length}</span>
              </div>
              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <DraggableSlidePreview
                    key={slide.id || index}
                    slide={slide}
                    index={index}
                    moveSlide={moveSlide}
                  />
                ))}
              </div>
            </>
          )}
        </ScrollArea>
      </aside>
    </>
  )
}

export default LayoutPreview
