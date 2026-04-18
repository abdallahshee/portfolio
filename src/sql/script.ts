// src/sql/script.ts
// src/sql/script.ts
import 'dotenv/config'  // ← add this as the very first line

import { readFileSync } from "fs"
import { join } from "path"
import { db } from "../db/index"
import { sql } from "drizzle-orm"
const SQL_DIR = join(import.meta.dirname, ".")

const files = [
  "drop.policies.sql",
  "project.policies.sql",
  "case.policies.sql",
  "bucket.images.sql",
]

export async function runScripts() {
  try {
    for (const file of files) {
      const filePath = join(SQL_DIR, file)
      const sqlContent = readFileSync(filePath, "utf-8")

      // Split into individual statements and filter empty ones
      const statements = sqlContent
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--"))

      console.log(`▶ Running ${file} (${statements.length} statements)...`)

      for (const statement of statements) {
        await db.execute(sql.raw(statement))
      }

      console.log(`✅ ${file} executed successfully`)
    }

    console.log("\n🎉 All scripts executed successfully")
  } catch (err) {
    console.error("\n❌ Error executing scripts:", err)
    process.exit(1)
  }
}

runScripts()