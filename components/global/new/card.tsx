"use client"

import React, { useEffect, useRef } from "react"
import { Trash2, X } from "lucide-react"
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd"

import { OutlineCard } from "@/lib/types"
import { Card as UICard } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
  card: OutlineCard

  isEditing: boolean
  isSelected: boolean
  isDragging?: boolean

  editText: string
  onEditChange: (value: string) => void
  onEditBlur: () => void
  onEditKeyDown: (e: React.KeyboardEvent) => void

  onCardClick: () => void
  onCardDoubleClick: () => void
  onDeleteClick: () => void

  dragHandleProps?: DraggableProvidedDragHandleProps | null
}

const Card = ({
  card,
  isEditing,
  isSelected,
  isDragging,
  editText,
  onEditChange,
  onEditBlur,
  onEditKeyDown,
  onCardClick,
  onCardDoubleClick,
  onDeleteClick,
  dragHandleProps,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  return (
    <div
      className={`transition-all duration-200 ${isDragging && "scale-[0.98]"}`}
    >
      <UICard
        {...dragHandleProps}
        onClick={onCardClick}
        onDoubleClick={onCardDoubleClick}
        className={`cursor-grab bg-muted/40 p-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing ${
          isEditing || isSelected ? "border-primary" : ""
        } ${isDragging ? "rotate-1 shadow-lg" : "rotate-0 shadow-none"} `}
      >
        <div className="flex items-center justify-between gap-4">
          {isEditing ? (
            <Input
              ref={inputRef}
              value={editText}
              onChange={(e) => onEditChange(e.target.value)}
              onBlur={onEditBlur}
              onKeyDown={onEditKeyDown}
              className="rounded border-none bg-secondary ring-0! sm:text-lg"
            />
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex aspect-square h-full items-center justify-center rounded bg-secondary px-4">
                {card.order}
              </span>
              <span className="text-sm">{card.title}</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteClick()
            }}
          >
            <X />
          </Button>
        </div>
      </UICard>
    </div>
  )
}

export default Card
