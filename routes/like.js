import express from 'express';
import { toggleLike, getLikeCount } from '../controllers/likeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:templateId', protect, toggleLike);
router.get('/:templateId', getLikeCount);

export default router;