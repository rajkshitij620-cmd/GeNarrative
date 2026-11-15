import QRCode from 'qrcode';
import { memoryStore } from '../services/store.js';

export const publishPerformance = async (req, res) => {
  try {
    const { performanceId } = req.params;
    const performance = memoryStore.findPerformanceById(performanceId);
    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance not found.' });
    }

    const timeline = memoryStore.findTimelineByPerformanceId(performanceId);
    if (!timeline) {
      return res.status(400).json({ success: false, message: 'Cannot publish without a synchronized creative timeline.' });
    }

    // Generate public URL & QR
    const clientHost = process.env.CLIENT_URL || 'http://localhost:5173';
    const publicExperienceUrl = `${clientHost}/experience/${performance.slug}`;

    const qrDataUrl = await QRCode.toDataURL(publicExperienceUrl, {
      color: { dark: '#7C3AED', light: '#0B0F19' },
      margin: 2,
      width: 400
    });

    const updated = memoryStore.updatePerformance(performanceId, {
      isPublished: true,
      publishedAt: new Date(),
      status: 'published',
      qrCodeDataUrl: qrDataUrl
    });

    res.json({
      success: true,
      message: 'Performance published! The accessibility timeline is now live for audience scanning.',
      performance: updated,
      publicUrl: publicExperienceUrl,
      qrCodeDataUrl: qrDataUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const unpublishPerformance = async (req, res) => {
  try {
    const { performanceId } = req.params;
    const performance = memoryStore.findPerformanceById(performanceId);
    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance not found.' });
    }

    const updated = memoryStore.updatePerformance(performanceId, {
      isPublished: false,
      status: 'approved'
    });

    res.json({
      success: true,
      message: 'Performance unpublished. Audience links are now restricted.',
      performance: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
