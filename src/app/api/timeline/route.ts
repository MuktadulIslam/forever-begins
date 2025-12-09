import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TimelineEvent from '@/models/TimelineEvent';

// Default timeline events
const defaultEvents = [
  {
    date: 'First Met',
    title: 'Where It All Began',
    description:
      'Our paths crossed for the first time, and little did we know, it was the beginning of forever.',
    icon: 'sparkles' as const,
    order: 0,
    isDefault: true,
  },
  {
    date: 'First Date',
    title: 'A Magical Evening',
    description:
      'Coffee, conversation, and countless smiles. We knew there was something special between us.',
    icon: 'heart' as const,
    order: 1,
    isDefault: true,
  },
  {
    date: 'The Proposal',
    title: 'Forever Starts Now',
    description:
      'Under the stars, with hearts full of love, we decided to spend our lives together.',
    icon: 'heart' as const,
    order: 2,
    isDefault: true,
  },
  {
    date: 'December 14, 2025',
    title: 'Wedding Reception',
    description:
      'Celebrating our love with family and friends. Join us as we begin this beautiful journey together.',
    icon: 'sparkles' as const,
    order: 3,
    isDefault: true,
  },
];

// GET - Fetch all timeline events
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    let events = await TimelineEvent.find().sort({ order: 1 });

    // If no events exist, create default events
    if (events.length === 0) {
      events = await TimelineEvent.insertMany(defaultEvents);
    }

    return NextResponse.json({
      success: true,
      events: events.map((event) => ({
        id: event._id.toString(),
        date: event.date,
        title: event.title,
        description: event.description,
        icon: event.icon,
        order: event.order,
        isDefault: event.isDefault,
      })),
    });
  } catch (error) {
    console.error('Error fetching timeline events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new timeline event
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { date, title, description, icon } = body;

    // Validate required fields
    if (!date || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the highest order number and add 1
    const lastEvent = await TimelineEvent.findOne().sort({ order: -1 });
    const order = lastEvent ? lastEvent.order + 1 : 0;

    // Create new timeline event
    const event = await TimelineEvent.create({
      date,
      title,
      description,
      icon: icon || 'heart',
      order,
      isDefault: false,
    });

    return NextResponse.json(
      {
        success: true,
        event: {
          id: event._id.toString(),
          date: event.date,
          title: event.title,
          description: event.description,
          icon: event.icon,
          order: event.order,
          isDefault: event.isDefault,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating timeline event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update timeline events order
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { events } = body;

    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Invalid events data' },
        { status: 400 }
      );
    }

    // Update order for each event
    const updatePromises = events.map((event: { id: string; order: number }) =>
      TimelineEvent.findByIdAndUpdate(event.id, { order: event.order })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Timeline order updated successfully',
    });
  } catch (error) {
    console.error('Error updating timeline order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Reset to default timeline
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Delete all existing events
    await TimelineEvent.deleteMany({});

    // Create default events
    const events = await TimelineEvent.insertMany(defaultEvents);

    return NextResponse.json({
      success: true,
      message: 'Timeline reset to default',
      events: events.map((event) => ({
        id: event._id.toString(),
        date: event.date,
        title: event.title,
        description: event.description,
        icon: event.icon,
        order: event.order,
        isDefault: event.isDefault,
      })),
    });
  } catch (error) {
    console.error('Error resetting timeline:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
