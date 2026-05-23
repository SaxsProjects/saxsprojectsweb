import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' }
});

const projectSchema = new mongoose.Schema({
  clientEmail: { type: String, required: true, index: true },
  title: { type: String, required: true },
  tier: { type: String, required: true },
  progress: { type: Number, default: 0 },
  status: { type: String },
  cost: { type: String },
  timeline: { type: String },
  milestones: [milestoneSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);
