import { sql, initializeDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await initializeDatabase()

    const submissions = await sql`
      SELECT 
        id,
        action,
        guideline,
        result,
        confidence,
        timestamp
      FROM submissions
      ORDER BY timestamp DESC
    `

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("[v0] Error fetching submissions:", error)
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await initializeDatabase()

    const body = await request.json()
    const { action, guideline, result, confidence } = body

    const [submission] = await sql`
      INSERT INTO submissions (action, guideline, result, confidence, timestamp)
      VALUES (${action}, ${guideline}, ${result}, ${confidence}, NOW())
      RETURNING id, action, guideline, result, confidence, timestamp
    `

    return NextResponse.json(submission)
  } catch (error) {
    console.error("[v0] Error creating submission:", error)
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 })
  }
}
