import mongoose, { Schema, model, models } from 'mongoose';

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  category: {
    type: String,
    default: 'General',
  },
  tags: [String],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likesEnabled: {
    type: Boolean,
    default: true,
  },
  commentsEnabled: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
  },
});

export default models.Article || model('Article', ArticleSchema);
