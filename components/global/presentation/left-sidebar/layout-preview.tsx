"use client"

import { Button } from "@/components/ui/button"
import { useSlideStore } from "@/store/use-slide-store"
import { useEffect, useState } from "react"
import { ChevronLeft, GripVertical, Plus } from "lucide-react"
import { useSidebarStore } from "@/store/use-sidebar-store"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { layouts } from "@/lib/constants"
import { Layout, Slide } from "@/lib/types"
import LayoutPreviewItem from "@/components/global/presentation/right-sidebar/tabs/components-tab/layout-preview-item"

// Click-only version of the layout item (no drag)
const ClickableLayoutItem = ({
  component,
  icon,
  layoutType,
  name,
  type,
  onSelect,
}: Layout & { onSelect: (layout: Layout) => void }) => {
  return (
    <div
      className="cursor-pointer rounded-lg"
      onClick={() => onSelect({ component, icon, layoutType, name, type })}
    >
      <LayoutPreviewItem
        name={name}
        Icon={icon}
        type={type}
        component={component}
      />
    </div>
  )
}

const SlideGap = ({
  index,
  onAdd,
  hidden,
}: {
  index: number
  onAdd: (index: number) => void
  hidden: boolean
}) => {
  return (
    <div
      className={cn(
        "group relative flex h-2 w-full items-center justify-center",
        hidden && "opacity-0"
      )}
    >
      <div className="absolute inset-x-2 h-px bg-transparent transition-colors group-hover:bg-primary/40" />
      <button
        onClick={(e) => {
          e.stopPropagation()
          onAdd(index)
        }}
        className={cn(
          "absolute flex size-5 cursor-pointer items-center justify-center",
          "rounded-full border border-primary/50 bg-background shadow-sm",
          "scale-75 opacity-0 transition-all duration-150",
          "group-hover:scale-100 group-hover:opacity-100"
        )}
      >
        <Plus strokeWidth={2.5} className="size-3 text-primary" />
      </button>
    </div>
  )
}

const LayoutPreview = ({ presentationId }: { presentationId: string }) => {
  const {
    getOrderedSlides,
    currentSlide,
    setCurrentSlide,
    getProjectTitle,
    addSlideAtIndex,
    reorderSlides,
  } = useSlideStore()
  const slides = getOrderedSlides()
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [insertIndex, setInsertIndex] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)

  const { isSidebarOpen } = useSidebarStore()

  const onDragStart = () => setDragging(true)

  const onDragEnd = (result: DropResult) => {
    setDragging(false)
    if (!result.destination) return
    if (result.destination.index === result.source.index) return
    reorderSlides(result.source.index, result.destination.index)
  }

  const handleGapClick = (index: number) => {
    setInsertIndex(index)
    setDialogOpen(true)
  }

  const handleLayoutSelect = (layout: Layout) => {
    if (insertIndex === null) return

    const newSlide: Slide = {
      id: "",
      slideName: layout.component.slideName,
      type: layout.component.type,
      content: layout.component.content,
      slideOrder: insertIndex,
      className: layout.component.className,
    }

    addSlideAtIndex(newSlide, insertIndex)
    setDialogOpen(false)
    setInsertIndex(null)
  }

  useEffect(() => {
    if (typeof window !== "undefined") setLoading(false)
  }, [])

  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 m-2 flex h-[calc(100dvh-16px)] w-52 flex-col",
          "overflow-hidden rounded-xl border bg-background dark:bg-card",
          "transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "sm:translate-x-0"
        )}
      >
        <header className="flex shrink-0 items-center gap-0 border-b p-1">
          <Button
            asChild
            size="icon-sm"
            variant="ghost"
            className="text-muted-foreground"
          >
            <Link href="/dashboard">
              <ChevronLeft />
            </Link>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="min-w-0 flex-1 justify-start truncate px-1 text-muted-foreground capitalize"
          >
            <span className="block truncate">
              {getProjectTitle(presentationId)}
            </span>
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <Droppable droppableId="slide-list">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex w-full flex-col"
                >
                  {slides.map((slide, index) => (
                    <div key={slide.slideOrder} className="flex flex-col">
                      <Draggable
                        draggableId={String(slide.slideOrder)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            onClick={() => setCurrentSlide(slide.slideOrder)}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              "group flex h-8 w-full cursor-pointer items-center truncate overflow-hidden rounded border bg-background text-sm dark:bg-card",
                              snapshot.isDragging &&
                                "opacity-80 shadow-md ring-1 ring-primary",
                              currentSlide === slide.slideOrder &&
                                "ring-2 ring-primary"
                            )}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="flex aspect-square h-8 cursor-grab items-center justify-center border-r bg-muted active:cursor-grabbing"
                            >
                              <span className="text-xs group-hover:hidden">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <GripVertical
                                strokeWidth={1}
                                className="hidden size-3 text-muted-foreground group-hover:block"
                              />
                            </div>
                            <div className="w-fit justify-baseline truncate! pl-2">
                              {slide.slideName}
                            </div>
                          </div>
                        )}
                      </Draggable>

                      <SlideGap
                        index={index + 1}
                        hidden={dragging}
                        onAdd={handleGapClick}
                      />
                    </div>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </aside>

      {/* Layout chooser dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a slide</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="p-2">
              {layouts.map((group) => (
                <div key={group.name} className="mb-4">
                  <h3 className="my-4 text-xs font-medium text-muted-foreground uppercase">
                    {group.name}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {group.layouts.map((layout) => (
                      <ClickableLayoutItem
                        key={layout.layoutType}
                        {...layout}
                        onSelect={handleLayoutSelect}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LayoutPreview
