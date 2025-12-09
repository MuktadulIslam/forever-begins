import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Album from '@/models/Album';

// Default album data
const defaultAlbums = [
  {
    title: 'Engagement Ceremony',
    description: 'The beautiful beginning of our journey',
    coverImage: '/images/wedding-couple1.png',
    googlePhotosLink: 'https://photos.google.com/your-engagement-album',
    order: 0,
    isDefault: true,
  },
  {
    title: 'Pre-Wedding Shoot',
    description: 'Captured moments of love and laughter',
    coverImage: '/images/wedding-couple2.png',
    googlePhotosLink: 'https://photos.google.com/your-prewedding-album',
    order: 1,
    isDefault: true,
  },
  {
    title: 'Haldi & Mehendi',
    description: 'Colors of tradition and celebration',
    coverImage: '/images/wedding-couple3.png',
    googlePhotosLink: 'https://photos.google.com/your-haldi-album',
    order: 2,
    isDefault: true,
  },
  {
    title: 'Wedding Reception',
    description: 'An evening of love and blessings',
    coverImage: '/images/wedding-couple4.png',
    googlePhotosLink: 'https://photos.google.com/your-reception-album',
    order: 3,
    isDefault: true,
  },
];

// GET - Fetch all albums
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    let albums = await Album.find().sort({ order: 1 });

    // If no albums exist, create default albums
    if (albums.length === 0) {
      albums = await Album.insertMany(defaultAlbums);
    }

    return NextResponse.json({
      success: true,
      albums: albums.map((album) => ({
        id: album._id.toString(),
        title: album.title,
        description: album.description,
        coverImage: album.coverImage,
        googlePhotosLink: album.googlePhotosLink,
        order: album.order,
        isDefault: album.isDefault,
      })),
    });
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


// DELETE - Reset to default albums
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Delete all existing albums
    await Album.deleteMany({});

    // Create default albums
    const albums = await Album.insertMany(defaultAlbums);

    return NextResponse.json({
      success: true,
      message: 'Albums reset to default',
      albums: albums.map((album) => ({
        id: album._id.toString(),
        title: album.title,
        description: album.description,
        coverImage: album.coverImage,
        googlePhotosLink: album.googlePhotosLink,
        order: album.order,
        isDefault: album.isDefault,
      })),
    });
  } catch (error) {
    console.error('Error resetting albums:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
