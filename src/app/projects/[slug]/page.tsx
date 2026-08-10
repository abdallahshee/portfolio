import { notFound } from "next/navigation"
import { ProjectDetails } from "@/components/ProjectDetails"
import { getProjectBySlugName } from "@/server/project.functions"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlugName(slug)

  if (!project) notFound()

  return <ProjectDetails project={project} />
}
