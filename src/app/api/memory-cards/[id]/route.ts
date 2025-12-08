import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MemoryCard from '@/models/MemoryCard';
import mongoose from 'mongoose';

// DELETE - Delete a memory card (only if user owns it)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const deviceFingerprint = searchParams.get('deviceFingerprint');

    // Validate inputs
    if (!deviceFingerprint) {
      return NextResponse.json(
        { error: 'Device fingerprint required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid card ID' },
        { status: 400 }
      );
    }

    // Find the card
    const card = await MemoryCard.findById(id);

    if (!card) {
      return NextResponse.json(
        { error: 'Memory card not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (card.deviceFingerprint !== deviceFingerprint) {
      return NextResponse.json(
        { error: 'You can only delete cards you created' },
        { status: 403 }
      );
    }

    // Delete the card
    await MemoryCard.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Memory card deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting memory card:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get a specific memory card
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid card ID' },
        { status: 400 }
      );
    }

    const card = await MemoryCard.findById(id);

    if (!card) {
      return NextResponse.json(
        { error: 'Memory card not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const deviceFingerprint = searchParams.get('deviceFingerprint');

    return NextResponse.json({
      success: true,
      card: {
        id: card._id.toString(),
        serialNumber: card.serialNumber,
        name: card.name,
        message: card.message,
        photo: card.photo,
        timestamp: card.timestamp,
        isOwner: deviceFingerprint ? card.deviceFingerprint === deviceFingerprint : false,
      },
    });
  } catch (error) {
    console.error('Error fetching memory card:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
