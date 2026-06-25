"use client"

import { Project } from "@prisma/client"
import { useMemo } from "react"
import ProjectCard from "./project-card"
import { useSearchStore } from "@/store/use-search-store"

const Projects = ({
  projects,
  deleted = false,
}: {
  projects: Project[]
  deleted?: boolean
}) => {
  const query = useSearchStore((state) => state.query)

  const filteredProjects = useMemo(() => {
    if (!query.trim()) return projects
    const lower = query.toLowerCase()
    return projects.filter((project) =>
      project.title.toLowerCase().includes(lower)
    )
  }, [projects, query])

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProjects.map((project, idx) => (
          <ProjectCard
            deleted={deleted}
            key={idx}
            projectId={project?.id}
            title={project?.title}
            updatedAt={project?.updatedAt.toString()}
            isDelete={project?.isDeleted}
            slideData={project?.slides}
            themeName={project?.themeName}
          />
        ))}
      </div>
    </div>
  )
}

export default Projects
