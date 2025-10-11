import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/videos - Get all videos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const gradeLevel = searchParams.get('gradeLevel')
    const status = searchParams.get('status')
    const topic = searchParams.get('topic')

    const videos = await prisma.video.findMany({
      where: {
        ...(gradeLevel && { gradeLevel }),
        ...(status && { status: status as any }),
        ...(topic && { topic: { contains: topic, mode: 'insensitive' } })
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        preparedClass: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

// POST /api/videos - Create a new video request
export async function POST(req: NextRequest) {
  try {
    const { 
      title, 
      description, 
      topic, 
      gradeLevel, 
      teacherId, 
      classId 
    } = await req.json()

    if (!title || !topic || !gradeLevel) {
      return NextResponse.json(
        { error: 'Title, topic, and gradeLevel are required' },
        { status: 400 }
      )
    }

    const video = await prisma.video.create({
      data: {
        title,
        description: description || `Educational video about ${topic} for ${gradeLevel}`,
        topic,
        gradeLevel,
        status: 'PENDING',
        teacherId,
        classId
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    )
  }
}

// PUT /api/videos/[id] - Update video status or details
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const videoId = searchParams.get('id')
    const { status, videoUrl, thumbnailUrl } = await req.json()

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        ...(status && { status: status as any }),
        ...(videoUrl && { videoUrl }),
        ...(thumbnailUrl && { thumbnailUrl })
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    )
  }
}
