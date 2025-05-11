import express from 'express';
import { pushToOdoo } from '../controllers/odooPushController.js';

const router = express.Router();
router.get('/push', pushToOdoo);

export default router;
