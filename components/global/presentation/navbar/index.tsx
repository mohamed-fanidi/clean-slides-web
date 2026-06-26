"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { List, Plus } from "lucide-react"
import { useSlideStore } from "@/store/use-slide-store"
import { component, listsComponent, textComponent } from "@/lib/constants"
import LayoutChooser from "@/components/global/presentation/right-sidebar/tabs/layout-chooser"
import ThemeChooser from "@/components/global/presentation/right-sidebar/tabs/theme-chooser"
import ComponentCard from "@/components/global/presentation/right-sidebar/tabs/components-tab/component-preview"
import PresentationMode from "./presentation-mode"
import { toast } from "sonner"
import { Palette2, Play, Share, Text, Widget } from "@solar-icons/react"
import Image from "next/image"
import { exportSlidesToPptx } from "@/lib/export-pptx"

type TabType = "layout" | "component" | "theme" | null

type Props = {
  presentationId: string
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
    await exportSlidesToPptx(
      slides,
      currentTheme,
      getProjectTitle(presentationId) || "Presentation"
    )
  }

  return (
    <>
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between p-3">
        <div className="flex-1" />

        <div className="mr-1 flex items-center gap-1 rounded-xl border bg-background p-1">
          <Popover
            onOpenChange={(open) => handleTabToggle(open ? "component" : null)}
          >
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon-sm" title="Insert Text">
                <Text weight="Bold" className="size-5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="center"
              sideOffset={16}
              className="w-[90vw] max-w-52 p-0"
            >
              <ScrollArea className="h-max">
                <div className="flex flex-col space-y-6 p-2">
                  <div className="space-y-2">
                    <h3 className="px-1 text-sm font-medium text-muted-foreground">
                      Text
                    </h3>
                    <div className="flex flex-col items-center gap-2">
                      {textComponent.map((item) => (
                        <ComponentCard key={item.componentType} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <Popover
            onOpenChange={(open) => handleTabToggle(open ? "component" : null)}
          >
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon-sm" title="Add element">
                <List
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
              <ScrollArea className="h-max">
                <div className="flex flex-col space-y-6 p-2">
                  <div className="space-y-2">
                    <h3 className="px-1 text-sm font-medium text-muted-foreground">
                      Lists
                    </h3>
                    <div className="flex flex-col items-center gap-2">
                      {listsComponent.map((item) => (
                        <ComponentCard key={item.componentType} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

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
