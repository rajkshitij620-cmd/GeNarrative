import { memoryStore } from '../services/store.js';
import QRCode from 'qrcode';

export const getPerformances = async (req, res) => {
  try {
    const artistId = req.user.id || req.user._id;
    // Artist sees strictly their own performances
    const performances = memoryStore.findPerformancesByArtist(artistId);
    res.json({ success: true, count: performances.length, performances });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPerformanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const performance = memoryStore.findPerformanceById(id);
    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance not found.' });
    }

    // Ensure the artist owns it (or if it's published and accessible)
    const userId = req.user?.id || req.user?._id;
    if (String(performance.artistId) !== String(userId) && !performance.isPublished) {
      return res.status(403).json({ success: false, message: 'Unauthorized. You do not own this unpublished performance.' });
    }

    res.json({ success: true, performance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createPerformance = async (req, res) => {
  try {
    const {
      title,
      description,
      category = 'Dance',
      originalLanguage = 'Bengali',
      supportedLanguages = 'Bengali, Hindi, English',
      tags = '',
      duration = 60.0
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Performance title is required.' });
    }

    const artistId = req.user.id || req.user._id;
    const artistName = req.user.name || 'Artist';

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Generate high-resolution QR code pointing to public audience experience
    const audienceUrl = `http://localhost:5173/experience/${slug}`;
    const qrCodeDataUrl = await QRCode.toDataURL(audienceUrl, {
      color: { dark: '#7C3AED', light: '#0B0F19' },
      margin: 2,
      width: 400
    });

    const parsedSupportedLanguages = typeof supportedLanguages === 'string'
      ? supportedLanguages.split(',').map(s => s.trim()).filter(Boolean)
      : supportedLanguages;

    const parsedTags = typeof tags === 'string'
      ? tags.split(',').map(s => s.trim()).filter(Boolean)
      : tags;

    // Handle uploaded video and thumbnail files
    const videoFile = req.files?.video?.[0] || req.file;
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile) {
      return res.status(400).json({ success: false, message: 'Please upload a video file for your stage performance.' });
    }

    const videoUrl = `/uploads/${videoFile.filename}`;
    const thumbnailUrl = thumbnailFile
      ? `/uploads/${thumbnailFile.filename}`
      : '';

    const newPerformance = memoryStore.createPerformance({
      artistId,
      artistName,
      title,
      slug,
      description: description || 'Multimodal performance with synchronized accessibility layers.',
      category,
      originalLanguage,
      supportedLanguages: parsedSupportedLanguages,
      videoUrl,
      thumbnailUrl,
      duration: parseFloat(duration) || 60.0,
      tags: parsedTags,
      status: 'uploaded',
      processingProgress: 0,
      processingError: null,
      isPublished: false,
      protectedElements: [
        {
          category: 'Cultural Meaning',
          description: 'Preserve authentic mudra interpretation and rhythmic footwork without AI deviation.',
          timestamp: 5.0
        }
      ],
      qrCodeDataUrl
    });

    // Initialize blank synchronized timeline
    if (typeof memoryStore.createTimeline === 'function') {
      memoryStore.createTimeline(newPerformance._id);
    } else if (typeof memoryStore.createOrUpdateTimeline === 'function') {
      memoryStore.createOrUpdateTimeline(newPerformance._id, {});
    }

    res.status(201).json({
      success: true,
      message: 'Performance created successfully. Video ingestion queued.',
      performance: newPerformance
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = memoryStore.findPerformanceById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Performance not found.' });
    }

    // Strictly check ownership - only the owning artist can modify
    if (String(existing.artistId) !== String(req.user.id || req.user._id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized. You do not own this performance.' });
    }

    const updated = memoryStore.updatePerformance(id, req.body);
    res.json({ success: true, message: 'Performance updated.', performance: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = memoryStore.findPerformanceById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Performance not found.' });
    }

    // Strictly check ownership - only the owning artist can delete
    if (String(existing.artistId) !== String(req.user.id || req.user._id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized. You do not own this performance.' });
    }

    memoryStore.deletePerformance(id);
    res.json({ success: true, message: 'Performance and synchronized timeline removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================================================================
// ARTIST ANALYTICS — real data aggregated from memoryStore
// GET /api/performances/analytics
// ================================================================
export const getArtistAnalytics = async (req, res) => {
  try {
    const artistId = req.user.id || req.user._id;
    const performances = memoryStore.findPerformancesByArtist(artistId);

    // Aggregate analytics across all artist performances
    let totalQrScans = 0;
    let totalViews = 0;
    let totalVisual = 0;
    let totalAudio = 0;
    let totalHaptic = 0;
    let langBengali = 0;
    let langHindi = 0;
    let langEnglish = 0;

    const perPerformance = performances.map(p => {
      const ana = memoryStore.getAnalyticsBySlug(p.slug) || {};
      totalQrScans   += ana.qrScans        || 0;
      totalViews     += ana.totalViews     || 0;
      totalVisual    += ana.visualModeUses || 0;
      totalAudio     += ana.audioModeUses  || 0;
      totalHaptic    += ana.hapticModeUses || 0;
      langBengali    += ana.languageSelections?.bengali || 0;
      langHindi      += ana.languageSelections?.hindi   || 0;
      langEnglish    += ana.languageSelections?.english || 0;

      const feedbacks = memoryStore.getFeedbacksByPerformanceId(p._id);
      const avgRating = feedbacks.length
        ? (feedbacks.reduce((s, f) => s + (f.overallRating || 0), 0) / feedbacks.length).toFixed(1)
        : null;

      return {
        performanceId: p._id,
        title: p.title,
        slug: p.slug,
        qrScans:      ana.qrScans        || 0,
        totalViews:   ana.totalViews     || 0,
        visualUses:   ana.visualModeUses || 0,
        audioUses:    ana.audioModeUses  || 0,
        hapticUses:   ana.hapticModeUses || 0,
        feedbackCount: feedbacks.length,
        avgRating
      };
    });

    // Build feedback list (all performances combined, newest first, up to 20)
    const allFeedbacks = performances
      .flatMap(p => memoryStore.getFeedbacksByPerformanceId(p._id).map(f => ({
        ...f,
        performanceTitle: p.title
      })))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);

    const totalFeedbacks = allFeedbacks.length;
    const avgOverall = totalFeedbacks
      ? (allFeedbacks.reduce((s, f) => s + (f.overallRating || 0), 0) / totalFeedbacks).toFixed(1)
      : null;

    res.json({
      success: true,
      analytics: {
        summary: {
          totalQrScans,
          totalViews,
          totalVisual,
          totalAudio,
          totalHaptic,
          totalFeedbacks,
          avgOverallRating: avgOverall,
          languages: {
            bengali: langBengali,
            hindi: langHindi,
            english: langEnglish
          }
        },
        perPerformance,
        recentFeedback: allFeedbacks
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
