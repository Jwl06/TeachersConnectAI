import { NextRequest, NextResponse } from 'next/server'
import { generateText } from "ai"
import { openai } from '@ai-sdk/openai'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { topic, gradeLevel, description, userId, classId } = await req.json()

    if (!topic || !gradeLevel) {
      return NextResponse.json(
        { error: 'Topic and grade level are required' },
        { status: 400 }
      )
    }

    // Generate video script using AI
    const { text: videoScript } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Create an educational video script for ${gradeLevel} students about "${topic}".

Requirements:
- Duration: 5-10 minutes
- Age-appropriate language and examples
- Clear learning objectives
- Engaging visual descriptions
- Step-by-step explanations
- Interactive elements or questions for students

Topic: ${topic}
Grade Level: ${gradeLevel}
Additional Context: ${description || 'No additional context provided'}

Format the script with:
1. Introduction (hook the students)
2. Learning objectives
3. Main content with visual cues
4. Examples and demonstrations
5. Practice activities
6. Summary and conclusion

Make it engaging and suitable for ${gradeLevel} students.`,
      maxOutputTokens: 2000,
    })

    // Create video record in database
    const video = await prisma.video.create({
      data: {
        title: `${topic} - ${gradeLevel}`,
        description: description || `Educational video about ${topic} for ${gradeLevel}`,
        topic,
        gradeLevel,
        status: 'PENDING',
        teacherId: userId,
        classId: classId
      }
    })

    // In a real implementation, you would:
    // 1. Send the script to a video generation service (like RunwayML, D-ID, or similar)
    // 2. Update the video status as it processes
    // 3. Store the final video URL when complete

    return NextResponse.json({ 
      videoId: video.id,
      script: videoScript,
      message: 'Video generation started. This is a demo - in production, this would trigger actual video creation.'
    })
  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json(
      { error: 'Video generation failed' },
      { status: 500 }
    )
  }
}
