import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TimelineEvent from '@/models/TimelineEvent';

// PUT - Update a timeline event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { date, title, description, icon } = body;

    // Validate required fields
    if (!date || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the event and set isDefault to false when edited
    const event = await TimelineEvent.findByIdAndUpdate(
      id,
      {
        date,
        title,
        description,
        icon: icon || 'heart',
        isDefault: false,
      },
      { new: true }
    );

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Error updating timeline event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a timeline event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const event = await TimelineEvent.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Reorder remaining events
    const events = await TimelineEvent.find().sort({ order: 1 });
    const updatePromises = events.map((evt, index) =>
      TimelineEvent.findByIdAndUpdate(evt._id, { order: index })
    );
    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting timeline event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
