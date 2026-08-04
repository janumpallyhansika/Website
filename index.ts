import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

let dbInstance: ReturnType<typeof drizzle> | null = null

function initializeDb() {
  if (dbInstance) return dbInstance

  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set")
  }

  const sql = neon(url)
  dbInstance = drizzle(sql, { schema })
  return dbInstance
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get: (target, prop) => {
    const instance = initializeDb()
    return (instance as any)[prop]
  },
})

export type Database = typeof db
