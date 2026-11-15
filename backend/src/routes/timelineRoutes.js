import { Router } from 'express';
import {
  getTimeline,
  updateTimeline,
  addTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent
} from '../controllers/timelineController.js';
import { authenticateToken, requireArtist } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireArtist);

router.get('/:performanceId', getTimeline);
router.put('/:performanceId', updateTimeline);
router.post('/:performanceId/events', addTimelineEvent);
router.put('/events/:eventId', updateTimelineEvent);
router.delete('/events/:eventId', deleteTimelineEvent);

export default router;
