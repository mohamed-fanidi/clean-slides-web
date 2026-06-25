"use client"

import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Play,
  Copy,
  Download,
  TrashBin2,
  Share,
  TextFieldFocus,
} from "@solar-icons/react/ssr"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useSlideStore } from "@/store/use-slide-store"
import {
  deleteProject,
  duplicateProject,
  renameProject,
} from "@/actions/project"
import { exportSlidesToPptx } from "@/lib/export-pptx"

interface PresentationMenuProps {
  presentationId: string
  presentationTitle: string
  children: React.ReactNode
}

export function PresentationMenu({
  presentationId,
  presentationTitle,
  children,
}: PresentationMenuProps) {
  const [loading, setLoading] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameValue, setRenameValue] = useState(presentationTitle)
  const { setSlides, slides, getProjectTitle, currentTheme } = useSlideStore()
  const router = useRouter()

  const closeAndRun = (fn: () => void) => {
    setPopoverOpen(false)
    fn()
  }

  const handlePreview = () => {
    window.open(
      `/presentation/${presentationId}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  const handleDuplicate = async () => {
    setLoading(true)
    try {
      const res = await duplicateProject(presentationId)
      if (res.status !== 200) {
        toast.error("Oops!", {
          description: res.error || "Failed to duplicate the project",
        })
        return
      }
      router.refresh()
      toast.success("Success", {
        description: "Project duplicated successfully",
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

  const handleRename = async () => {
    const trimmed = renameValue.trim()
    if (!trimmed) {
      toast.error("Oops!", { description: "Title cannot be empty" })
      return
    }
    setLoading(true)
    try {
      const res = await renameProject(presentationId, trimmed)
      if (res.status !== 200) {
        toast.error("Oops!", {
          description: res.error || "Failed to rename the project",
        })
        return
      }
      setRenameOpen(false)
      router.refresh()
      toast.success("Success", {
        description: "Project renamed successfully",
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

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/share/${presentationId}`
    )
    toast.success("Link Copied")
  }

  const handleExport = async () => {
    await exportSlidesToPptx(
      slides,
      currentTheme,
      getProjectTitle(presentationId) || "Presentation"
    )
  }

  const handleDelete = async () => {
    setLoading(true)
    if (!presentationId) {
      setLoading(false)
      toast.error("Error", {
        description: "Project not found.",
      })
      return
    }
    try {
      const res = await deleteProject(presentationId)
      if (res.status !== 200) {
        toast.error("Oops!", {
          description: res.error || "Failed to delete the project",
        })
        return
      }
      setDeleteOpen(false)
      router.refresh()
      toast.success("Success", {
        description: "Project deleted successfully",
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
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent align="start" className="w-52 p-1">
          <div className="flex flex-col gap-0.5">
            {/* Preview */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-muted-foreground"
              onClick={() => closeAndRun(handlePreview)}
            >
              <Play weight="Bold" className="size-4" />
              <span>Preview</span>
            </Button>

            {/* Duplicate */}
            <Button
              variant="ghost"
              size="sm"
              disabled={loading}
              className="justify-start gap-3 text-muted-foreground"
              onClick={() => closeAndRun(handleDuplicate)}
            >
              <Copy weight="Bold" className="size-4" />
              <span>Duplicate</span>
            </Button>

            {/* Rename */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-muted-foreground"
              onClick={() => {
                setRenameValue(presentationTitle)
                setPopoverOpen(false)
                setRenameOpen(true)
              }}
            >
              <TextFieldFocus weight="Bold" className="size-4" />
              <span>Rename</span>
            </Button>

            <hr className="my-0.5" />

            {/* Share */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-muted-foreground"
              onClick={() => closeAndRun(handleCopy)}
            >
              <Share weight="Bold" className="size-4" />
              <span>Share</span>
            </Button>

            {/* Export */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-muted-foreground"
              onClick={() => closeAndRun(handleExport)}
            >
              <Download weight="Bold" className="size-4" />
              <span>Export</span>
            </Button>

            <hr className="my-0.5" />

            {/* Delete */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-destructive hover:text-destructive"
              onClick={() => {
                setPopoverOpen(false)
                setDeleteOpen(true)
              }}
            >
              <TrashBin2 weight="Bold" className="size-4" />
              <span>Delete</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename presentation</DialogTitle>
            <DialogDescription>
              Choose a new name for "{presentationTitle}".
            </DialogDescription>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Presentation title"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename()
            }}
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={loading}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{presentationTitle}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The presentation will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
