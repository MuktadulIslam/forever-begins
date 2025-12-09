import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Album from '@/models/Album';

// PUT - Update a specific album
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const params = await context.params;
    const body = await request.json();
    const { title, description, coverImage, googlePhotosLink } = body;

    // Validate required fields
    if (!title || !description || !googlePhotosLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: any = {
      title,
      description,
      googlePhotosLink,
    };

    // Only update coverImage if provided
    if (coverImage) {
      updateData.coverImage = coverImage;
    }

    // Update album
    const album = await Album.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!album) {
      console.error('Album not found with ID:', params.id);
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      album: {
        id: album._id.toString(),
        title: album.title,
        description: album.description,
        coverImage: album.coverImage,
        googlePhotosLink: album.googlePhotosLink,
        order: album.order,
        isDefault: album.isDefault,
      },
    });
  } catch (error) {
    console.error('Error updating album:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

