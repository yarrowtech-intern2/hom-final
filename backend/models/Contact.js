import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, maxlength: 30 },
    subject: { type: String, required: true, trim: true, maxlength: 180 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },

    // Meta
    status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
    ip: String,
    userAgent: String,
    referer: String,
    // Honeypot (should be empty)
    company: { type: String, default: '' }
  },
  { timestamps: true }
);

ContactMessageSchema.index({ createdAt: -1 });
export default mongoose.model('ContactMessage', ContactMessageSchema);
