"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ArrowUp,
  ChevronLeft,
  Loader,
  Plus,
  RotateCcw,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import useCreativeAIStore from "@/store/use-creative-ai-store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CardList from "@/components/global/new/outline-card"
import { toast } from "sonner"
import { OutlineCard } from "@/lib/types"
import { v4 } from "uuid"
import { createProject } from "@/actions/project"
import { useSlideStore } from "@/store/use-slide-store"
import { generateCreativePrompt } from "@/actions/gemini"

const CreateAI = () => {
  const router = useRouter()
  const { setProject } = useSlideStore()
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [editText, setEditText] = useState("")
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const {
    currentAiPrompt,
    setCurrentAiPrompt,
    outlines,
    resetOutlines,
    addOutline,
    addMultipleOutlines,
  } = useCreativeAIStore()
  const [noOfCards, setNoOfCards] = useState(0)

  const resetCards = () => {
    setEditingCard(null)
    setSelectedCard(null)
    setEditText("")
    setCurrentAiPrompt("")
    resetOutlines()
  }

  const generateOutline = async () => {
    if (currentAiPrompt === "") {
      toast.error("Error", {
        description: "Please enter a prompt to generate an outline.",
      })
      return
    }

    setIsGenerating(true)
    const res = await generateCreativePrompt({
      prompt: currentAiPrompt,
      count: noOfCards,
    })
    if (res.status === 200 && res?.data?.outlines) {
      const cardsData: OutlineCard[] = []
      res.data?.outlines.map((outline: string, idx: number) => {
        const newCard = {
          id: v4(),
          title: outline,
          order: idx + 1,
        }
        cardsData.push(newCard)
      })
      addMultipleOutlines(cardsData)
      setNoOfCards(cardsData.length)

      toast.success("Success", {
        description: "Outlines generated successfully",
      })
    } else {
      toast.error("Error", {
        description: "Failed to generate outline. Please try again.",
      })
    }
    setIsGenerating(false)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    if (outlines.length === 0) {
      toast.error("ERROR", {
        description: "Please add at least one card to generate slides",
      })
      return
    }
    try {
      const res = await createProject(
        currentAiPrompt,
        outlines.slice(0, noOfCards)
      )

      if (res.status !== 200 || !res.data) {
        throw new Error("Unable to create project")
      }
      router.push(`/presentation/${res.data.id}/select-theme`)
      setProject(res.data)

      toast.success("Success", {
        description: "Project created successfully!",
      })
      setCurrentAiPrompt("")
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
        What would you like to <br /> create today?
      </h1>

      <div className="rounded-xl border border-border bg-muted/40 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Input
            required
            value={currentAiPrompt || ""}
            onChange={(e) => setCurrentAiPrompt(e.target.value)}
            placeholder="Describe your presentation…"
            className="border-0 bg-transparent px-0 text-base shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
          />
          <Button
            onClick={generateOutline}
            disabled={isGenerating || !currentAiPrompt || !noOfCards}
          >
            {isGenerating ? (
              <>
                <Loader className="animate-spin" />
                Generating ...
              </>
            ) : (
              <>
                Generate Outline
                <ArrowUp />
              </>
            )}
          </Button>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">Outline cards</span>
          <div className="flex items-center gap-2">
            <Select
              value={noOfCards ? noOfCards.toString() : undefined}
              onValueChange={(value) => setNoOfCards(parseInt(value))}
            >
              <SelectTrigger className="h-8 w-max text-xs">
                <SelectValue placeholder="Slide Count" />
              </SelectTrigger>

              <SelectContent>
                {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
                  <SelectItem key={n} value={n.toString()} className="text-xs">
                    {n} {n === 1 ? "Card" : "Cards"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
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
        <div className="-mt-8 flex flex-col gap-4">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() =>
              addOutline({
                id: crypto.randomUUID(),
                title: "New Section - double click to edit it",
                order: outlines.length + 1,
              })
            }
            disabled={isGenerating}
          >
            <Plus />
            Add Outline
          </Button>
          <hr />
          <Button
            className="mx-auto mt-4 w-fit"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                Generate Slides
                <ArrowRight />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default CreateAI
