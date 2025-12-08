import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMemoryCard extends Document {
  serialNumber: number;
  name: string;
  message: string;
  photo?: string;
  deviceFingerprint: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MemoryCardSchema: Schema = new Schema(
  {
    serialNumber: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 200,
    },
    photo: {
      type: String,
      required: false,
    },
    deviceFingerprint: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for efficient querying
MemoryCardSchema.index({ createdAt: -1 });
MemoryCardSchema.index({ serialNumber: 1 });

const MemoryCard: Model<IMemoryCard> =
  mongoose.models.MemoryCard || mongoose.model<IMemoryCard>('MemoryCard', MemoryCardSchema);

export default MemoryCard;
