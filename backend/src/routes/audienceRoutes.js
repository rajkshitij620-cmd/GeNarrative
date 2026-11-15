import { Router } from 'express';
import {
  getPublishedPerformancesList,
  getPublicExperience,
  getVisualModeData,
  getAudioModeData,
  getHapticModeData,
  recordAnalytics,
  submitFeedback,
  getAudienceDashboard,
  getSavedPerformances,
  toggleSavePerformance,
  getAudienceHistory,
  recordAudienceHistory,
  updateAudiencePreferences
} from '../controllers/audienceController.js';
import { authenticateToken, requireAudience } from '../middleware/auth.js';

const router = Router();

/* ========================================================
   AUTHENTICATED AUDIENCE ROUTES (REQUIRE AUDIENCE ROLE)
   Must be mounted before wildcard :slug routes
   ======================================================== */
router.get('/dashboard', authenticateToken, requireAudience, getAudienceDashboard);
router.get('/saved', authenticateToken, requireAudience, getSavedPerformances);
router.post('/saved/:performanceId', authenticateToken, requireAudience, toggleSavePerformance);
router.get('/history', authenticateToken, requireAudience, getAudienceHistory);
router.post('/history', authenticateToken, requireAudience, recordAudienceHistory);
router.put('/preferences', authenticateToken, requireAudience, updateAudiencePreferences);

/* ========================================================
   PUBLIC ACCESSIBILITY ROUTES (GUESTS & ANONYMOUS USERS)
   ======================================================== */
router.get('/performances', getPublishedPerformancesList);
router.get('/experience/:slug', getPublicExperience);
router.get('/experience/:slug/visual', getVisualModeData);
router.get('/experience/:slug/audio', getAudioModeData);
router.get('/experience/:slug/haptic', getHapticModeData);
router.post('/experience/:slug/analytics', recordAnalytics);
router.post('/experience/:slug/feedback', submitFeedback);

// Legacy wildcard aliases for backward compatibility with frontend public calls (must be last)
router.get('/:slug/visual', getVisualModeData);
router.get('/:slug/audio', getAudioModeData);
router.get('/:slug/haptic', getHapticModeData);
router.post('/:slug/analytics', recordAnalytics);
router.post('/:slug/feedback', submitFeedback);
router.get('/:slug', getPublicExperience);

export default router;
