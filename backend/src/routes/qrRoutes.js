import { Router } from 'express';
import { getQRCode } from '../controllers/qrController.js';

const router = Router();

// QR code route can be accessed by authenticated artist or public viewer
router.get('/:performanceId', getQRCode);

export default router;
