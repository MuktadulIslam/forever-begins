import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITimelineEvent extends Document {
  date: string;
  title: string;
  description: string;
  icon: 'heart' | 'sparkles';
  order: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineEventSchema: Schema = new Schema(
  {
    date: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      enum: ['heart', 'sparkles'],
      default: 'heart',
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
TimelineEventSchema.index({ order: 1 });

const TimelineEvent: Model<ITimelineEvent> =
  mongoose.models.TimelineEvent ||
  mongoose.model<ITimelineEvent>('TimelineEvent', TimelineEventSchema);

export default TimelineEvent;
