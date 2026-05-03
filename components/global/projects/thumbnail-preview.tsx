"use client"

import { cn, getSlideTitle } from "@/lib/utils"
import { Slide, Theme } from "@/lib/types"
import { Image } from "lucide-react"

type Props = {
  slide: Slide
  theme: Theme
}

const ThumbnailPreview = ({ slide, theme }: Props) => {
  return (
    <div
      className={cn(
        "relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl"
      )}
      style={{
        fontFamily: theme.fontFamily,
        color: theme.accentColor,
        backgroundColor: theme.slideBackgroundColor,
        backgroundImage: theme.gradientBackground,
      }}
    >
      {slide ? (
        <div className="h-[200%] w-[200%] origin-top-left scale-[0.5] overflow-hidden p-3 text-xl font-semibold text-ellipsis whitespace-nowrap">
          {getSlideTitle(slide)}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-300/20">
          <Image className="h-6 w-6 text-gray-500" />
        </div>
      )}
    </div>
  )
}

export default ThumbnailPreview
