import { Router } from 'express';
import { publishPerformance, unpublishPerformance } from '../controllers/publishController.js';
import { authenticateToken, requireArtist } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireArtist);

router.post('/:performanceId', publishPerformance);
router.post('/unpublish/:performanceId', unpublishPerformance);

export default router;
