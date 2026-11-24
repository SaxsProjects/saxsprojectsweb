import mongoose from 'mongoose';

// Every enquiry from the website is kept (one document per submission), so
// nothing is lost when the same person writes again.
const inquirySchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 200 },
  phone: { type: String, trim: true, maxlength: 40 },
  businessName: { type: String, trim: true, maxlength: 200 },
  service: { type: String, trim: true, maxlength: 120 },
  details: { type: String, required: true, maxlength: 5000 },
  quote: { type: mongoose.Schema.Types.Mixed },
  consentAt: { type: Date },
  status: { type: String, enum: ['new', 'contacted', 'quoted', 'won', 'lost', 'spam'], default: 'new', index: true },
  emailDelivered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.model('Inquiry', inquirySchema);
