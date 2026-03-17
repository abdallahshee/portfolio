import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { db } from "../db/index"
import { setting } from "@/db/setting.schema"

export const toggleHireModeStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { settingId: string }) => data)
  .handler(async ({ data }) => {
    const current = await db.query.setting.findFirst({
      where: eq(setting.id, data.settingId),
    })

    if (!current) throw new Error(`Setting with id "${data.settingId}" not found`)

    const next = !current.settings

    await db
      .update(setting)
      .set({ settings: next, updatedAt: new Date() })
      .where(eq(setting.id, data.settingId))

    return { isOpenForHire: next, settingId: data.settingId }
  })

export const getHireStatus = createServerFn({ method: "GET" })
  .inputValidator((data: { settingId: string }) => data)
  .handler(async ({ data }) => {
    const current = await db.query.setting.findFirst({
      where: eq(setting.id, data.settingId),
    })
    return { isOpenForHire: current?.settings ?? false }
  })