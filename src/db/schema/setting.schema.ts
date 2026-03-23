import { pgTable, boolean, text} from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const setting = pgTable("site_setting", {
  id: text("id").primaryKey().$default(() => nanoid(24)),

  settings: boolean("settings")
    .notNull()
    .default(false),

})