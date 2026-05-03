"use client"

import { JsonValue } from "@prisma/client/runtime/library"
import { useSlideStore } from "@/store/use-slide-store"
import { useRouter } from "next/navigation"
import ThumbnailPreview from "./thumbnail-preview"
import { themes } from "@/lib/constants"
import { timeAgo } from "@/lib/utils"
import AlertDialogBox from "./alert-dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { deleteProject, recoverProject } from "@/actions/project"

type Props = {
  projectId: string
  title: string
  createdAt: string
  isDelete?: boolean
  slideData: JsonValue
  themeName: string
}

const ProjectCard = ({
  createdAt,
  projectId,
  slideData,
  themeName,
  title,
  isDelete,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { setSlides } = useSlideStore()
  const router = useRouter()

  const handleNavigation = () => {
    setSlides(JSON.parse(JSON.stringify(slideData)))
    router.push(`/presentation/${projectId}`)
  }

  const handleRecover = async () => {
    setLoading(true)
    if (!projectId) {
      setLoading(false)
      toast.error("Error", {
        description: "Project not found.",
      })
      return
    }
    try {
      const res = await recoverProject(projectId)
      if (res.status !== 200) {
        toast.error("Oops!", {
          description: res.error || "Something went wrong",
        })
        return
      }
      setOpen(false)
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

  const handleDelete = async () => {
    setLoading(true)
    if (!projectId) {
      setLoading(false)
      toast.error("Error", {
        description: "Project not found.",
      })
      return
    }
    try {
      const res = await deleteProject(projectId)
      if (res.status !== 200) {
        toast.error("Oops!", {
          description: res.error || "Failed to delete the project",
        })
        return
      }
      setOpen(false)
      router.refresh()
      toast.success("Success", {
        description: "Project deleted successfully",
      })
    } catch (error) {
      console.log(error)
      toast.error("Oops!", {
        description: "Something went wrong.",
      })
    } finally {
      setLoading(false)
    }
  }

  const theme = themes.find((theme) => theme.name === themeName) || themes[0]

  return (
    <div
      className={`group flex w-full transform flex-col gap-y-3 rounded-xl p-3 transition-all duration-300 ${
        !isDelete && "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
      } border border-muted bg-background`}
    >
      <div
        className="relative aspect-16/10 cursor-pointer overflow-hidden rounded-lg shadow-inner transition-all"
        onClick={handleNavigation}
      >
        <ThumbnailPreview
          theme={theme}
          slide={JSON.parse(JSON.stringify(slideData))?.[0]}
        />
      </div>

      <div className="w-full">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-base font-semibold text-primary">
            {title}
          </h3>
          <div className="flex w-full items-center justify-between gap-2">
            <p
              className="text-sm text-muted-foreground"
              suppressHydrationWarning
            >
              {timeAgo(createdAt)}
            </p>
            {isDelete ? (
              <AlertDialogBox
                description="This will recover your project and restore your data."
                className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                loading={loading}
                open={open}
                onClick={handleRecover}
                handleOpen={() => setOpen(!open)}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover:bg-muted"
                  disabled={loading}
                >
                  Recover
                </Button>
              </AlertDialogBox>
            ) : (
              <AlertDialogBox
                description="This will delete your project permanently."
                className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                loading={loading}
                open={open}
                onClick={handleDelete}
                handleOpen={() => setOpen(!open)}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover:bg-muted"
                  disabled={loading}
                >
                  Delete
                </Button>
              </AlertDialogBox>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
