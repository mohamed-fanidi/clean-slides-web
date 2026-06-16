"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from "lucide-react"
import { useSlideStore } from "@/store/use-slide-store"
import { component } from "@/lib/constants"
import LayoutChooser from "@/components/global/presentation/right-sidebar/tabs/layout-chooser"
import ThemeChooser from "@/components/global/presentation/right-sidebar/tabs/theme-chooser"
import ComponentCard from "@/components/global/presentation/right-sidebar/tabs/components-tab/component-preview"
import PresentationMode from "./presentation-mode"
import { toast } from "sonner"
import {
  Gallery,
  Palette2,
  Play,
  Share,
  Text,
  Widget,
} from "@solar-icons/react"
import Image from "next/image"

type TabType = "layout" | "component" | "theme" | null

type Props = {
  presentationId: string
}

async function fetchBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Fetch failed for: ${url}`)
    const blob = await res.blob()
    const reader = new FileReader()
    return await new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const result = reader.result as string
        resolve(result.startsWith("data:") ? result : null)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (e) {
    console.warn("Failed image fetch:", url, e)
    return null
  }
}

function extractContentBlocks(content: any): any[] {
  if (!content) return []
  if (Array.isArray(content)) return content.flatMap(extractContentBlocks)
  if (typeof content === "object") {
    const nested = extractContentBlocks(content.content || content.children)
    return [content, ...nested]
  }
  return []
}

const Navbar = ({ presentationId }: Props) => {
  const { slides, getProjectTitle, currentTheme } = useSlideStore()
  const [activeTab, setActiveTab] = useState<TabType>(null)
  const [isPresMode, setPresMode] = useState(false)

  const handleTabToggle = (tabName: TabType) => {
    setActiveTab((prev) => (prev === tabName ? null : tabName))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/share/${presentationId}`
    )
    toast.success("Link Copied")
  }

  const handleDownload = async () => {
    const pptxgen = (await import("pptxgenjs")).default
    const pres = new pptxgen()

    const theme = {
      fontFamily: currentTheme?.fontFamily?.replace(/['"]+/g, "") || "Arial",
      fontColor: currentTheme?.fontColor || "#000000",
      accentColor: currentTheme?.accentColor || "#0ea5e9",
      slideBackgroundColor: currentTheme?.slideBackgroundColor || "#ffffff",
    }

    const validHex = /^#([A-Fa-f0-9]{6})$/
    const slideBg = validHex.test(theme.slideBackgroundColor)
      ? theme.slideBackgroundColor
      : "#ffffff"

    for (const slide of slides) {
      const s = pres.addSlide()
      s.background = { fill: slideBg }

      const blocks = extractContentBlocks(slide.content)
      let y = 0.5

      if (blocks.length === 0) {
        s.addText("Empty Slide", {
          x: 0.5,
          y,
          w: 9,
          fontSize: 24,
          fontFace: theme.fontFamily,
          color: theme.accentColor,
          bold: true,
        })
        continue
      }

      for (const block of blocks) {
        const text = block.content || block.placeholder || ""

        if (block.type === "heading1") {
          s.addText(text, {
            x: 0.5,
            y,
            w: 9,
            fontSize: 28,
            bold: true,
            fontFace: theme.fontFamily,
            color: theme.fontColor,
          })
          y += 1
        }

        if (block.type === "heading2") {
          s.addText(text, {
            x: 0.5,
            y,
            w: 9,
            fontSize: 24,
            bold: true,
            fontFace: theme.fontFamily,
            color: theme.accentColor,
          })
          y += 0.8
        }

        if (block.type === "paragraph") {
          s.addText(text, {
            x: 0.5,
            y,
            w: 9,
            fontSize: 20,
            fontFace: theme.fontFamily,
            color: theme.fontColor,
          })
          y += 1
        }

        if (
          block.type === "image" &&
          typeof block.content === "string" &&
          block.content.startsWith("http")
        ) {
          const base64 = await fetchBase64(block.content)
          if (base64) {
            s.addImage({ x: 0.5, y, w: 6, h: 3.5, data: base64 })
            y += 4
          } else {
            console.warn("Skipped image:", block.content)
          }
        }
      }
    }

    await pres.writeFile({
      fileName: `${getProjectTitle(presentationId)}.pptx`,
    })
  }

  return (
    <>
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between p-3">
        <div className="flex-1" />

        <div className="mr-1 flex items-center gap-1 rounded-xl border bg-background p-1">
          <Button variant="ghost" size="icon-sm" title="Insert Text">
            <Text weight="Bold" className="size-5 text-muted-foreground" />
          </Button>

          <Button variant="ghost" size="icon-sm" title="Insert Image">
            <Gallery weight="Bold" className="size-5 text-muted-foreground" />
          </Button>

          <Popover
            onOpenChange={(open) => handleTabToggle(open ? "component" : null)}
          >
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon-sm" title="Add element">
                <Plus
                  strokeWidth={2}
                  className="size-5.5 text-muted-foreground"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="center"
              sideOffset={16}
              className="w-[90vw] max-w-52 p-0"
            >
              <ScrollArea className="h-100">
                <div className="flex flex-col space-y-6 p-2">
                  {component.map((group, idx) => (
                    <div className="space-y-2" key={idx}>
                      <h3 className="px-1 text-sm font-medium text-muted-foreground">
                        {group.name}
                      </h3>
                      <div className="flex flex-col items-center gap-2">
                        {group.components.map((item) => (
                          <ComponentCard key={item.componentType} item={item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-1 rounded-xl border bg-background p-1">
          <Popover
            onOpenChange={(open) => handleTabToggle(open ? "layout" : null)}
          >
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon-sm" title="AI suggestions">
                <Widget
                  weight="Bold"
                  className="size-5 text-muted-foreground"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="center"
              sideOffset={16}
              className="w-[90vw] max-w-120 p-0"
            >
              <LayoutChooser />
            </PopoverContent>
          </Popover>

          <Popover
            onOpenChange={(open) => handleTabToggle(open ? "theme" : null)}
          >
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon-sm" title="Color & styling">
                <Palette2
                  weight="Bold"
                  className="size-5 text-muted-foreground"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="center"
              sideOffset={16}
              className="w-[90vw] max-w-105"
            >
              <ThemeChooser />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center gap-1 rounded-xl border bg-background p-1">
            <Button variant="secondary" size="icon-sm" onClick={handleCopy}>
              <Share weight="Bold" />
            </Button>

            <Button
              onClick={handleDownload}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              Export as PPT
              <Image
                src="/ppt.svg"
                alt="PPT LOGO"
                width={16}
                height={16}
                className="size-4"
              />
            </Button>

            <Button
              size="sm"
              variant="default"
              onClick={() => setPresMode(true)}
            >
              Present
              <Play weight="Bold" />
            </Button>
          </div>
        </div>
      </nav>

      {isPresMode && <PresentationMode onClose={() => setPresMode(false)} />}
    </>
  )
}

export default Navbar
