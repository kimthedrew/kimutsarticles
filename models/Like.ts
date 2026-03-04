import mongoose, { Schema, model, models } from 'mongoose';

const LikeSchema = new Schema({
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

LikeSchema.index({ article: 1, ipAddress: 1 }, { unique: true });

export default models.Like || model('Like', LikeSchema);
