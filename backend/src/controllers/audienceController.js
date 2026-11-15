import { memoryStore } from '../services/store.js';

/* ========================================================
   PUBLIC AUDIENCE ENDPOINTS (NO LOGIN REQUIRED / GUESTS)
   ======================================================== */

export const getPublishedPerformancesList = async (req, res) => {
  try {
    const performances = memoryStore.getPublishedPerformances().map(p => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      artistName: p.artistName,
      description: p.description,
      category: p.category,
      originalLanguage: p.originalLanguage,
      supportedLanguages: p.supportedLanguages,
      thumbnailUrl: p.thumbnailUrl,
      duration: p.duration,
      tags: p.tags,
      publishedAt: p.publishedAt
    }));

    res.json({
      success: true,
      count: performances.length,
      performances
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPublicExperience = async (req, res) => {
  try {
    const { slug } = req.params;
    const performance = memoryStore.findPerformanceBySlug(slug);
    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance not found.' });
    }

    if (!performance.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'This performance is currently in rehearsal or artist review and is not yet published.'
      });
    }

    const timeline = memoryStore.findTimelineByPerformanceId(performance._id);

    // Filter ONLY approved cues for audience consumption
    const sanitizeTrack = (track) => {
      if (!Array.isArray(track)) return [];
      return track.filter(e => e.status === 'artist_approved' || e.status === 'artist_edited');
    };

    const approvedTimeline = timeline ? {
      captions: sanitizeTrack(timeline.captions),
      movementEvents: sanitizeTrack(timeline.movementEvents),
      sceneEvents: sanitizeTrack(timeline.sceneEvents),
      soundEvents: sanitizeTrack(timeline.soundEvents),
      hapticCues: sanitizeTrack(timeline.hapticCues),
      accessibilityDescriptions: sanitizeTrack(timeline.accessibilityDescriptions)
    } : null;

    // Record view in analytics
    memoryStore.recordAnalyticsEvent(slug, 'view');

    res.json({
      success: true,
      performance: {
        id: performance._id,
        title: performance.title,
        slug: performance.slug,
        artistName: performance.artistName,
        description: performance.description,
        category: performance.category,
        originalLanguage: performance.originalLanguage,
        supportedLanguages: performance.supportedLanguages,
        videoUrl: performance.videoUrl,
        thumbnailUrl: performance.thumbnailUrl,
        duration: performance.duration,
        protectedElements: performance.protectedElements || [],
        publishedAt: performance.publishedAt
      },
      timeline: approvedTimeline
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getVisualModeData = async (req, res) => {
  try {
    const { slug } = req.params;
    const performance = memoryStore.findPerformanceBySlug(slug);
    if (!performance || !performance.isPublished) {
      return res.status(404).json({ success: false, message: 'Published performance not found.' });
    }

    const timeline = memoryStore.findTimelineByPerformanceId(performance._id);
    const filterApproved = (track) => (Array.isArray(track) ? track.filter(e => e.status === 'artist_approved' || e.status === 'artist_edited') : []);

    memoryStore.recordAnalyticsEvent(slug, 'visual', req.query.lang || 'english');

    res.json({
      success: true,
      mode: 'visual',
      title: performance.title,
      videoUrl: performance.videoUrl,
      captions: filterApproved(timeline?.captions),
      movementDescriptions: filterApproved(timeline?.movementEvents),
      soundEvents: filterApproved(timeline?.soundEvents),
      sceneEvents: filterApproved(timeline?.sceneEvents)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAudioModeData = async (req, res) => {
  try {
    const { slug } = req.params;
    const performance = memoryStore.findPerformanceBySlug(slug);
    if (!performance || !performance.isPublished) {
      return res.status(404).json({ success: false, message: 'Published performance not found.' });
    }

    const timeline = memoryStore.findTimelineByPerformanceId(performance._id);
    const filterApproved = (track) => (Array.isArray(track) ? track.filter(e => e.status === 'artist_approved' || e.status === 'artist_edited') : []);

    memoryStore.recordAnalyticsEvent(slug, 'audio', req.query.lang || 'english');

    res.json({
      success: true,
      mode: 'audio',
      title: performance.title,
      videoUrl: performance.videoUrl,
      accessibilityDescriptions: filterApproved(timeline?.accessibilityDescriptions),
      movementEvents: filterApproved(timeline?.movementEvents),
      soundEvents: filterApproved(timeline?.soundEvents)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getHapticModeData = async (req, res) => {
  try {
    const { slug } = req.params;
    const performance = memoryStore.findPerformanceBySlug(slug);
    if (!performance || !performance.isPublished) {
      return res.status(404).json({ success: false, message: 'Published performance not found.' });
    }

    const timeline = memoryStore.findTimelineByPerformanceId(performance._id);
    const filterApproved = (track) => (Array.isArray(track) ? track.filter(e => e.status === 'artist_approved' || e.status === 'artist_edited') : []);

    memoryStore.recordAnalyticsEvent(slug, 'haptic');

    res.json({
      success: true,
      mode: 'haptic',
      title: performance.title,
      videoUrl: performance.videoUrl,
      hapticCues: filterApproved(timeline?.hapticCues),
      soundEvents: filterApproved(timeline?.soundEvents)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const recordAnalytics = async (req, res) => {
  try {
    const { slug } = req.params;
    const { eventType, language } = req.body;
    const updated = memoryStore.recordAnalyticsEvent(slug, eventType, language);
    res.json({ success: true, analytics: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { slug } = req.params;
    const performance = memoryStore.findPerformanceBySlug(slug);
    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance not found.' });
    }

    const { captionClarity, audioQuality, hapticUtility, overallRating, modeUsed, comment } = req.body;

    const feedback = memoryStore.addFeedback({
      performanceId: performance._id,
      captionClarity: parseInt(captionClarity) || 5,
      audioQuality: parseInt(audioQuality) || 5,
      hapticUtility: parseInt(hapticUtility) || 5,
      overallRating: parseInt(overallRating) || 5,
      modeUsed: modeUsed || 'visual',
      comment: comment || ''
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your accessibility feedback! It helps artists continuously improve universal experiences.',
      feedback
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ========================================================
   AUTHENTICATED AUDIENCE ENDPOINTS (REQUIRE AUDIENCE ROLE)
   ======================================================== */

export const getAudienceDashboard = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = memoryStore.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Audience member not found.' });
    }

    const savedPerformances = memoryStore.getSavedPerformancesForUser(userId);
    const viewingHistory = memoryStore.getViewingHistoryForUser(userId);
    const publishedPerformances = memoryStore.getPublishedPerformances();

    res.json({
      success: true,
      dashboard: {
        profile: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          accessibilityPreferences: user.accessibilityPreferences
        },
        savedCount: savedPerformances.length,
        historyCount: viewingHistory.length,
        availablePerformancesCount: publishedPerformances.length,
        savedPerformances,
        recentHistory: viewingHistory.slice(0, 6),
        explorePerformances: publishedPerformances.slice(0, 6)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSavedPerformances = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const performances = memoryStore.getSavedPerformancesForUser(userId);
    res.json({ success: true, count: performances.length, performances });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleSavePerformance = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { performanceId } = req.params;

    const result = memoryStore.toggleSavePerformance(userId, performanceId);
    res.json({
      success: true,
      message: result.saved ? 'Performance saved to your accessible library.' : 'Performance removed from saved library.',
      saved: result.saved,
      savedPerformances: result.savedPerformances
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAudienceHistory = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const history = memoryStore.getViewingHistoryForUser(userId);
    res.json({ success: true, count: history.length, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const recordAudienceHistory = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { performanceId, title, slug, thumbnailUrl, artistName, category, modeUsed } = req.body;

    const history = memoryStore.recordViewingHistory(userId, {
      performanceId,
      title,
      slug,
      thumbnailUrl,
      artistName,
      category,
      modeUsed
    });

    res.json({ success: true, message: 'Viewing history logged.', history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAudiencePreferences = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const updatedPrefs = memoryStore.updateAudiencePreferences(userId, req.body);
    res.json({
      success: true,
      message: 'Accessibility preferences updated successfully.',
      preferences: updatedPrefs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
