import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['artist', 'audience'], default: 'artist' },
  bio: { type: String, default: '' },
  culturalSpecialty: { type: String, default: 'Classical & Contemporary Dance' },
  avatar: { type: String, default: '' },
  accessibilityPreferences: {
    preferredLanguage: { type: String, default: 'English' },
    defaultMode: { type: String, default: 'visual' },
    highContrast: { type: Boolean, default: false },
    hapticIntensity: { type: Number, default: 1.0 },
    fontSize: { type: String, default: 'normal' }
  },
  savedPerformances: [{ type: String }],
  viewingHistory: [{
    performanceId: { type: String },
    title: { type: String },
    slug: { type: String },
    thumbnailUrl: { type: String },
    artistName: { type: String },
    category: { type: String },
    watchedAt: { type: Date, default: Date.now },
    modeUsed: { type: String, default: 'visual' }
  }],
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
