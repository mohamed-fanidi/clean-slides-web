import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"
import React from "react"

type Props = {
  children: React.ReactNode
  className?: string
  description: string
  loading?: boolean
  onClick?: () => void
  open: boolean
  handleOpen: () => void
}

const AlertDialogBox = ({
  children,
  className,
  description,
  loading,
  onClick,
  handleOpen,
  open,
}: Props) => {
  return (
    <AlertDialog onOpenChange={handleOpen} open={open}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent
        className={cn(
          "rounded-xl border-none bg-white/80 shadow-xl backdrop-blur-md transition-all duration-300 dark:bg-zinc-900/80"
        )}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold tracking-wide">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="rounded-md bg-muted px-4 transition-all hover:scale-[1.02]">
            Cancel
          </AlertDialogCancel>
          <Button
            variant={"destructive"}
            className={cn(
              "flex items-center gap-2 rounded-md transition-all hover:scale-[1.02] active:scale-[0.98]",
              className
            )}
            onClick={onClick}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDialogBox
