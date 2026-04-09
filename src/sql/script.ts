import 'dotenv/config'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { sql } from 'drizzle-orm'
import { db } from '@/db/index'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const scriptFiles = [
  'user.policies.sql',
  'article.policies.sql',
  'article-like.policies.sql',
  'comment.policies.sql',
  'project.policies.sql',
  'project-rating.policies.sql',
  'admin.policy.sql',
  'bucket-avatars.policies.sql',
  'triggers.sql',
  'views.sql',
]

function splitSqlStatements(content: string) {
  return content
    .replace(/--.*$/gm, '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
}

async function applyPolicies() {
  console.log('🚀 Applying policies...\n')

  for (const file of scriptFiles) {
    try {
      console.log(`Applying ${file}...`)
      const content = readFileSync(join(__dirname, file), 'utf-8')

      if (content.includes('DO $$')) {
        await db.execute(sql.raw(content))
      } else {
        const statements = splitSqlStatements(content)
        for (const statement of statements) {
          await db.execute(sql.raw(statement))
        }
      }

      console.log(`✅ ${file} applied\n`)
    } catch (err: any) {
      console.error(`❌ Failed to apply ${file}`)
      console.error('message:', err?.message)
      console.error('code:', err?.code)
      console.error('detail:', err?.detail)
      console.error('hint:', err?.hint)
      console.error('cause:', err?.cause)
      console.error('full error:', err)
      process.exit(1)
    }
  }

  console.log('🎉 All policies applied successfully')
  process.exit(0)
}

applyPolicies().catch((err) => {
  console.error('Failed to apply policies:', err)
  process.exit(1)
})