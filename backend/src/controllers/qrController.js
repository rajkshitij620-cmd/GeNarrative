import QRCode from 'qrcode';
import { memoryStore } from '../services/store.js';

export const getQRCode = async (req, res) => {
  try {
    const { performanceId } = req.params;
    const performance = memoryStore.findPerformanceById(performanceId);
    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance not found.' });
    }

    const clientHost = process.env.CLIENT_URL || 'http://localhost:5173';
    const publicUrl = `${clientHost}/experience/${performance.slug}`;

    let qrDataUrl = performance.qrCodeDataUrl;
    if (!qrDataUrl) {
      qrDataUrl = await QRCode.toDataURL(publicUrl, {
        color: { dark: '#7C3AED', light: '#0B0F19' },
        margin: 2,
        width: 400
      });
      memoryStore.updatePerformance(performanceId, { qrCodeDataUrl: qrDataUrl });
    }

    res.json({
      success: true,
      performanceId,
      slug: performance.slug,
      publicUrl,
      qrDataUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
