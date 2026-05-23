import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
  clientEmail: { type: String, required: true, index: true },
  invoiceId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  desc: { type: String },
  amount: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'PAID', 'PENDING RELEASE'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Billing', billingSchema);
