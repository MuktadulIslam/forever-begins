import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MemoryCard from '@/models/MemoryCard';

// POST - Create a new memory card
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;
    const password = formData.get('password') as string;
    const deviceFingerprint = formData.get('deviceFingerprint') as string;
    const photo = formData.get('photo') as File | null;

    // Validate required fields
    if (!name || !message || !password || !deviceFingerprint) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate password
    if (password !== process.env.MEMORY_CARD_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Validate message length
    if (message.length > 200) {
      return NextResponse.json(
        { error: 'Message must be 200 characters or less' },
        { status: 400 }
      );
    }

    // Upload photo to ImgBB if provided
    let photoUrl: string | undefined;
    if (photo && photo.size > 0) {
      try {
        const imgbbApiKey = process.env.IMGBB_API_KEY;
        if (!imgbbApiKey) {
          throw new Error('ImgBB API key not configured');
        }

        // Convert file to base64
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');

        // Get folder name from environment (default to 'forever-begins')
        const folderName = process.env.IMGBB_FOLDER || 'forever-begins';

        // Upload to ImgBB
        // Note: ImgBB organizes by album/folder through the image name
        const imgbbFormData = new FormData();
        imgbbFormData.append('image', base64Image);
        imgbbFormData.append('name', `${folderName}/memory-card-${Date.now()}`);

        const imgbbResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          {
            method: 'POST',
            body: imgbbFormData,
          }
        );

        if (!imgbbResponse.ok) {
          throw new Error('Failed to upload image to ImgBB');
        }

        const imgbbData = await imgbbResponse.json();
        photoUrl = imgbbData.data.url;
      } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Get the next serial number
    const lastCard = await MemoryCard.findOne().sort({ serialNumber: -1 });
    const serialNumber = lastCard ? lastCard.serialNumber + 1 : 1;

    // Create new memory card
    const memoryCard = await MemoryCard.create({
      serialNumber,
      name,
      message,
      photo: photoUrl,
      deviceFingerprint,
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        card: {
          id: memoryCard._id.toString(),
          serialNumber: memoryCard.serialNumber,
          name: memoryCard.name,
          message: memoryCard.message,
          photo: memoryCard.photo,
          timestamp: memoryCard.timestamp,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating memory card:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch all memory cards
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '0');
    const deviceFingerprint = searchParams.get('deviceFingerprint');

    // Fetch memory cards sorted by newest first
    let query = MemoryCard.find().sort({ createdAt: -1 });

    if (limit > 0) {
      query = query.limit(limit);
    }

    const cards = await query.exec();

    // Add ownership flag if deviceFingerprint is provided
    const cardsWithOwnership = cards.map((card) => ({
      id: card._id.toString(),
      serialNumber: card.serialNumber,
      name: card.name,
      message: card.message,
      photo: card.photo,
      timestamp: card.timestamp,
      isOwner: deviceFingerprint ? card.deviceFingerprint === deviceFingerprint : false,
    }));

    return NextResponse.json({
      success: true,
      cards: cardsWithOwnership,
      total: cards.length,
    });
  } catch (error) {
    console.error('Error fetching memory cards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
