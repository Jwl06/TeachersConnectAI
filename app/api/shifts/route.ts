import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/shifts - Get all shifts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const location = searchParams.get('location')

    const shifts = await prisma.shift.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(location && { 
          requester: {
            location: location as any
          }
        })
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        volunteer: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(shifts)
  } catch (error) {
    console.error('Error fetching shifts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shifts' },
      { status: 500 }
    )
  }
}

// POST /api/shifts - Create a new shift request
export async function POST(req: NextRequest) {
  try {
    const { 
      title, 
      description, 
      schoolName, 
      location, 
      startDate, 
      endDate, 
      requesterId 
    } = await req.json()

    if (!title || !description || !schoolName || !location || !startDate || !endDate || !requesterId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const shift = await prisma.shift.create({
      data: {
        title,
        description,
        schoolName,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        requesterId,
        status: 'PENDING'
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    })

    return NextResponse.json(shift)
  } catch (error) {
    console.error('Error creating shift:', error)
    return NextResponse.json(
      { error: 'Failed to create shift' },
      { status: 500 }
    )
  }
}

// PUT /api/shifts/[id] - Update a shift (e.g., volunteer for it)
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const shiftId = searchParams.get('id')
    const { volunteerId, status } = await req.json()

    if (!shiftId) {
      return NextResponse.json(
        { error: 'Shift ID is required' },
        { status: 400 }
      )
    }

    const shift = await prisma.shift.update({
      where: { id: shiftId },
      data: {
        ...(volunteerId && { volunteerId }),
        ...(status && { status: status as any })
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        volunteer: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    })

    return NextResponse.json(shift)
  } catch (error) {
    console.error('Error updating shift:', error)
    return NextResponse.json(
      { error: 'Failed to update shift' },
      { status: 500 }
    )
  }
}
