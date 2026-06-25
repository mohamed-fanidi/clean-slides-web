import { Button } from "@/components/ui/button"
import { ContentItem } from "@/lib/types"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import React from "react"
import { useDrag } from "react-dnd"

type ComponentItemProps = {
  type: string
  componentType: string
  name: string
  component: ContentItem
  icon: LucideIcon
}

const ComponentCard = ({ item }: { item: ComponentItemProps }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CONTENT_ITEM",
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
      className={cn(
        "w-full transform transition-all duration-300",
        isDragging ? "scale-95 opacity-40" : "opacity-100"
      )}
    >
      <Button
        variant="secondary"
        className="w-full cursor-grab justify-baseline rounded border active:cursor-grabbing"
      >
        <item.icon strokeWidth={1} />
        <span> {item.name}</span>
      </Button>
    </div>
  )
}

export default ComponentCard
