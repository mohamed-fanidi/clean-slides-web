'use client'
import { useSlideStore } from '@/store/use-slide-store'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Palette } from 'lucide-react'
import { Theme } from '@/lib/types'
import ThemeCard from './theme-card'
import ThemePicker from './theme-picker'
import { themes } from '@/lib/constants'
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { X } from 'lucide-react'

const ThemePreview = () => {
  const params = useParams()
  const router = useRouter()
  const { currentTheme, setCurrentTheme, project } = useSlideStore()
  const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (project?.slides) router.push(`/presentation/${params.presentationId}`)
  }, [project])

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme)
    setCurrentTheme(theme)
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row"
      style={{
        background: selectedTheme.backgroundColor,
        color: selectedTheme.accentColor,
        fontFamily: selectedTheme.fontFamily,
      }}
    >
      <div className="grow pt-14 px-4 sm:px-6 md:px-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/new')}
            className="h-10 text-sm px-4"
            style={{
              background: selectedTheme.accentColor + '10',
              color: selectedTheme.accentColor,
              borderColor: selectedTheme.accentColor + '20',
            }}
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>

          <div className="md:hidden">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  className="h-10 text-sm px-4"
                  style={{
                    background: selectedTheme.accentColor,
                    color: selectedTheme.fontColor,
                  }}
                >
                  <Palette className="mr-2 w-4 h-4" /> Themes
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-[90vw] h-[80vh] p-0 bg-transparent shadow-none border-none"
                style={{ backgroundColor: 'transparent' }}
              >
                {/* Close button (top-right) */}
                <DialogClose asChild>
                  <button
                    className="absolute top-4 right-4 z-10 bg-black text-white rounded-full p-1 hover:opacity-80 transition"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </DialogClose>

                {/* ThemePicker content */}
                <div className="rounded-lg bg-white w-full h-full overflow-y-auto p-4 shadow-lg">
                  <ThemePicker
                    selectedTheme={selectedTheme}
                    themes={themes}
                    onThemeSelect={applyTheme}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="relative w-full max-w-2xl mx-auto">
          <ThemeCard
            title="Main Preview"
            description="This is the main theme preview card"
            content={
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg p-4" style={{ backgroundColor: selectedTheme.accentColor + '10' }}>
                    <p style={{ color: selectedTheme.accentColor }}>
                      This is a smart layout: it acts as a text box.
                    </p>
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: selectedTheme.accentColor + '10' }}>
                    <p style={{ color: selectedTheme.accentColor }}>
                      You can get these by typing /smart
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="h-10 text-sm w-full"
                    style={{
                      backgroundColor: selectedTheme.accentColor,
                      color: selectedTheme.fontColor,
                    }}
                  >
                    Primary
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 text-sm w-full"
                    style={{
                      backgroundColor: selectedTheme.accentColor,
                      color: selectedTheme.fontColor,
                    }}
                  >
                    Secondary
                  </Button>
                </div>
              </div>
            }
            variant="main"
            theme={selectedTheme}
          />

          {/* Left and Right Cards */}
          <div className="hidden lg:flex justify-between mt-10 gap-4">
            <ThemeCard
              title="Quick Start"
              description="Get up and running in no time"
              content={
                <div className="space-y-3 text-sm">
                  <div className="rounded-lg p-4" style={{ backgroundColor: selectedTheme.accentColor + '10' }}>
                    <ol className="list-decimal list-inside space-y-1" style={{ color: selectedTheme.accentColor }}>
                      <li>Choose a theme</li>
                      <li>Customize colors</li>
                      <li>Add content</li>
                      <li>Publish</li>
                    </ol>
                  </div>
                  <Button
                    className="h-10 text-sm w-full"
                    style={{
                      backgroundColor: selectedTheme.accentColor,
                      color: selectedTheme.fontColor,
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              }
              variant="left"
              theme={selectedTheme}
            />
            <div className="pt-12">
              <ThemeCard
                title="Theme Features"
                description="Discover what our themes can do"
                content={
                  <div className="space-y-3 text-sm">
                    <div className="rounded-lg p-4" style={{ backgroundColor: selectedTheme.accentColor + '10' }}>
                      <ul className="list-disc list-inside space-y-1" style={{ color: selectedTheme.accentColor }}>
                        <li>Responsive</li>
                        <li>Dark & Light</li>
                        <li>Custom Colors</li>
                        <li>Accessibility</li>
                      </ul>
                    </div>
                    <Button
                      variant="outline"
                      className="h-10 text-sm w-full"
                      style={{
                        backgroundColor: selectedTheme.accentColor,
                        color: selectedTheme.fontColor,
                      }}
                    >
                      Explore
                    </Button>
                  </div>
                }
                variant="right"
                theme={selectedTheme}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar ThemePicker on Desktop */}
      <div className="hidden md:block md:w-87.5 border-l">
        <ThemePicker
          selectedTheme={selectedTheme}
          themes={themes}
          onThemeSelect={applyTheme}
        />
      </div>
    </div>
  )
}

export default ThemePreview
