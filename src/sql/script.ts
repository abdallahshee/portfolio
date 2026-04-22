// src/sql/script.ts
import 'dotenv/config'
import { readFileSync } from "fs"
import { join } from "path"
import { db } from "../db/index"
import { sql } from "drizzle-orm"

const SQL_DIR = join(import.meta.dirname, ".")

const files = [
  // ── Drop scripts first ──
  "drop.all.sql",

  // ── Policies ──
  "project.policies.sql",
  "case.policies.sql",
  "bucket.images.sql",

  // ── Triggers ──
  "triggers.sql",
]

function splitStatements(content: string): string[] {
  const statements: string[] = []
  let current = ''
  let inDollarQuote = false
  let dollarTag = ''
  let i = 0

  while (i < content.length) {
    // detect dollar quote tag e.g. $$ or $tag$
    if (!inDollarQuote && content[i] === '$') {
      const end = content.indexOf('$', i + 1)
      if (end !== -1) {
        const tag = content.slice(i, end + 1)
        inDollarQuote = true
        dollarTag = tag
        current += tag
        i = end + 1
        continue
      }
    }

    // detect closing dollar quote
    if (inDollarQuote && content.slice(i, i + dollarTag.length) === dollarTag) {
      current += dollarTag
      i += dollarTag.length
      inDollarQuote = false
      dollarTag = ''
      continue
    }

    // split on semicolon only outside dollar quotes
    if (!inDollarQuote && content[i] === ';') {
      const trimmed = current.trim()
      if (trimmed.length > 0 && !trimmed.startsWith('--')) {
        statements.push(trimmed)
      }
      current = ''
      i++
      continue
    }

    current += content[i]
    i++
  }

  // catch any remaining statement without trailing semicolon
  const trimmed = current.trim()
  if (trimmed.length > 0 && !trimmed.startsWith('--')) {
    statements.push(trimmed)
  }

  return statements
}

async function runScripts() {
  try {
    for (const file of files) {
      const filePath = join(SQL_DIR, file)
      const sqlContent = readFileSync(filePath, "utf-8")

      const statements = splitStatements(sqlContent)

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