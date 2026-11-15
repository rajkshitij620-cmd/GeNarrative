import { Router } from 'express';
import { approveCue, rejectCue, getApprovalStatus } from '../controllers/approvalController.js';
import { authenticateToken, requireArtist } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireArtist);

router.post('/:performanceId/approve', approveCue);
router.post('/:performanceId/reject', rejectCue);
router.get('/:performanceId/status', getApprovalStatus);

export default router;
