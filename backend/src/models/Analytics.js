import mongoose from 'mongoose';

const AudienceAnalyticsSchema = new mongoose.Schema({
  performanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Performance', required: true },
  slug: { type: String, required: true },
  totalViews: { type: Number, default: 0 },
  qrScans: { type: Number, default: 0 },
  visualModeUses: { type: Number, default: 0 },
  audioModeUses: { type: Number, default: 0 },
  hapticModeUses: { type: Number, default: 0 },
  languageSelections: {
    bengali: { type: Number, default: 0 },
    hindi: { type: Number, default: 0 },
    english: { type: Number, default: 0 }
  },
  lastAccessed: { type: Date, default: Date.now }
});

const AudienceFeedbackSchema = new mongoose.Schema({
  performanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Performance', required: true },
  captionClarity: { type: Number, min: 1, max: 5, default: 5 },
  audioQuality: { type: Number, min: 1, max: 5, default: 5 },
  hapticUtility: { type: Number, min: 1, max: 5, default: 5 },
  overallRating: { type: Number, min: 1, max: 5, default: 5 },
  modeUsed: { type: String, enum: ['visual', 'audio', 'haptic', 'combined', 'other'], default: 'visual' },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const AudienceAnalytics = mongoose.models.AudienceAnalytics || mongoose.model('AudienceAnalytics', AudienceAnalyticsSchema);
export const AudienceFeedback = mongoose.models.AudienceFeedback || mongoose.model('AudienceFeedback', AudienceFeedbackSchema);
