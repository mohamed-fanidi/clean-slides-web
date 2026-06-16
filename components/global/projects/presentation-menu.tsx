"use client"

import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  Play,
  Copy,
  Download,
  TrashBin2,
  Share,
  TextFieldFocus,
  Folder,
  AltArrowRight,
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)

  const handleDelete = () => {
    setIsDeleteDialogOpen(false)
    console.log("[v0] Deleting presentation:", presentationId)
  }

  const handleExport = (format: "pdf" | "png" | "ppt" | "pptx") => {
    setIsExportOpen(false)
    console.log("[v0] Exporting as", format, ":", presentationId)
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent align="start" className="w-52 p-1">
          <div className="flex flex-col gap-0.5">
            {/* Preview */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-muted-foreground"
              onClick={() => console.log("[v0] Preview:", presentationId)}
            >
              <Play weight="Bold" className="size-4" />
              <span>Preview</span>
            </Button>

            {/* Duplicate */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-muted-foreground"
              onClick={() => console.log("[v0] Duplicate:", presentationId)}
            >
              <Copy weight="Bold" className="size-4" />
              <span>Duplicate</span>
            </Button>
            {/* Rename */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-muted-foreground"
              onClick={() => console.log("[v0] Rename:", presentationId)}
            >
              <TextFieldFocus weight="Bold" className="size-4" />
              <span>Rename</span>
            </Button>
            <hr className="my-0.5" />
            {/* Move to Folder */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-muted-foreground"
              onClick={() =>
                console.log("[v0] Move to folder:", presentationId)
              }
            >
              <Folder weight="Bold" className="size-4" />
              <span>Move to folder</span>
              <AltArrowRight weight="Linear" className="ml-auto size-4" />
            </Button>

            <hr className="my-0.5" />
            {/* Share */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-muted-foreground"
              onClick={() => console.log("[v0] Share:", presentationId)}
            >
              <Share weight="Bold" className="size-4" />
              <span>Share</span>
            </Button>
            {/* Export */}
            <Popover open={isExportOpen} onOpenChange={setIsExportOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-3 text-muted-foreground"
                >
                  <Download weight="Bold" className="size-4" />
                  <span>Export as</span>
                  <AltArrowRight weight="Linear" className="ml-auto size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right" className="w-32 p-1">
                <div className="flex flex-col gap-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => handleExport("pdf")}
                  >
                    PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => handleExport("png")}
                  >
                    PNG
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => handleExport("ppt")}
                  >
                    PPT
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => handleExport("pptx")}
                  >
                    PPTX
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <hr className="my-0.5" />
            {/* Delete */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-destructive hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <TrashBin2 weight="Bold" className="size-4" />
              <span>Delete</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{presentationTitle}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The presentation will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
