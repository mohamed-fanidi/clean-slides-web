"use client"

import { Slide } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useSlideStore } from "@/store/use-slide-store"
import { MasterRecursiveComponent } from "../editor/master-recursive-component"

type Props = {
  slide: Slide | undefined
  isActive: boolean
  index: number
  isSidebar?: boolean
}

const ScaledPreview = ({
  slide,
  isActive,
  index,
  isSidebar = false,
}: Props) => {
  const { currentTheme } = useSlideStore()

  if (!slide || !slide.content) return null

  const realWidth = 1080
  const realHeight = 720
  const thumbnailWidth = 200
  const scale = thumbnailWidth / realWidth
  const scaledHeight = realHeight * scale

  return (
    <div
      className={cn(
        "relative transform overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300",
        isActive
          ? "scale-[1.01] ring-2 ring-blue-500 ring-offset-2"
          : "hover:scale-[1.02] hover:shadow-lg"
      )}
      style={{
        width: `${thumbnailWidth}px`,
        height: `${scaledHeight}px`, // ✅ outer box matches scaled height
        fontFamily: currentTheme.fontFamily,
        backgroundColor: currentTheme.slideBackgroundColor,
        backgroundImage: currentTheme.gradientBackground,
        color: currentTheme.accentColor,
        position: "relative",
        overflow: "hidden", // ✅ clips the oversized inner div
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left", // ✅ scales from top-left corner
          width: `${realWidth}px`, // full 1080px, clipped by parent
          height: `${realHeight}px`,
          pointerEvents: "none",
          position: "absolute", // ✅ takes it out of flow so it doesn't push layout
          top: 0,
          left: 0,
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
  )
}

export default ScaledPreview
