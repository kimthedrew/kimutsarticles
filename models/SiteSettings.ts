import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    default: 'Real Estate Insights',
  },
  heroSubtitle: {
    type: String,
    default: 'Educational insights for aspiring real estate investors. Stay informed with expert analysis, market trends, and proven investment strategies.',
  },
  heroTag: {
    type: String,
    default: 'Key Insights',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
