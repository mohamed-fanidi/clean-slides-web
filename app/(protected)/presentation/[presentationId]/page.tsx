"use client"

import { getProjectById } from "@/actions/project"
import { themes } from "@/lib/constants"
import { useSlideStore } from "@/store/use-slide-store"
import { Loader } from "lucide-react"
import { useTheme } from "next-themes"
import { redirect, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import dynamic from "next/dynamic"

const Navbar = dynamic(
  () => import("@/components/global/presentation/navbar"),
  { ssr: false }
)

import LayoutPreview from "@/components/global/presentation/left-sidebar/layout-preview"
import Editor from "@/components/global/presentation/editor/editor"
import { Skeleton } from "@/components/ui/skeleton"

const Page = () => {
  const { setSlides, setProject, setCurrentTheme } = useSlideStore()
  const { setTheme } = useTheme()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getProjectById(params.presentationId as string)

        if (res.status !== 200 || !res.data) {
          toast.error("Error", { description: "Unable to fetch project" })
          redirect("/dashboard")
        }

        const foundTheme = themes.find(
          (theme) => theme.name === res.data.themeName
        )
        const finalTheme = foundTheme || themes[0]

        setCurrentTheme(finalTheme)
        setTheme(finalTheme.type === "dark" ? "dark" : "light")
        setProject(res.data)
        setSlides(JSON.parse(JSON.stringify(res.data.slides)))
      } catch (error) {
        toast.error("Error", {
          description: "An unexpected error occurred",
        })
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  if (isLoading) {
    return (
      <div className="relative flex h-screen w-full bg-background p-2">
        <Skeleton className="h-full w-52 rounded-xl" />
        <div className="absolute inset-0 top-2 flex h-11 w-full items-center justify-between px-2">
          <div></div>
          <div></div>
          <Skeleton className="h-11 w-40" />
          <Skeleton className="h-11 w-80" />
        </div>

        <Skeleton className="mx-auto mt-24 aspect-video h-[80%] rounded" />
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen flex-col bg-muted">
        <Navbar presentationId={params.presentationId as string} />

        <div className="flex flex-1 overflow-hidden pt-20">
          <LayoutPreview presentationId={params.presentationId as string} />

          <div className="flex-1 py-2 sm:mr-20 sm:ml-80">
            <Editor isEditable={true} />
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

export default Page
