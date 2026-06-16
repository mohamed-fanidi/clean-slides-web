"use client"

import React from "react"

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"

import { OutlineCard } from "@/lib/types"

import Card from "./card"
import AddCardButton from "./add-card-button"

type Props = {
  outlines: OutlineCard[]

  editingCard: string | null
  selectedCard: string | null
  editText: string

  onEditChange: (value: string) => void
  onCardSelect: (id: string) => void
  onCardDoubleClick: (id: string, title: string) => void

  setEditText: (value: string) => void
  setEditingCard: (id: string | null) => void
  setSelectedCard: (id: string | null) => void

  addMultipleOutlines: (cards: OutlineCard[]) => void
}

const CardList = ({
  outlines,

  editingCard,
  selectedCard,
  editText,

  onEditChange,
  onCardSelect,
  onCardDoubleClick,

  setEditText,
  setEditingCard,
  setSelectedCard,

  addMultipleOutlines,
}: Props) => {
  const reorder = (
    list: OutlineCard[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = [...list]

    const [removed] = result.splice(startIndex, 1)

    result.splice(endIndex, 0, removed)

    return result.map((card, index) => ({
      ...card,
      order: index + 1,
    }))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = reorder(
      outlines,
      result.source.index,
      result.destination.index
    )

    addMultipleOutlines(items)
  }

  const onCardUpdate = (id: string, newTitle: string) => {
    addMultipleOutlines(
      outlines.map((card) =>
        card.id === id ? { ...card, title: newTitle } : card
      )
    )

    setEditingCard(null)
    setSelectedCard(null)
    setEditText("")
  }

  const onCardDelete = (id: string) => {
    addMultipleOutlines(
      outlines
        .filter((card) => card.id !== id)
        .map((card, index) => ({
          ...card,
          order: index + 1,
        }))
    )
  }

  const onAddCard = (index?: number) => {
    const newCard: OutlineCard = {
      id: crypto.randomUUID(),
      title: editText || "New Section",
      order: index !== undefined ? index + 2 : outlines.length + 1,
    }

    const updated =
      index !== undefined
        ? [
            ...outlines.slice(0, index + 1),
            newCard,
            ...outlines.slice(index + 1),
          ]
        : [...outlines, newCard]

    addMultipleOutlines(
      updated.map((card, index) => ({
        ...card,
        order: index + 1,
      }))
    )

    setEditText("")
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="cards">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {outlines.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.draggableProps}>
                    <Card
                      card={card}
                      isEditing={editingCard === card.id}
                      isSelected={selectedCard === card.id}
                      isDragging={snapshot.isDragging}
                      editText={editText}
                      onEditChange={onEditChange}
                      onEditBlur={() => onCardUpdate(card.id, editText)}
                      onEditKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onCardUpdate(card.id, editText)
                        }
                      }}
                      onCardClick={() => onCardSelect(card.id)}
                      onCardDoubleClick={() =>
                        onCardDoubleClick(card.id, card.title)
                      }
                      onDeleteClick={() => onCardDelete(card.id)}
                      dragHandleProps={provided.dragHandleProps}
                    />

                    <AddCardButton onAddCard={() => onAddCard(index)} />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default CardList
