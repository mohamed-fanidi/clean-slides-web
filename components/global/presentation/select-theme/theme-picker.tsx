import { generateLayouts } from "@/actions/gemini"
import { Button } from "@/components/ui/button"
import { Theme } from "@/lib/types"
import { useSlideStore } from "@/store/use-slide-store"
import { Loader, Wand2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  selectedTheme: Theme
  themes: Theme[]
  onThemeSelect: (theme: Theme) => void
}

const ThemePicker = ({ selectedTheme, onThemeSelect, themes }: Props) => {
  const router = useRouter()
  const params = useParams()
  const { project, setSlides, currentTheme } = useSlideStore()
  const [loading, setLoading] = useState(false)

  const handleGenerateThemes = async () => {
    setLoading(true)
    if (!selectedTheme) {
      toast.error("Error", {
        description: "Please select a theme",
      })
      router.push("/new")
      return
    }
    try {
      const res = await generateLayouts(
        params.presentationId as string,
        currentTheme.name
      )

      if (res.status != 200 && !res.data) {
        throw new Error("Failed to generate layouts")
      }
      toast.success("Success", {
        description: "Layouts generated successfully",
      })
      router.push(`/presentation/${project?.id}`)
      setSlides(res.data)
    } catch (error) {
      toast.error("Error", {
        description: "Failed to generate layouts",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full max-w-4xl flex-col">
      <Button
        className="h-12 w-full text-base font-medium shadow-lg transition-all duration-300 hover:shadow-xl md:text-lg"
        style={{
          background: selectedTheme.accentColor,
          color: selectedTheme.backgroundColor,
        }}
        onClick={handleGenerateThemes}
      >
        {loading ? (
          <Loader className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-5 w-5" />
        )}
        {loading ? (
          <p className="animate-pulse">Generating...</p>
        ) : (
          "Generate Theme"
        )}
      </Button>

      <div className="grid grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div key={theme.name}>
            <Button
              onClick={() => {
                onThemeSelect(theme)
              }}
              className="flex h-auto w-full flex-col items-center justify-start p-4 sm:p-6"
              style={{
                fontFamily: theme.fontFamily,
                color: theme.fontColor,
                background: theme.backgroundColor,
              }}
            >
              <div className="mb-2 flex w-full items-center justify-between">
                <span className="text-lg font-bold md:text-xl">
                  {theme.name}
                </span>
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: theme.accentColor }}
                />
              </div>
              <div className="w-full space-y-1">
                <div
                  className="text-xl font-bold"
                  style={{ color: theme.accentColor }}
                >
                  Title
                </div>
                <div className="text-sm opacity-80 md:text-base">
                  Body & <span style={{ color: theme.accentColor }}>Link</span>
                </div>
              </div>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ThemePicker
