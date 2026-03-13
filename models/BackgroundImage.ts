import mongoose from 'mongoose';

const BackgroundImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  fileSize: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.BackgroundImage || mongoose.model('BackgroundImage', BackgroundImageSchema);
