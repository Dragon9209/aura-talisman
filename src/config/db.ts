import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import { env } from "@/env.mjs"
import * as schema from "@/db/schema"

const sql = neon(env.DATABASE_URL)

export const db = drizzle(sql, { schema })

export const isDbConfigured = Boolean(
  env.DATABASE_URL &&
    !env.DATABASE_URL.includes("dummy") &&
    !env.DATABASE_URL.includes("localhost:5432")
)

export const isDummyDb = !isDbConfigured
