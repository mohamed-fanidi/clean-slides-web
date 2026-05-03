import { getAllProjects } from "@/actions/project"
import NoProjects from "@/components/global/dashboard/no-projects"
import Projects from "@/components/global/projects"

export default async function dashBoard() {
  const allProjects = await getAllProjects()
  return (
    <div className="relative flex w-full flex-col gap-6 px-6 py-4">
      <div className="flex w-full flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start">
          <h1 className="pt-2 pb-2 text-3xl font-semibold">Projects</h1>
          <p className="text-base font-normal dark:text-muted-foreground">
            Your creations, organized in one spot
          </p>
        </div>
      </div>
      {allProjects.data && allProjects.data.length > 0 ? (
        <Projects projects={allProjects.data} />
      ) : (
        <NoProjects />
      )}
    </div>
  )
}
