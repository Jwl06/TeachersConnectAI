import { NextRequest, NextResponse } from 'next/server'
import { streamText, convertToModelMessages, consumeStream, type UIMessage } from "ai"
import { openai } from '@ai-sdk/openai'
import { prisma } from '@/lib/prisma'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { 
      messages, 
      userId, 
      isQAMode = false, 
      gradeLevel = 'Grade 6',
      subject = 'General',
      language = 'English'
    }: { 
      messages: UIMessage[], 
      userId?: string,
      isQAMode?: boolean,
      gradeLevel?: string,
      subject?: string,
      language?: string
    } = await req.json()

    // Check if OpenAI API key is available
    const openaiApiKey = process.env.OPENAI_API_KEY
    
    if (!openaiApiKey || openaiApiKey === 'your_openai_api_key_here') {
      // Return a demo response when no API key is provided
      const demoResponse = isQAMode 
        ? `**Demo Q&A Generator Response**

Since you haven't set up your OpenAI API key yet, here's a sample Q&A for ${gradeLevel} ${subject}:

**Sample Questions:**

1. What is the main concept we learned today?
2. Can you explain this in your own words?
3. How would you apply this knowledge?

**Answer Key:**
- [Sample answers would appear here]

**To enable full AI functionality:**
1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Add it to your .env.local file as: OPENAI_API_KEY="sk-your-key-here"
3. Restart the development server

The AI chatbot will then provide real-time educational assistance!`
        : `**Demo AI Assistant Response**

Hello! I'm your educational AI assistant for ${gradeLevel} ${subject}.

Since you haven't set up your OpenAI API key yet, I'm showing you a demo response.

**What I can help with:**
- Explaining complex concepts in simple terms
- Creating practice problems and examples
- Helping with lesson planning
- Generating assessments and quizzes

**To enable full AI functionality:**
1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Add it to your .env.local file as: OPENAI_API_KEY="sk-your-key-here"
3. Restart the development server

Once configured, I'll provide real-time educational assistance tailored to your grade level and subject!`

      // Simulate streaming response
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          const chunks = demoResponse.split(' ')
          let index = 0
          
          const sendChunk = () => {
            if (index < chunks.length) {
              const chunk = chunks[index] + ' '
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
              index++
              setTimeout(sendChunk, 50) // Simulate typing delay
            } else {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
            }
          }
          
          sendChunk()
        }
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // Save user message to database if userId is provided
    if (userId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'user') {
        try {
          await prisma.chatMessage.create({
            data: {
              userId,
              message: lastMessage.parts.map(p => p.type === 'text' ? p.text : '').join(''),
              isAI: false
            }
          })
        } catch (dbError) {
          console.error('Database error saving user message:', dbError)
          // Continue even if database save fails
        }
      }
    }

    const prompt = convertToModelMessages(messages)
    
    // Enhanced system prompt for educational context
    const systemPrompt = isQAMode 
      ? `You are an expert educational AI assistant specialized in creating assessments and Q&A content for teachers and students in rural and urban areas.

CONTEXT:
- Grade Level: ${gradeLevel}
- Subject: ${subject}
- Language: ${language}

EXPERTISE:
- Creating age-appropriate questions and assessments
- Generating multiple choice, short answer, and essay questions
- Designing quizzes, tests, and practice materials
- Adapting content for different learning levels
- Supporting multiple languages and cultural contexts
- Following educational best practices

RESPONSE FORMAT:
- Always provide clear, pedagogically sound content
- Include answer keys when appropriate
- Suggest difficulty levels
- Provide learning objectives
- Use appropriate terminology for ${gradeLevel}

Create comprehensive, educational content that helps both teachers and students succeed.`
      : `You are an expert teacher and educational mentor for the Rural-Urban Teacher Connect platform. Act like a patient, knowledgeable, and caring teacher who is passionate about helping students learn.

CONTEXT:
- Grade Level: ${gradeLevel}
- Subject: ${subject}
- Language: ${language}

TEACHING EXPERTISE:
- Explaining complex concepts in simple, age-appropriate terms
- Providing step-by-step solutions with clear examples
- Creating engaging practice problems and exercises
- Adapting explanations for different learning styles and grade levels
- Supporting multiple languages and cultural contexts
- Helping with lesson planning and teaching strategies
- Encouraging critical thinking and problem-solving

TEACHING APPROACH:
- Use clear, simple language appropriate for ${gradeLevel} students
- Provide practical examples, analogies, and real-world connections
- Break down complex topics into manageable, digestible parts
- Include visual descriptions and mental models when helpful
- Ask follow-up questions to check understanding
- Be encouraging, supportive, and patient with all students
- Celebrate learning and progress
- Offer alternative explanations if a student is struggling
- Connect new concepts to what students already know
- Make learning fun and engaging
- Provide practice suggestions and study tips
- Always maintain a positive, nurturing tone

Remember: You are not just answering questions - you are teaching, inspiring, and empowering students to become confident learners. Be the teacher every student wishes they had!`

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: systemPrompt },
        ...prompt
      ],
      abortSignal: req.signal,
      temperature: isQAMode ? 0.7 : 0.5, // Slightly more creative for Q&A generation
      maxTokens: 2000,
    })

    // Save AI response to database
    const response = result.toUIMessageStreamResponse({
      onFinish: async ({ isAborted, text }) => {
        if (!isAborted && userId) {
          try {
            await prisma.chatMessage.create({
              data: {
                userId,
                message: text,
                isAI: true
              }
            })
          } catch (dbError) {
            console.error('Database error saving AI message:', dbError)
            // Continue even if database save fails
          }
        }
      },
      consumeSseStream: consumeStream,
    })

    return response
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { 
        error: 'Chat failed. Please check your OpenAI API key and try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve chat history
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json({ messages: messages.reverse() })
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    )
  }
}
