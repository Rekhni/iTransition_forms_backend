import express from 'express';
import { addComment, getComments } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:templateId', protect, addComment);
router.get('/:templateId', getComments);

export default router;