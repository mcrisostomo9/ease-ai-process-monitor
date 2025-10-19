import { sql, initializeDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initializeDatabase()

    const { id } = await params

    await sql`
      DELETE FROM saved_guidelines
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting guideline:", error)
    return NextResponse.json({ error: "Failed to delete guideline" }, { status: 500 })
  }
}
