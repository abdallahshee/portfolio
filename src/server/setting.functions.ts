import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { db } from "../db/index"
import { AdminMiddleware } from "./middleware"
import { setting } from "@/db/schema"

export const toggleHireModeStatus = createServerFn({ method: "POST" })
  .middleware([AdminMiddleware])
  .inputValidator((data: { settingId: string }) => data)
  .handler(async ({ data }) => {
    const current = await db.query.setting.findFirst({
      where: eq(setting.id, data.settingId),
    })

    if (!current) throw new Error(`Setting with id "${data.settingId}" not found`)

    const next = !current.settings

    await db
      .update(setting)
      .set({ settings: next })
      .where(eq(setting.id, data.settingId))

    return { isOpenForHire: next, settingId: data.settingId }
  })

export const getHireStatus = createServerFn({ method: "GET" })
.middleware([AdminMiddleware])
  .inputValidator((data: { settingId: string }) => data)
  .handler(async ({ data }) => {
    const current = await db.query.setting.findFirst({
      where: eq(setting.id, data.settingId),
    })
    return { isOpenForHire: current?.settings ?? false }
  })