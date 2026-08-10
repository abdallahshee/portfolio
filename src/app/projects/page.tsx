import { ProjectsOverviewPanel } from '@/components/ProjectsOverview'
import { getProjectStats } from '@/server/project.functions'

export default async function Page() {
  const stats = await getProjectStats()
  return <ProjectsOverviewPanel stats={stats} />
}
