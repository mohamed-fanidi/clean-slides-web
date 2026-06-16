"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Layout, Slide as S } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useSlideStore } from "@/store/use-slide-store"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { MasterRecursiveComponent } from "./master-recursive-component"

import { updateSlides } from "@/actions/project"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EllipsisVertical, Plus, Trash } from "lucide-react"
import { ScrollArea as LayoutScrollArea } from "@/components/ui/scroll-area"
import { layouts } from "@/lib/constants"
import LayoutPreviewItem from "@/components/global/presentation/right-sidebar/tabs/components-tab/layout-preview-item"

// ── Clickable layout item (no drag) ──────────────────────────────────────────
const ClickableLayoutItem = ({
  component,
  icon,
  layoutType,
  name,
  type,
  onSelect,
}: Layout & { onSelect: (layout: Layout) => void }) => (
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

// ── Gap between slides ────────────────────────────────────────────────────────
const SlideGap = ({
  index,
  onAdd,
}: {
  index: number
  onAdd: (index: number) => void
}) => (
  <div className="group relative flex h-6 w-full items-center justify-center">
    <div className="absolute inset-x-4 h-px bg-transparent transition-colors group-hover:bg-primary/40" />
    <button
      onClick={(e) => {
        e.stopPropagation()
        onAdd(index)
      }}
      className={cn(
        "absolute flex size-6 cursor-pointer items-center justify-center",
        "rounded-full border border-primary/50 bg-background shadow-sm",
        "scale-75 opacity-0 transition-all duration-150",
        "group-hover:scale-100 group-hover:opacity-100"
      )}
    >
      <Plus strokeWidth={2.5} className="size-3 text-primary" />
    </button>
  </div>
)

// ── Slide ─────────────────────────────────────────────────────────────────────
interface SlideProps {
  slide: S
  index: number
  handleDelete: (id: string) => void
  isEditable: boolean
}

export const Slide: React.FC<SlideProps> = React.memo(
  ({ slide, index, handleDelete, isEditable }) => {
    const ref = useRef(null)
    const { currentTheme, currentSlide, setCurrentSlide, updateContentItem } =
      useSlideStore()

    const handleContentChange = useCallback(
      (contentId: string, newContent: string | string[] | string[][]) => {
        if (isEditable) updateContentItem(slide.id, contentId, newContent)
      },
      [slide.id, isEditable, updateContentItem]
    )

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-full rounded bg-background p-4",
          "group relative flex transform-gpu flex-col transition-transform duration-300",
          index === currentSlide && "ring-2 ring-primary",
          slide.className
        )}
        style={{ backgroundImage: currentTheme.gradientBackground }}
        onClick={() => setCurrentSlide(index)}
      >
        <div className="h-full w-full">
          <MasterRecursiveComponent
            content={slide.content}
            isPreview={false}
            slideId={slide.id}
            isEditable={isEditable}
            onContentChange={handleContentChange}
          />
        </div>

        {isEditable && (
          <Popover>
            <PopoverTrigger
              asChild
              className="absolute top-2 left-2 hidden group-hover:flex"
            >
              <Button size="icon-sm" variant="ghost">
                <EllipsisVertical />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={() => handleDelete(slide.id)}>
                  <Trash className="text-red-500" />
                  Delete slide
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    )
  }
)

// ── Editor ────────────────────────────────────────────────────────────────────
type Props = { isEditable: boolean }

const Editor = ({ isEditable }: Props) => {
  const {
    getOrderedSlides,
    slides,
    project,
    removeSlide,
    currentSlide,
    addSlideAtIndex,
  } = useSlideStore()

  const orderedSlides = getOrderedSlides()
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [insertIndex, setInsertIndex] = useState<number | null>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (slideRefs.current[currentSlide]) {
      slideRefs.current[currentSlide]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [currentSlide])

  useEffect(() => {
    if (typeof window !== "undefined") setLoading(false)
  }, [])

  const saveSlides = useCallback(() => {
    if (isEditable && project) {
      ;(async () => {
        await updateSlides(project.id, JSON.parse(JSON.stringify(slides)))
      })()
    }
  }, [isEditable, project, slides])

  useEffect(() => {
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current)
    if (isEditable) {
      autoSaveTimeoutRef.current = setTimeout(() => saveSlides(), 2000)
    }
    return () => {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current)
    }
  }, [slides, isEditable, project])

  const handleDelete = useCallback(
    (id: string) => {
      if (isEditable) removeSlide(id)
    },
    [isEditable, removeSlide]
  )

  const handleGapClick = (index: number) => {
    setInsertIndex(index)
    setDialogOpen(true)
  }

  const handleLayoutSelect = (layout: Layout) => {
    if (insertIndex === null) return

    const newSlide: S = {
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

  return (
    <>
      <div
        className={cn("flex h-full w-full flex-1 flex-col overflow-x-hidden")}
      >
        <ScrollArea className="flex-1 overflow-x-hidden">
          <div className="flex flex-col">
            {/* Gap before first slide — only show in edit mode */}
            {isEditable && <SlideGap index={0} onAdd={handleGapClick} />}

            {orderedSlides.map((slide, index) => (
              <React.Fragment key={slide.id || index}>
                <Slide
                  slide={slide}
                  index={index}
                  handleDelete={handleDelete}
                  isEditable={isEditable}
                />
                {isEditable && (
                  <SlideGap index={index + 1} onAdd={handleGapClick} />
                )}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a slide</DialogTitle>
          </DialogHeader>
          <LayoutScrollArea className="h-96">
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
          </LayoutScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Editor
