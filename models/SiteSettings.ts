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
  card1Title: {
    type: String,
    default: 'Market Trends',
  },
  card1Description: {
    type: String,
    default: 'Understanding legal due diligence is crucial for real estate transactions. Stay updated with the latest market analysis.',
  },
  card2Title: {
    type: String,
    default: 'Buying Guides',
  },
  card2Description: {
    type: String,
    default: 'Expert advice for first-time buyers and seasoned property investors. Navigate the market with confidence.',
  },
  card3Title: {
    type: String,
    default: 'Investment Tips',
  },
  card3Description: {
    type: String,
    default: 'Ensure all necessary documents are thoroughly reviewed to mitigate risks and protect your investment.',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
