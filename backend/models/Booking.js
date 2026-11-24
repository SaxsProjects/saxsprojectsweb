import mongoose from 'mongoose';

// A free 15-minute consultation. The partial unique index means two active
// bookings can never hold the same start time.
const bookingSchema = new mongoose.Schema({
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  date: { type: String, required: true, index: true }, // YYYY-MM-DD (SAST)
  time: { type: String, required: true },              // HH:MM (SAST)
  email: { type: String, required: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true, maxlength: 200 },
  phone: { type: String, trim: true, maxlength: 40 },
  meetLink: { type: String },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed', 'no_show'], default: 'confirmed', index: true },
  createdAt: { type: Date, default: Date.now },
});

bookingSchema.index({ startsAt: 1 }, { unique: true, partialFilterExpression: { status: 'confirmed' } });

export default mongoose.model('Booking', bookingSchema);
