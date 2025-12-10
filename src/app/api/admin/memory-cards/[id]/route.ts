import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import MemoryCard from '@/models/MemoryCard';
import mongoose from 'mongoose';

// Helper function to validate admin token
async function isAdminAuthenticated(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token) {
            return false;
        }

        const decoded = JSON.parse(
            Buffer.from(token, 'base64').toString('utf-8')
        );

        return decoded.exp && decoded.exp >= Date.now();
    } catch {
        return false;
    }
}

// DELETE - Admin delete any memory card
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify admin authentication
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { id } = await params;

        // Validate ID
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

        // Delete the card (admin can delete any card)
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
