import { data } from '../../data/data'

export type Project = {
  id: string
  title: string | null
  slug: string | null
  description: string | null
  imageUrl: string | null
  githubUrl: string | null
  liveUrl: string | null
  technologies: string[]
  isContributor: boolean | null
  createdAt: Date
  updatedAt: Date
}

function toProject(raw: (typeof data)[number]): Project {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    imageUrl: raw.image_url,
    githubUrl: raw.github_url,
    liveUrl: raw.live_url,
    technologies: raw.technologies ?? [],
    isContributor: raw.is_contributor,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  }
}

function allProjectsSortedByCreatedAt(): Project[] {
  return data
    .map(toProject)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getAllProjects() {
  const projects = allProjectsSortedByCreatedAt()
  return { projects, total: projects.length }
}
