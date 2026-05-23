import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  author: { type: String, default: 'SAXS Admin' },
  category: { type: String, default: 'General' },
  content: { type: String, required: true },
  excerpt: { type: String },
  tags: [{ type: String }],
  published: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date }
});

export default mongoose.model('Blog', blogSchema);
