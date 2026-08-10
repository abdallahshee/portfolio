import HomeContent from '@/components/HomeContent'
import { ProjectList } from '@/components/ProjectList'
import { getAllProjects } from '@/server/project.functions'

export default async function Page() {
  const { projects } = await getAllProjects()

  return (
    <HomeContent>
      <ProjectList projects={projects} />
    </HomeContent>
  )
}
