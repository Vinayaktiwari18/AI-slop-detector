import express from 'express';
import multer from 'multer';
import { analyzeText } from '../controllers/analyzeController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain'];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only PDF and TXT files are allowed'));
  },
});

router.post('/analyze', rateLimiter, upload.single('file'), analyzeText);

export default router;