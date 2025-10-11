import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/classes - Get all prepared classes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const gradeLevel = searchParams.get('gradeLevel')
    const teacherId = searchParams.get('teacherId')

    const classes = await prisma.preparedClass.findMany({
      where: {
        ...(gradeLevel && { gradeLevel }),
        ...(teacherId && { teacherId })
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        lessons: true,
        videos: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

// POST /api/classes - Create a new prepared class
export async function POST(req: NextRequest) {
  try {
    const { title, syllabus, gradeLevel, teacherId } = await req.json()

    if (!title || !syllabus || !gradeLevel || !teacherId) {
      return NextResponse.json(
        { error: 'Title, syllabus, gradeLevel, and teacherId are required' },
        { status: 400 }
      )
    }

    const preparedClass = await prisma.preparedClass.create({
      data: {
        title,
        syllabus,
        gradeLevel,
        teacherId
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

    return NextResponse.json(preparedClass)
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
}

// PUT /api/classes/[id] - Update a prepared class
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('id')
    const { title, syllabus, gradeLevel } = await req.json()

    if (!classId) {
      return NextResponse.json(
        { error: 'Class ID is required' },
        { status: 400 }
      )
    }

    const preparedClass = await prisma.preparedClass.update({
      where: { id: classId },
      data: {
        ...(title && { title }),
        ...(syllabus && { syllabus }),
        ...(gradeLevel && { gradeLevel })
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

    return NextResponse.json(preparedClass)
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    )
  }
}

// DELETE /api/classes/[id] - Delete a prepared class
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('id')

    if (!classId) {
      return NextResponse.json(
        { error: 'Class ID is required' },
        { status: 400 }
      )
    }

    await prisma.preparedClass.delete({
      where: { id: classId }
    })

    return NextResponse.json({ message: 'Class deleted successfully' })
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    )
  }
}
