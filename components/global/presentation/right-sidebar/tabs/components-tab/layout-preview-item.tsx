import { LayoutSlides } from "@/lib/types"
import { cn } from "@/lib/utils"
import React from "react"

type Props = {
  name: string
  Icon: React.FC<React.SVGProps<SVGSVGElement>>
  onClick?: () => void
  isSelected?: boolean
  type: string
  component?: LayoutSlides
}

const LayoutPreviewItem = ({ Icon, name, onClick, isSelected }: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full flex-col items-center justify-between gap-2 rounded-lg p-2",
        "cursor-grab transition-transform duration-300 hover:scale-[1.02] active:cursor-grabbing",
        "border bg-background",
        isSelected && "ring-2 ring-blue-500 ring-offset-2"
      )}
    >
      <div className="flex aspect-video w-full items-center justify-center rounded bg-muted-foreground/20 p-4 shadow-inner">
        <Icon className="size-6 sm:size-7 md:size-8" />
      </div>
      <span className="text-center text-sm capitalize">{name}</span>
    </button>
  )
}

export default LayoutPreviewItem
