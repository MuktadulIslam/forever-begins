import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  description: string;
  coverImage: string; // Base64 or URL
  googlePhotosLink: string;
  order: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AlbumSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    googlePhotosLink: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for efficient querying
AlbumSchema.index({ order: 1 });

const Album: Model<IAlbum> =
  mongoose.models.Album || mongoose.model<IAlbum>('Album', AlbumSchema);

export default Album;
