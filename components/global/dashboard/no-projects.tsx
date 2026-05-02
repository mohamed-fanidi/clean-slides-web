import { FileSmile } from "@solar-icons/react/ssr"

export default function NoProjects() {
  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-16 select-none">
      <div className="relative mb-6">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-muted/50">
          <FileSmile
            className="text-muted-foreground"
            weight="BoldDuotone"
            size={32}
          />
        </div>
      </div>

      <h2 className="mb-2 text-lg font-medium tracking-tight text-foreground">
        No projects yet
      </h2>
      <p className="max-w-xs text-center text-muted-foreground">
        Create your first project to get started. Your work will appear here.
      </p>
    </div>
  )
}
