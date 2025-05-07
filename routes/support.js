import express from 'express';
import { uploadSupportTicket } from '../controllers/supportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', protect, uploadSupportTicket);

export default router;