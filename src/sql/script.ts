// src/sql/script.ts
import { readFileSync } from "fs"
import { join } from "path"
import { db } from "../db/index"
import { sql } from "drizzle-orm"

const SQL_DIR = join(import.meta.dirname, ".")

const files = [
//   "drop.policies.sql",
  "project.policies.sql",
  "case.policies.sql",
  "bucket.images.sql",
]

async function runScripts() {
  try {
    for (const file of files) {
      const filePath = join(SQL_DIR, file)
      const sqlContent = readFileSync(filePath, "utf-8")

      console.log(`▶ Running ${file}...`)
      await db.execute(sql.raw(sqlContent))
      console.log(`✅ ${file} executed successfully`)
    }

    console.log("\n🎉 All scripts executed successfully")
  } catch (err) {
    console.error("\n❌ Error executing scripts:", err)
    process.exit(1)
  }
}

runScripts()