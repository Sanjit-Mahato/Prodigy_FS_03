import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISupportTicketDocument extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicketDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  },
  { timestamps: true }
);

export const SupportTicket: Model<ISupportTicketDocument> =
  mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicketDocument>('SupportTicket', SupportTicketSchema);

export default SupportTicket;
