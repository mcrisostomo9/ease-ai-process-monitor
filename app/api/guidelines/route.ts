import { sql, initializeDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await initializeDatabase()

    const guidelines = await sql`
      SELECT 
        id,
        name,
        text,
        created_at as "createdAt"
      FROM saved_guidelines
      ORDER BY created_at DESC
    `

    return NextResponse.json(guidelines)
  } catch (error) {
    console.error("[v0] Error fetching guidelines:", error)
    return NextResponse.json({ error: "Failed to fetch guidelines" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await initializeDatabase()

    const body = await request.json()
    const { name, text } = body

    const [guideline] = await sql`
      INSERT INTO saved_guidelines (name, text)
      VALUES (${name}, ${text})
      RETURNING id, name, text, created_at as "createdAt"
    `

    return NextResponse.json(guideline)
  } catch (error) {
    console.error("[v0] Error creating guideline:", error)
    return NextResponse.json({ error: "Failed to create guideline" }, { status: 500 })
  }
}
