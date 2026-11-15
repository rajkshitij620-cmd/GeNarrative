import { Router } from 'express';
import {
  getPerformances,
  getPerformanceById,
  createPerformance,
  updatePerformance,
  deletePerformance,
  getArtistAnalytics
} from '../controllers/performanceController.js';
import { authenticateToken, requireArtist } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB
});

const router = Router();

// Protect all performance management routes with Artist role
router.use(authenticateToken, requireArtist);

router.get('/', getPerformances);
router.get('/analytics', getArtistAnalytics);
router.get('/:id', getPerformanceById);
router.post(
  '/',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  createPerformance
);
router.put('/:id', updatePerformance);
router.delete('/:id', deletePerformance);

export default router;
