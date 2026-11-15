import mongoose from 'mongoose';

const CaptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  text: {
    bengali: { type: String, default: '' },
    hindi: { type: String, default: '' },
    english: { type: String, default: '' }
  },
  speaker: { type: String, default: 'Performer' },
  status: { type: String, enum: ['ai_suggested', 'artist_approved', 'artist_edited', 'rejected'], default: 'ai_suggested' }
});

const MovementEventSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  duration: { type: Number, default: 2.0 },
  poseName: { type: String, default: '' },
  description: { type: String, required: true },
  bodyRegion: { type: String, default: 'full_body' }, // arms, mudra, torso, footwork, full_body
  style: { type: String, enum: ['literal', 'poetic', 'minimal'], default: 'literal' },
  confidence: { type: Number, default: 0.85 },
  status: { type: String, enum: ['ai_suggested', 'artist_approved', 'artist_edited', 'rejected'], default: 'ai_suggested' }
});

const SceneEventSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  lightingCue: { type: String, default: '' },
  spatialFocus: { type: String, default: 'center_stage' },
  description: { type: String, required: true },
  status: { type: String, enum: ['ai_suggested', 'artist_approved', 'artist_edited', 'rejected'], default: 'ai_suggested' }
});

const SoundEventSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  instrumentOrCue: { type: String, default: '' }, // e.g. Ghungroo, Tabla Theka, Sitar Taan, Flute
  intensity: { type: String, enum: ['soft', 'moderate', 'crescendo', 'dynamic', 'abrupt'], default: 'moderate' },
  description: { type: String, required: true },
  status: { type: String, enum: ['ai_suggested', 'artist_approved', 'artist_edited', 'rejected'], default: 'ai_suggested' }
});

const HapticCueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  durationMs: { type: Number, default: 200 },
  intensity: { type: Number, default: 75 }, // 0 to 100
  pattern: [{ type: Number }], // e.g. [150, 50, 150]
  patternType: { type: String, enum: ['pulse', 'heartbeat', 'rhythm', 'crescendo', 'subtle', 'double_tap'], default: 'pulse' },
  label: { type: String, default: 'Rhythm Beat' },
  associatedEventId: { type: String, default: '' },
  status: { type: String, enum: ['ai_suggested', 'artist_approved', 'artist_edited', 'rejected'], default: 'ai_suggested' }
});

const AccessibilityDescriptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  duration: { type: Number, default: 3.5 },
  style: { type: String, enum: ['literal', 'poetic', 'minimal'], default: 'literal' },
  text: {
    bengali: { type: String, default: '' },
    hindi: { type: String, default: '' },
    english: { type: String, default: '' }
  },
  audioUrl: {
    bengali: { type: String, default: '' },
    hindi: { type: String, default: '' },
    english: { type: String, default: '' }
  },
  status: { type: String, enum: ['ai_suggested', 'artist_approved', 'artist_edited', 'rejected'], default: 'ai_suggested' }
});

const CreativeTimelineSchema = new mongoose.Schema({
  performanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Performance', required: true, unique: true },
  version: { type: Number, default: 1 },
  lastSavedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  captions: [CaptionSchema],
  movementEvents: [MovementEventSchema],
  sceneEvents: [SceneEventSchema],
  soundEvents: [SoundEventSchema],
  hapticCues: [HapticCueSchema],
  accessibilityDescriptions: [AccessibilityDescriptionSchema],
  isApproved: { type: Boolean, default: false },
  approvedAt: { type: Date, default: null },
  updatedAt: { type: Date, default: Date.now }
});

export const CreativeTimeline = mongoose.models.CreativeTimeline || mongoose.model('CreativeTimeline', CreativeTimelineSchema);
