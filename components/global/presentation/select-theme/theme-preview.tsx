"use client"

import { generateLayouts } from "@/actions/gemini"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { themes } from "@/lib/constants"
import { Theme } from "@/lib/types"
import { useSlideStore } from "@/store/use-slide-store"
import { cn } from "@/lib/utils"
import { ArrowRight, ChevronLeft, Loader, Sparkles, Wand2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const ThemePreview = () => {
  const router = useRouter()
  const params = useParams()
  const { project, setSlides, currentTheme, setCurrentTheme } = useSlideStore()
  const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (project?.slides) router.push(`/presentation/${params.presentationId}`)
  }, [project])

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme)
    setCurrentTheme(theme)
  }

  const handleGenerateThemes = async () => {
    setLoading(true)
    if (!selectedTheme) {
      toast.error("Error", { description: "Please select a theme" })
      router.push("/new")
      return
    }
    try {
      const res = await generateLayouts(
        params.presentationId as string,
        currentTheme.name
      )
      if (res.status !== 200 && !res.data) {
        throw new Error("Failed to generate layouts")
      }
      toast.success("Success", {
        description: "Layouts generated successfully",
      })
      setSlides(res.data)
      router.push(`/presentation/${project?.id}`)
    } catch {
      toast.error("Error", { description: "Failed to generate layouts" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-12 px-4 py-12 sm:px-6">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        size="sm"
        className="w-fit gap-1 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="space-y-2 text-center">
        <h1 className="text-4xl tracking-tighter">Pick a theme</h1>
        <p className="text-sm text-muted-foreground">
          Choose a visual style for your presentation
        </p>
      </div>

      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent>
          {themes.map((theme) => {
            const isSelected = selectedTheme.name === theme.name
            return (
              <CarouselItem
                key={theme.name}
                className="basis-full sm:basis-1/2 md:basis-1/3"
              >
                <button
                  onClick={() => applyTheme(theme)}
                  className={cn(
                    "aspect-video w-full cursor-pointer rounded-xl border-3 p-5 text-left transition-all duration-200 focus:outline-none",
                    isSelected
                      ? "border-foreground/60"
                      : "border-border hover:border-foreground/30"
                  )}
                  style={{
                    fontFamily: theme.fontFamily,
                    background: theme.backgroundColor,
                    color: theme.fontColor,
                  }}
                >
                  <div className="space-y-2">
                    <div
                      className="leading-tighter text-xl font-bold capitalize"
                      style={{ color: theme.accentColor }}
                    >
                      {theme.name}
                    </div>
                    <div className="text-xs opacity-70">
                      This is body text &{" "}
                      <span style={{ color: theme.accentColor }}>link</span>
                    </div>
                  </div>
                </button>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        <CarouselPrevious className="-left-4 sm:-left-10" />
        <CarouselNext className="-right-4 sm:-right-10" />
      </Carousel>

      <p className="text-center text-xs text-muted-foreground">
        Selected:{" "}
        <span className="font-medium text-foreground">
          {selectedTheme.name}
        </span>
      </p>

      <Button
        className="mx-auto w-fit text-sm font-medium transition-opacity duration-200 hover:opacity-90"
        style={{
          background: selectedTheme.accentColor,
          color: selectedTheme.backgroundColor,
        }}
        onClick={handleGenerateThemes}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader className="animate-spin" />
            Generating…
          </>
        ) : (
          <>
            Generate Presentation
            <ArrowRight />
          </>
        )}
      </Button>
    </div>
  )
}

export default ThemePreview
