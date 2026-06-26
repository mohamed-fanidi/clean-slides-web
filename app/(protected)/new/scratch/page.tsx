"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Plus, RotateCcw, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import useScratchStore from "@/store/use-scratch-store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CardList from "@/components/global/new/outline-card"
import { OutlineCard } from "@/lib/types"
import { v4 } from "uuid"
import { toast } from "sonner"
import { createProject } from "@/actions/project"
import { useSlideStore } from "@/store/use-slide-store"

const ScratchPage = () => {
  const router = useRouter()
  const { setProject } = useSlideStore()
  const [editText, setEditText] = useState("")
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { outlines, resetOutlines, addOutline, addMultipleOutlines } =
    useScratchStore()

  const resetCards = () => {
    setEditingCard(null)
    setSelectedCard(null)
    setEditText("")
    resetOutlines()
  }

  const handleAddCard = () => {
    const newCard: OutlineCard = {
      id: v4(),
      title: editText || "New Section",
      order: outlines.length + 1,
    }
    setEditText("")
    addOutline(newCard)
  }

  const handleGenerate = async () => {
    if (outlines.length === 0) {
      toast.error("Error", {
        description: "Please add at least one card to generate slides.",
      })
      return
    }
    setIsGenerating(true)
    try {
      const res = await createProject(outlines?.[0]?.title, outlines)

      if (res.status !== 200 || !res.data) {
        throw new Error(res.error || "Failed to create project")
      }

      setProject(res.data)
      router.push(`/presentation/${res.data.id}/select-theme`)

      toast.success("Success", {
        description: "Project created successfully!",
      })
      resetOutlines()
    } catch (error) {
      console.log(error)
      toast.error("Error", {
        description: "Failed to create project",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-10 px-4 py-12 sm:px-6">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        size="sm"
        className="w-fit"
      >
        <ChevronLeft />
        Back
      </Button>

      <h1 className="text-center text-4xl tracking-tighter">
        Build your presentation, <br /> your way
      </h1>

      <div className="rounded-xl border border-border bg-muted/40 px-4 py-3.5">
        <div className="flex items-center gap-1">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Enter a section title…"
            className="border-0 bg-transparent px-0 text-base shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && editText) handleAddCard()
            }}
          />
          <Button onClick={handleAddCard} disabled={!editText}>
            <Plus />
            Add
          </Button>
          <Button
            disabled={outlines.length === 0}
            variant="ghost"
            size="icon"
            onClick={resetCards}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Reset"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>

      <CardList
        outlines={outlines}
        addMultipleOutlines={addMultipleOutlines}
        editingCard={editingCard}
        selectedCard={selectedCard}
        editText={editText}
        onEditChange={setEditText}
        onCardSelect={setSelectedCard}
        setEditText={setEditText}
        setEditingCard={setEditingCard}
        setSelectedCard={setSelectedCard}
        onCardDoubleClick={(id, title) => {
          setEditingCard(id)
          setEditText(title)
        }}
      />

      {outlines.length > 0 && (
        <Button
          className="mx-auto mt-4 w-fit"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            "Generating..."
          ) : (
            <>
              Generate Slides <ArrowRight />
            </>
          )}
        </Button>
      )}
    </div>
  )
}

export default ScratchPage
