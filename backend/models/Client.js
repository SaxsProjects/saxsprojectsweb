import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  businessName: { type: String },
  contactInfo: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Client', clientSchema);
