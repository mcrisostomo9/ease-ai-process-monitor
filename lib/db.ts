import { neon } from "@neondatabase/serverless"

if (!process.env.NEON_NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL is not defined")
}

export const sql = neon(process.env.NEON_DATABASE_URL)

let isInitialized = false

export async function initializeDatabase() {
  if (isInitialized) return

  try {
    // Create submissions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        action TEXT NOT NULL,
        guideline TEXT NOT NULL,
        result VARCHAR(20) NOT NULL,
        confidence DECIMAL(3, 2) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create saved_guidelines table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS saved_guidelines (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    isInitialized = true
    console.log("[v0] Database tables initialized successfully")
  } catch (error) {
    console.error("[v0] Error initializing database:", error)
    throw error
  }
}
