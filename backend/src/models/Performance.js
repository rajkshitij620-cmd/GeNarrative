import mongoose from 'mongoose';

const PerformanceSchema = new mongoose.Schema({
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artistName: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Dance', 'Theatre', 'Music', 'Spoken Word', 'Cultural Performance', 'Other'],
    default: 'Dance' 
  },
  originalLanguage: { type: String, default: 'Bengali' },
  supportedLanguages: [{ type: String, default: ['Bengali', 'Hindi', 'English'] }],
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  duration: { type: Number, default: 60.0 }, // in seconds
  tags: [{ type: String }],
  
  // Processing & Publishing lifecycle
  status: { 
    type: String, 
    enum: ['uploaded', 'queued', 'processing', 'completed', 'failed', 'needs_review', 'approved', 'published'],
    default: 'uploaded'
  },
  processingProgress: { type: Number, default: 0 },
  processingError: { type: String, default: null },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date, default: null },
  
  // Creative protection policy
  protectedElements: [{
    category: { type: String }, // e.g. 'Cultural Meaning', 'Symbolic Movement'
    description: { type: String },
    timestamp: { type: Number }
  }],

  qrCodeDataUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Performance = mongoose.models.Performance || mongoose.model('Performance', PerformanceSchema);
