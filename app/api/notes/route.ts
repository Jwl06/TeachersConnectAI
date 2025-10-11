import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/notes - Get all notes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const language = searchParams.get('language')
    const teacherId = searchParams.get('teacherId')

    const notes = await prisma.note.findMany({
      where: {
        ...(language && { language }),
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
        translations: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

// POST /api/notes - Create a new note
export async function POST(req: NextRequest) {
  try {
    const { title, content, language, teacherId } = await req.json()

    if (!title || !content || !teacherId) {
      return NextResponse.json(
        { error: 'Title, content, and teacherId are required' },
        { status: 400 }
      )
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        language: language || 'English',
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

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}

// PUT /api/notes/[id] - Update a note
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const noteId = searchParams.get('id')
    const { title, content, language } = await req.json()

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      )
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(language && { language })
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

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    )
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const noteId = searchParams.get('id')

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      )
    }

    await prisma.note.delete({
      where: { id: noteId }
    })

    return NextResponse.json({ message: 'Note deleted successfully' })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    )
  }
}
