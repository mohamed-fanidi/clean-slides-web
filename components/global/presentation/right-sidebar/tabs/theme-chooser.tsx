"use client"

import { updateTheme } from "@/actions/project"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { themes } from "@/lib/constants"
import { Theme } from "@/lib/types"
import { useSlideStore } from "@/store/use-slide-store"
import { useTheme } from "next-themes"
import { toast } from "sonner"

const ThemeChooser = () => {
  const { setTheme } = useTheme()
  const { currentTheme, setCurrentTheme, project } = useSlideStore()

  const handleThemeChange = async (theme: Theme) => {
    if (!project) {
      toast.error("Error", {
        description: "Failed to update theme.",
      })
      return
    }

    setTheme(theme.type)
    setCurrentTheme(theme)

    try {
      const res = await updateTheme(project.id, theme.name)
      if (res.status !== 200) throw new Error("Failed to update theme")

      toast.success("Success", { description: "Updated theme" })
    } catch (error) {
      console.log(error)
      toast.error("Error", {
        description: "Failed to update theme",
      })
    }
  }

  return (
    <ScrollArea className="h-100 pr-2">
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <Button
            key={theme.name}
            onClick={() => handleThemeChange(theme)}
            variant={currentTheme.name === theme.name ? "default" : "outline"}
            className={`flex aspect-video h-auto w-full flex-col items-start justify-start gap-1 rounded-lg border p-3 text-left backdrop-blur-md transition-opacity hover:opacity-80`}
            style={{
              fontFamily: theme.fontFamily,
              color: theme.fontColor,
              background: theme.gradientBackground || theme.backgroundColor,
            }}
          >
            <div className="mb-1 flex w-full items-center justify-between">
              <span className="text-base font-bold tracking-tight sm:text-lg">
                {theme.name}
              </span>
              <div
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: theme.accentColor }}
              />
            </div>

            <div className="w-full space-y-1">
              <div
                className="text-xl font-extrabold"
                style={{ color: theme.accentColor }}
              >
                Title
              </div>
              <div className="text-sm opacity-80">
                Body & <span style={{ color: theme.accentColor }}>link</span>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}

export default ThemeChooser
