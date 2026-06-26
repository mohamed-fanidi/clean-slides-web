"use client"
import { useState } from "react"
import Link from "next/link"
import { PresentationMenu } from "./presentation-menu"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MenuDots } from "@solar-icons/react/ssr"
import { JsonValue } from "@prisma/client/runtime/library"
import { timeAgo } from "@/lib/utils"
import { themes } from "@/lib/constants"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { recoverProject } from "@/actions/project"

type Props = {
  deleted?: boolean
  projectId: string
  title: string
  updatedAt: string
  isDelete?: boolean
  slideData: JsonValue
  themeName: string
}

export default function ProjectCard({
  deleted,
  updatedAt,
  projectId,
  slideData,
  themeName,
  title,
}: Props) {
  const [recoverOpen, setRecoverOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const currentTheme =
    themes.find(({ name }) => name === themeName) ?? themes[0]

  const handleRecover = async () => {
    setLoading(true)
    try {
      const res = await recoverProject(projectId)
      if (res.status !== 200) {
        toast.error("Oops!", {
          description: res.error || "Failed to recover the project",
        })
        return
      }
      setRecoverOpen(false)
      router.refresh()
      toast.success("Success", {
        description: "Project recovered successfully",
      })
    } catch (error) {
      console.log(error)
      toast.error("Oops!", {
        description: "Something went wrong. Please contact support.",
      })
    } finally {
      setLoading(false)
    }
  }

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

      <div className="space-y-0.5 p-1.5">
        <h3 className="truncate text-sm tracking-tighter">{title}</h3>
        <div className="flex items-center justify-between gap-1 text-xs tracking-tight text-muted-foreground">
          <span>Edited {timeAgo(updatedAt)}</span>
          {deleted ? (
            <Button
              size="xs"
              className="w-min"
              onClick={() => setRecoverOpen(true)}
            >
              Recover
            </Button>
          ) : (
            <PresentationMenu
              presentationId={projectId}
              presentationTitle={title}
            >
              <Button
                size="icon-xs"
                variant="secondary"
                className="absolute top-0 right-0 m-1 rounded-sm opacity-0 group-hover:opacity-100"
              >
                <MenuDots weight="Bold" className="size-4" />
              </Button>
            </PresentationMenu>
          )}
        </div>
      </div>

      {/* Recover Confirmation Dialog */}
      <AlertDialog open={recoverOpen} onOpenChange={setRecoverOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recover "{title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the presentation and move it back to your active
              projects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRecover} disabled={loading}>
              Recover
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
