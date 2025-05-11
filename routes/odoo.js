import express from 'express';
import { getAggregatedTemplates } from '../controllers/odooController.js';

const router = express.Router();
router.get('/aggregated-templates', getAggregatedTemplates);

export default router;
