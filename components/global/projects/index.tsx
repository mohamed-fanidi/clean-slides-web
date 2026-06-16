import { Project } from "@prisma/client"
import ProjectCard from "./project-card"

const Projects = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project, idx) => (
          <ProjectCard
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
