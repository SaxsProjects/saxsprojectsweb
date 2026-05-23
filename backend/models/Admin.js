import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'manager', 'developer'], default: 'developer' },
  permissions: {
    canManageClients: { type: Boolean, default: true },
    canManageProjects: { type: Boolean, default: true },
    canManageBilling: { type: Boolean, default: true },
    canViewAnalytics: { type: Boolean, default: true },
    canManageAdmins: { type: Boolean, default: false }
  },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Admin', adminSchema);
