import { NextRequest, NextResponse } from 'next/server'
import { generateText } from "ai"
import { openai } from '@ai-sdk/openai'

export async function POST(req: NextRequest) {
  try {
    const { title, syllabus, gradeLevel } = await req.json()

    const { text: lessonText } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: [
        `Create a short, clear lesson for ${gradeLevel}.`,
        `Topic Title: ${title}`,
        `Syllabus/Topics:\n${syllabus}`,
        `Output sections:`,
        `1) Learning goals (3 bullet points)`,
        `2) Simple explanation (150-250 words)`,
        `3) Worked example (step-by-step)`,
        `4) 3 quick practice questions with answers`,
        `Keep language simple and suitable for ${gradeLevel}.`,
      ].join("\n"),
      maxOutputTokens: 1000,
    })

    return NextResponse.json({ lessonText })
  } catch (error) {
    console.error('Lesson generation error:', error)
    return NextResponse.json(
      { error: 'Lesson generation failed' },
      { status: 500 }
    )
  }
}
