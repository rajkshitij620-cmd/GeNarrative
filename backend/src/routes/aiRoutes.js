import { Router } from 'express';
import { triggerAIAnalysis, getAIStatus, getAIResults } from '../controllers/aiController.js';
import { authenticateToken, requireArtist } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireArtist);

router.post('/analyze/:id', triggerAIAnalysis);
router.get('/status/:id', getAIStatus);
router.get('/results/:id', getAIResults);

export default router;
