'use client'

import { updateTheme } from '@/actions/project'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { themes } from '@/lib/constants'
import { Theme } from '@/lib/types'
import { useSlideStore } from '@/store/use-slide-store'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

const ThemeChooser = () => {
  const { setTheme } = useTheme()
  const { currentTheme, setCurrentTheme, project } = useSlideStore()

  const handleThemeChange = async (theme: Theme) => {
    if (!project) {
      toast.error('Error', {
        description: 'Failed to update theme.',
      })
      return
    }

    setTheme(theme.type)
    setCurrentTheme(theme)

    try {
      const res = await updateTheme(project.id, theme.name)
      if (res.status !== 200) throw new Error('Failed to update theme')

      toast.success('Success', { description: 'Updated theme' })
    } catch (error) {
      console.log(error)
      toast.error('Error', {
        description: 'Failed to update theme',
      })
    }
  }

  return (
    <ScrollArea className="h-100 pr-2">
      <div className="mb-4 text-center font-bold text-lg tracking-wide">
        🎨 Themes
      </div>

      <div className="flex flex-col space-y-4">
        {themes.map((theme) => (
          <Button
            key={theme.name}
            onClick={() => handleThemeChange(theme)}
            variant={currentTheme.name === theme.name ? 'default' : 'outline'}
            className={`
              flex flex-col items-start justify-start px-4 py-3 w-full h-auto
              rounded-2xl border transition-all duration-300 ease-in-out
              shadow-md hover:shadow-2xl hover:scale-[1.02]
              hover:-translate-y-1 backdrop-blur-md text-left space-y-1
            `}
            style={{
              fontFamily: theme.fontFamily,
              color: theme.fontColor,
              background: theme.gradientBackground || theme.backgroundColor,
            }}
          >
            <div className="w-full flex items-center justify-between mb-1">
              <span className="text-base sm:text-lg font-bold tracking-tight">
                {theme.name}
              </span>
              <div
                className="w-3 h-3 rounded-full shadow-sm"
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
                Body &{' '}
                <span style={{ color: theme.accentColor }}>link</span>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}

export default ThemeChooser
