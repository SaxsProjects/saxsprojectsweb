import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  businessName: { type: String },
  contactInfo: { type: String },
  phone: { type: String },
  service: { type: String },
  // When the person agreed (POPIA) that we may use their details to reply.
  consentAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Client', clientSchema);
