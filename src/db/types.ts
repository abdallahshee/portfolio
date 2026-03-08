import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import type { project } from "./project-schema"
import type { user } from "./auth-schema"

export type User=InferSelectModel<typeof user>

export type Project = InferSelectModel<typeof project>
export type NewProject = InferInsertModel<typeof project>