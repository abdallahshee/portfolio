import { data } from '../../data/data'

export type Project = {
  id: string
  title: string | null
  slug: string | null
  description: string | null
  imageUrl: string | null
  githubUrl: string | null
  liveUrl: string | null
  isFeatured: boolean | null
  technologies: string[]
  roles: string[]
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
    isFeatured: raw.is_featured,
    technologies: raw.technologies ?? [],
    roles: raw.roles ?? [],
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

export async function getProjectBySlugName(slug: string) {
  const project = allProjectsSortedByCreatedAt().find((p) => p.slug === slug)
  return project ?? null
}

export async function getAllProjects() {
  const projects = allProjectsSortedByCreatedAt()
  return { projects, total: projects.length }
}

export async function getProjectById(projectId: string) {
  const project = allProjectsSortedByCreatedAt().find((p) => p.id === projectId)
  return project ?? null
}

export async function getPaginatedProjects(page: number, pageSize: number) {
  const all = allProjectsSortedByCreatedAt()
  const total = all.length
  const offset = (page - 1) * pageSize

  return {
    projects: all.slice(offset, offset + pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasNextPage: page < Math.ceil(total / pageSize),
    hasPrevPage: page > 1,
  }
}

export async function getTopFeaturedProjects() {
  return allProjectsSortedByCreatedAt()
    .filter((p) => p.isFeatured)
    .slice(0, 3)
}

export async function searchProjects(query: string, page: number, pageSize: number) {
  const all = allProjectsSortedByCreatedAt()
  const search = query.trim().toLowerCase()

  const filtered = search
    ? all.filter(
      (p) =>
        p.title?.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
    )
    : all

  const total = filtered.length
  const offset = (page - 1) * pageSize

  return {
    projects: filtered.slice(offset, offset + pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasNextPage: page < Math.ceil(total / pageSize),
    hasPrevPage: page > 1,
  }
}

export async function getProjectStats() {
  const { projects } = await getAllProjects()
  const technologies = new Set(
    projects.flatMap((p) => p.technologies ?? [])
  )

  return {
    total: projects.length,
    featured: projects.filter((p) => p.isFeatured).length,
    contributorCount: projects.filter((p) => p.isContributor).length,
    technologiesCount: technologies.size,
    topTechnologies: [...technologies].slice(0, 10),
  }
}
