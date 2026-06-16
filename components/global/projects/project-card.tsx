"use client"
import Link from "next/link"
import { PresentationMenu } from "./presentation-menu"
import { Button } from "@/components/ui/button"
import { MenuDots } from "@solar-icons/react/ssr"
import { JsonValue } from "@prisma/client/runtime/library"
import { timeAgo } from "@/lib/utils"
import { themes } from "@/lib/constants"
import Image from "next/image"

type Props = {
  projectId: string
  title: string
  updatedAt: string
  isDelete?: boolean
  slideData: JsonValue
  themeName: string
}

export default function ProjectCard({
  updatedAt,
  projectId,
  slideData,
  themeName,
  title,
}: Props) {
  const currentTheme =
    themes.find(({ name }) => name === themeName) ?? themes[0]
  return (
    <div className="group relative flex aspect-video max-h-60 flex-col rounded-lg border transition-colors hover:bg-sidebar">
      <Link
        href={`/presentation/${projectId}`}
        className="relative flex-1 p-0.5"
      >
        {currentTheme.image ? (
          <div
            style={{
              color: currentTheme.fontColor,
            }}
            className="relative flex aspect-video size-full items-center justify-center overflow-hidden rounded-t-md border p-6 text-center"
          >
            <img
              className="absolute size-full"
              src={"/themes/" + currentTheme.image}
              width={400}
              height={200}
              alt={title + "image"}
            />
            <h3 className="absolute z-10 max-w-[80%] text-xl font-medium tracking-tighter capitalize">
              {title}
            </h3>
          </div>
        ) : (
          <div
            style={{
              backgroundImage: currentTheme.gradientBackground,
              color: currentTheme.fontColor,
            }}
            className="flex aspect-video size-full items-center justify-center rounded-t-md border p-6 text-center"
          >
            <h3 className="text-xl font-medium tracking-tighter">{title}</h3>
          </div>
        )}

        <span className="absolute right-0 bottom-0 m-1.5 rounded border bg-background px-1.5 py-0.5 text-xs">
          {Array.isArray(slideData) ? slideData.length : 0} Slides
        </span>
      </Link>

      <PresentationMenu presentationId={projectId} presentationTitle={title}>
        <Button
          size="icon-xs"
          variant="secondary"
          className="absolute top-0 right-0 m-1 rounded-sm opacity-0 group-hover:opacity-100"
        >
          <MenuDots weight="Bold" className="size-4" />
        </Button>
      </PresentationMenu>

      <div className="space-y-0.5 p-1.5">
        <h3 className="text-sm tracking-tighter">{title}</h3>
        <div className="flex flex-col text-xs tracking-tight text-muted-foreground">
          <span>Edited {timeAgo(updatedAt)}</span>
        </div>
      </div>
    </div>
  )
}
