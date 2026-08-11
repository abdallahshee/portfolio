import HomeContent from '@/components/home-content'
import { ProjectList } from '@/components/project-list'
import { getAllProjects } from '@/server/project.functions'

export default async function Page() {
  const { projects } = await getAllProjects()

  return (
    <HomeContent>
      <ProjectList projects={projects} />
    </HomeContent>
  )
}
