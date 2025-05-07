import express from 'express';
import { uploadSupportTicketToGoogle } from '../controllers/supportController.js';

const router = express.Router();

router.post('/upload', uploadSupportTicketToGoogle);

export default router;
